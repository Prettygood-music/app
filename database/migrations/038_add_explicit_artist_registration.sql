-- Migration: 038_add_explicit_artist_registration.sql
-- Description: Adds a variant of register_as_artist that accepts user_id explicitly

-- New function that accepts user_id explicitly to register a user as an artist
CREATE OR REPLACE FUNCTION prettygood.register_as_artist_with_id(
  user_id UUID,
  artist_name TEXT,
  bio TEXT DEFAULT NULL,
  genre TEXT[] DEFAULT NULL,
  location TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  social_links JSONB DEFAULT NULL
) RETURNS prettygood.artists AS $$
DECLARE
  new_artist prettygood.artists;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if user is already an artist
  IF EXISTS (SELECT 1 FROM prettygood.artists WHERE id = user_id) THEN
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
    user_id, 
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

-- For updating an existing artist profile
CREATE OR REPLACE FUNCTION prettygood.update_artist_with_id(
  user_id UUID,
  artist_name TEXT DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  genre TEXT[] DEFAULT NULL,
  location TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  social_links JSONB DEFAULT NULL
) RETURNS prettygood.artists AS $$
DECLARE
  updated_artist prettygood.artists;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if user is an artist
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = user_id) THEN
    RAISE EXCEPTION 'User is not registered as an artist';
  END IF;
  
  -- Update artist profile
  UPDATE prettygood.artists
  SET 
    artist_name = COALESCE(update_artist_with_id.artist_name, artist_name),
    bio = COALESCE(update_artist_with_id.bio, bio),
    genre = COALESCE(update_artist_with_id.genre, genre),
    location = COALESCE(update_artist_with_id.location, location),
    website = COALESCE(update_artist_with_id.website, website),
    social_links = COALESCE(update_artist_with_id.social_links, social_links),
    updated_at = NOW()
  WHERE id = user_id
  RETURNING * INTO updated_artist;
  
  RETURN updated_artist;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION prettygood.register_as_artist_with_id IS 'Registers a user as an artist by explicitly providing the user ID';
COMMENT ON FUNCTION prettygood.update_artist_with_id IS 'Updates an existing artist profile by explicitly providing the user ID';
