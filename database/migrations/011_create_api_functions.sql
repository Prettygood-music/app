-- Migration: 011_create_api_functions.sql
-- Description: Creates API functions for the PostgREST interface

------------------------------------------------------------------------
-- Authentication API Functions
------------------------------------------------------------------------

-- Function to create a new user
CREATE OR REPLACE FUNCTION prettygood.register_user(
  wallet_address TEXT,
  username TEXT,
  display_name TEXT DEFAULT NULL
) RETURNS prettygood.users AS $$
DECLARE
  new_user prettygood.users;
BEGIN
  INSERT INTO prettygood.users (wallet_address, username, display_name)
  VALUES (wallet_address, username, COALESCE(display_name, username))
  RETURNING * INTO new_user;
  
  -- Create default settings for the user
  INSERT INTO prettygood.user_settings (user_id)
  VALUES (new_user.id);
  
  -- Create auth entry
  INSERT INTO prettygood_private.user_auth (user_id)
  VALUES (new_user.id);
  
  RETURN new_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate a nonce for wallet authentication
CREATE OR REPLACE FUNCTION prettygood.generate_nonce(
  wallet_address TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  nonce TEXT;
BEGIN
  -- Get user_id from wallet address
  SELECT id INTO user_id
  FROM prettygood.users
  WHERE wallet_address = generate_nonce.wallet_address;
  
  -- Generate a random nonce
  nonce := encode(gen_random_bytes(32), 'hex');
  
  IF user_id IS NOT NULL THEN
    -- Update existing user's nonce
    UPDATE prettygood_private.user_auth
    SET nonce = nonce,
        nonce_created_at = NOW()
    WHERE user_id = user_id;
  END IF;
  
  RETURN nonce;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify a wallet signature and create a JWT token
-- Note: This is a placeholder. Actual signature verification would be handled by application code.
CREATE OR REPLACE FUNCTION prettygood.verify_signature(
  wallet_address TEXT,
  signature TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  user_role TEXT;
BEGIN
  -- Get user from wallet address
  SELECT id INTO user_id
  FROM prettygood.users
  WHERE wallet_address = verify_signature.wallet_address;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT CASE WHEN EXISTS (
    SELECT 1 FROM prettygood.artists WHERE id = user_id
  ) THEN 'artist' ELSE 'user' END INTO user_role;
  
  -- Update last sign in time
  UPDATE prettygood_private.user_auth
  SET last_sign_in = NOW(),
      last_sign_in_ip = current_setting('request.headers')::json->>'x-forwarded-for'
  WHERE user_id = user_id;
  
  -- In a real implementation, we would verify the signature here
  -- and then generate a JWT token. This is a placeholder.
  RETURN 'jwt_token_placeholder';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------------------------
-- Artist API Functions
------------------------------------------------------------------------

-- Function to register a user as an artist
CREATE OR REPLACE FUNCTION prettygood.register_as_artist(
  artist_name TEXT,
  bio TEXT DEFAULT NULL,
  genre TEXT[] DEFAULT NULL,
  location TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  social_links JSONB DEFAULT NULL
) RETURNS prettygood.artists AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
  new_artist prettygood.artists;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if user is already an artist
  IF EXISTS (SELECT 1 FROM prettygood.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User is already registered as an artist';
  END IF;
  
  -- Create artist profile
  INSERT INTO prettygood.artists (
    id, 
    artist_name, 
    bio, 
    genre, 
    location, 
    website, 
    social_links
  )
  VALUES (
    current_user_id, 
    artist_name, 
    bio, 
    genre, 
    location, 
    website, 
    COALESCE(social_links, '{}'::jsonb)
  )
  RETURNING * INTO new_artist;
  
  RETURN new_artist;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------------------------
-- Content Management API Functions
------------------------------------------------------------------------

-- Function to add a track to a playlist
CREATE OR REPLACE FUNCTION prettygood.add_track_to_playlist(
  playlist_id UUID,
  track_id UUID
) RETURNS VOID AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
  max_position INTEGER;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if playlist exists and user has permission
  IF NOT EXISTS (
    SELECT 1 FROM prettygood.playlists
    WHERE id = playlist_id
    AND (
      user_id = current_user_id OR
      (
        collaborative = TRUE AND
        EXISTS (
          SELECT 1 FROM prettygood.playlist_collaborators
          WHERE playlist_id = add_track_to_playlist.playlist_id
          AND user_id = current_user_id
        )
      )
    )
  ) THEN
    RAISE EXCEPTION 'Playlist not found or no permission to add tracks';
  END IF;
  
  -- Get the maximum position in the playlist
  SELECT COALESCE(MAX(position), 0) INTO max_position
  FROM prettygood.playlist_tracks
  WHERE playlist_id = add_track_to_playlist.playlist_id;
  
  -- Add track to playlist
  INSERT INTO prettygood.playlist_tracks (
    playlist_id,
    track_id,
    added_by,
    position
  )
  VALUES (
    playlist_id,
    track_id,
    current_user_id,
    max_position + 1
  )
  ON CONFLICT (playlist_id, track_id) DO NOTHING;
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a playlist
CREATE OR REPLACE FUNCTION prettygood.create_playlist(
  name TEXT,
  description TEXT DEFAULT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  collaborative BOOLEAN DEFAULT FALSE
) RETURNS prettygood.playlists AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
  new_playlist prettygood.playlists;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Create new playlist
  INSERT INTO prettygood.playlists (
    name,
    description,
    user_id,
    is_public,
    collaborative
  )
  VALUES (
    name,
    description,
    current_user_id,
    is_public,
    collaborative
  )
  RETURNING * INTO new_playlist;
  
  RETURN new_playlist;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record a track play
CREATE OR REPLACE FUNCTION prettygood.record_play(
  track_id UUID,
  play_duration INTEGER DEFAULT NULL,
  completed BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT NULL,
  context_id UUID DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  -- Insert play history record (even if not authenticated)
  INSERT INTO prettygood.play_history (
    track_id,
    user_id,
    play_duration,
    completed,
    source,
    context_id,
    client_ip,
    user_agent
  )
  VALUES (
    track_id,
    COALESCE(current_user_id, '00000000-0000-0000-0000-000000000000'::UUID),
    play_duration,
    completed,
    source,
    context_id,
    current_setting('request.headers', TRUE)::json->>'x-forwarded-for',
    current_setting('request.headers', TRUE)::json->>'user-agent'
  );
  
  -- If authenticated, also add to recently played
  IF current_user_id IS NOT NULL THEN
    INSERT INTO prettygood.user_recently_played (
      user_id,
      track_id,
      context_type,
      context_id
    )
    VALUES (
      current_user_id,
      track_id,
      source,
      context_id
    );
    
    -- Remove older entries if we have too many
    DELETE FROM prettygood.user_recently_played
    WHERE id IN (
      SELECT id FROM prettygood.user_recently_played
      WHERE user_id = current_user_id
      ORDER BY played_at DESC
      OFFSET 50 -- Keep only last 50 recently played tracks
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------------------------
-- User Library API Functions
------------------------------------------------------------------------

-- Function to add a track to user's library
CREATE OR REPLACE FUNCTION prettygood.add_track_to_library(
  track_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Add track to library
  INSERT INTO prettygood.user_library_tracks (
    user_id,
    track_id
  )
  VALUES (
    current_user_id,
    track_id
  )
  ON CONFLICT (user_id, track_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add an album to user's library
CREATE OR REPLACE FUNCTION prettygood.add_album_to_library(
  album_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Add album to library
  INSERT INTO prettygood.user_library_albums (
    user_id,
    album_id
  )
  VALUES (
    current_user_id,
    album_id
  )
  ON CONFLICT (user_id, album_id) DO NOTHING;
  
  -- Also add all tracks from the album to library
  INSERT INTO prettygood.user_library_tracks (
    user_id,
    track_id
  )
  SELECT 
    current_user_id,
    id
  FROM 
    prettygood.tracks
  WHERE 
    album_id = add_album_to_library.album_id
  ON CONFLICT (user_id, track_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add an artist to user's library
CREATE OR REPLACE FUNCTION prettygood.add_artist_to_library(
  artist_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Add artist to library
  INSERT INTO prettygood.user_library_artists (
    user_id,
    artist_id
  )
  VALUES (
    current_user_id,
    artist_id
  )
  ON CONFLICT (user_id, artist_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------------------------
-- Search and Recommendation API Functions
------------------------------------------------------------------------

-- Function to record a search query
CREATE OR REPLACE FUNCTION prettygood.record_search(
  query TEXT
) RETURNS VOID AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  IF current_user_id IS NULL THEN
    RETURN; -- Don't record searches for non-authenticated users
  END IF;
  
  -- Record search query
  INSERT INTO prettygood.search_history (
    user_id,
    query
  )
  VALUES (
    current_user_id,
    query
  );
  
  -- Remove older entries if we have too many
  DELETE FROM prettygood.search_history
  WHERE id IN (
    SELECT id FROM prettygood.search_history
    WHERE user_id = current_user_id
    ORDER BY searched_at DESC
    OFFSET 50 -- Keep only last 50 searches
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recommendations based on user's recent activity
CREATE OR REPLACE FUNCTION prettygood.get_recommendations(
  limit_count INTEGER DEFAULT 20
) RETURNS SETOF prettygood.tracks AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
BEGIN
  IF current_user_id IS NULL THEN
    -- Return popular tracks for non-authenticated users
    RETURN QUERY
    SELECT t.*
    FROM prettygood.tracks t
    JOIN (
      SELECT track_id, COUNT(*) as play_count
      FROM prettygood.play_history
      GROUP BY track_id
      ORDER BY play_count DESC
      LIMIT limit_count
    ) pop ON t.id = pop.track_id;
  ELSE
    -- Return personalized recommendations for authenticated users
    -- This is a simplified algorithm that could be improved
    RETURN QUERY
    WITH user_genres AS (
      -- Get genres the user listens to
      SELECT DISTINCT unnest(t.genre) as genre
      FROM prettygood.play_history ph
      JOIN prettygood.tracks t ON ph.track_id = t.id
      WHERE ph.user_id = current_user_id
      LIMIT 5
    ),
    user_artists AS (
      -- Get artists the user listens to
      SELECT DISTINCT t.artist_id
      FROM prettygood.play_history ph
      JOIN prettygood.tracks t ON ph.track_id = t.id
      WHERE ph.user_id = current_user_id
      LIMIT 5
    ),
    played_tracks AS (
      -- Get tracks the user has already played
      SELECT DISTINCT track_id
      FROM prettygood.play_history
      WHERE user_id = current_user_id
    )
    -- Get tracks from the same artists or genres that the user hasn't played yet
    SELECT t.*
    FROM prettygood.tracks t
    WHERE 
      (
        t.artist_id IN (SELECT artist_id FROM user_artists)
        OR
        EXISTS (
          SELECT 1 FROM user_genres ug
          WHERE ug.genre = ANY(t.genre)
        )
      )
      AND
      t.id NOT IN (SELECT track_id FROM played_tracks)
    ORDER BY t.created_at DESC
    LIMIT limit_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

------------------------------------------------------------------------
-- Payment API Functions
------------------------------------------------------------------------

-- Function to create a tip payment
CREATE OR REPLACE FUNCTION prettygood.tip_artist(
  artist_id UUID,
  amount NUMERIC,
  transaction_hash TEXT,
  track_id UUID DEFAULT NULL,
  album_id UUID DEFAULT NULL,
  message TEXT DEFAULT NULL
) RETURNS prettygood.payments AS $$
DECLARE
  current_user_id UUID := prettygood_private.current_user_id();
  new_payment prettygood.payments;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Verify artist exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Create payment record
  INSERT INTO prettygood.payments (
    sender_id,
    recipient_id,
    amount,
    currency,
    transaction_hash,
    status,
    payment_type,
    track_id,
    album_id,
    message
  )
  VALUES (
    current_user_id,
    artist_id,
    amount,
    'SUI',
    transaction_hash,
    'completed', -- Assuming the blockchain tx is already confirmed
    'tip',
    track_id,
    album_id,
    message
  )
  RETURNING * INTO new_payment;
  
  RETURN new_payment;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get payment statistics for an artist
CREATE OR REPLACE FUNCTION prettygood.get_artist_payment_stats(
  artist_id UUID
) RETURNS TABLE (
  total_payments BIGINT,
  total_amount NUMERIC,
  avg_amount NUMERIC,
  payment_type TEXT,
  month_year TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    payment_type,
    TO_CHAR(created_at, 'YYYY-MM') as month_year
  FROM 
    prettygood.payments
  WHERE 
    recipient_id = artist_id
    AND status = 'completed'
  GROUP BY 
    payment_type, TO_CHAR(created_at, 'YYYY-MM')
  ORDER BY 
    month_year DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments to functions
COMMENT ON FUNCTION prettygood.register_user IS 'Registers a new user with a wallet address';
COMMENT ON FUNCTION prettygood.generate_nonce IS 'Generates a nonce for wallet authentication';
COMMENT ON FUNCTION prettygood.verify_signature IS 'Verifies a wallet signature and returns a JWT token';
COMMENT ON FUNCTION prettygood.register_as_artist IS 'Registers an existing user as an artist';
COMMENT ON FUNCTION prettygood.add_track_to_playlist IS 'Adds a track to a user''s playlist';
COMMENT ON FUNCTION prettygood.create_playlist IS 'Creates a new playlist for the user';
COMMENT ON FUNCTION prettygood.record_play IS 'Records a track play event';
COMMENT ON FUNCTION prettygood.add_track_to_library IS 'Adds a track to user''s library';
COMMENT ON FUNCTION prettygood.add_album_to_library IS 'Adds an album and its tracks to user''s library';
COMMENT ON FUNCTION prettygood.add_artist_to_library IS 'Adds an artist to user''s library';
COMMENT ON FUNCTION prettygood.record_search IS 'Records a user''s search query';
COMMENT ON FUNCTION prettygood.get_recommendations IS 'Gets personalized track recommendations for a user';
COMMENT ON FUNCTION prettygood.tip_artist IS 'Records a tip payment from user to artist';
COMMENT ON FUNCTION prettygood.get_artist_payment_stats IS 'Gets payment statistics for an artist';
