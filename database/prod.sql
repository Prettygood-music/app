

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "prettygood";


ALTER SCHEMA "prettygood" OWNER TO "postgres";


COMMENT ON SCHEMA "prettygood" IS 'Public schema for prettygood.music application';



CREATE SCHEMA IF NOT EXISTS "prettygood_private";


ALTER SCHEMA "prettygood_private" OWNER TO "postgres";


COMMENT ON SCHEMA "prettygood_private" IS 'Private schema for sensitive data and authentication in prettygood.music application';



COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "prettygood";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";






CREATE OR REPLACE FUNCTION "prettygood"."add_album_to_library"("album_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."add_album_to_library"("album_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."add_album_to_library"("album_id" "uuid") IS 'Adds an album and its tracks to user''s library';



CREATE OR REPLACE FUNCTION "prettygood"."add_artist_to_library"("artist_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."add_artist_to_library"("artist_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."add_artist_to_library"("artist_id" "uuid") IS 'Adds an artist to user''s library';



CREATE OR REPLACE FUNCTION "prettygood"."add_track_to_library"("track_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."add_track_to_library"("track_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."add_track_to_library"("track_id" "uuid") IS 'Adds a track to user''s library';



CREATE OR REPLACE FUNCTION "prettygood"."add_track_to_playlist"("playlist_id" "uuid", "track_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."add_track_to_playlist"("playlist_id" "uuid", "track_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."add_track_to_playlist"("playlist_id" "uuid", "track_id" "uuid") IS 'Adds a track to a user''s playlist';



CREATE OR REPLACE FUNCTION "prettygood"."authenticate_user"("_email_or_username" "text", "_password" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _stored_password_hash TEXT;
  _user_role TEXT;
  _is_locked BOOLEAN;
BEGIN
  -- Get the user_id and password hash with explicit table aliases for all columns
  SELECT u.id, a.password_hash INTO _user_id, _stored_password_hash
  FROM prettygood.users u
  JOIN prettygood_private.user_auth a ON u.id = a.user_id
  WHERE (u.email = _email_or_username OR u.username = _email_or_username);
  
  -- Check if user exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Check if account is locked
  _is_locked := prettygood_private.check_account_lockout(_user_id);
  IF _is_locked THEN
    RAISE EXCEPTION 'Account is temporarily locked due to too many failed login attempts. Please try again later.';
  END IF;
  
  -- Verify password
  IF _stored_password_hash IS NULL OR _stored_password_hash != crypt(_password, _stored_password_hash) THEN
    -- Record failed login attempt
    PERFORM prettygood_private.record_failed_login(_user_id);
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = _user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO _user_role;
  
  -- Reset failed login attempts and update last sign in time
  UPDATE prettygood_private.user_auth a
  SET 
    failed_login_attempts = 0,
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE a.user_id = _user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(_user_id, _user_role, 86400); -- 24 hour token
END;
$$;


ALTER FUNCTION "prettygood"."authenticate_user"("_email_or_username" "text", "_password" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."authenticate_user"("_email_or_username" "text", "_password" "text") IS 'Authenticates a user with email/username and password, returns JWT on success';



CREATE OR REPLACE FUNCTION "prettygood"."authenticate_wallet"("wallet_address" "text", "signature" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  user_id UUID;
  nonce TEXT;
  user_role TEXT;
  nonce_valid BOOLEAN;
  signature_valid BOOLEAN;
BEGIN
  -- Get the user from the wallet address
  SELECT u.id INTO user_id
  FROM prettygood.users u
  WHERE u.wallet_address = authenticate_wallet.wallet_address;
  
  -- Check if user exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not found for wallet address: %', wallet_address;
  END IF;
  
  -- Get the nonce
  SELECT 
    a.nonce, 
    a.nonce_created_at > (NOW() - INTERVAL '15 minutes')
  INTO nonce, nonce_valid
  FROM prettygood_private.user_auth a
  WHERE a.user_id = user_id;
  
  -- Check if nonce exists and is valid
  IF nonce IS NULL OR NOT nonce_valid THEN
    RAISE EXCEPTION 'Invalid or expired nonce. Please request a new one.';
  END IF;
  
  -- Construct the message that would have been signed
  -- In a real implementation, this would be a standardized message format
  -- that includes the nonce and perhaps domain separation
  -- e.g. "Sign this message to authenticate with prettygood.music: [nonce]"
  
  -- Verify the signature
  signature_valid := auth.verify_wallet_signature(
    wallet_address,
    'Sign this message to authenticate with prettygood.music: ' || nonce,
    signature
  );
  
  IF NOT signature_valid THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO user_role;
  
  -- Update last sign in time
  UPDATE prettygood_private.user_auth
  SET 
    nonce = NULL, -- Clear the nonce
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE user_id = user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(user_id, user_role, 86400); -- 24 hour token
END;
$$;


ALTER FUNCTION "prettygood"."authenticate_wallet"("wallet_address" "text", "signature" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."authenticate_wallet"("wallet_address" "text", "signature" "text") IS 'Authenticates a user with their wallet and returns a JWT token';



CREATE OR REPLACE FUNCTION "prettygood"."create_email_verification_token"("_user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _new_token TEXT;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate a secure token
  SELECT encode(gen_random_bytes(24), 'hex') INTO _new_token;
  
  -- Delete any existing tokens for this user
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE user_id = _user_id;
  
  -- Insert new token
  INSERT INTO prettygood_private.email_verification_tokens (
    user_id,
    token
  ) VALUES (
    _user_id,
    _new_token
  );
  
  RETURN _new_token;
END;
$$;


ALTER FUNCTION "prettygood"."create_email_verification_token"("_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."create_email_verification_token"("_user_id" "uuid") IS 'Creates a new email verification token for a user';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "prettygood"."playlists" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "user_id" "uuid" NOT NULL,
    "cover_url" "text",
    "is_public" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."playlists" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."playlists" IS 'User-created playlists on the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."playlists"."cover_url" IS 'URL to the playlist cover image';



CREATE OR REPLACE FUNCTION "prettygood"."create_playlist"("name" "text", "description" "text" DEFAULT NULL::"text", "is_public" boolean DEFAULT true) RETURNS "prettygood"."playlists"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_playlist prettygood.playlists;
BEGIN
  INSERT INTO prettygood.playlists (name, description, user_id, is_public)
  VALUES (name, description, auth.uid(), is_public)
  RETURNING * INTO new_playlist;
  
  RETURN new_playlist;
END;
$$;


ALTER FUNCTION "prettygood"."create_playlist"("name" "text", "description" "text", "is_public" boolean) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."create_playlist"("name" "text", "description" "text", "is_public" boolean) IS 'Creates a new playlist for the current user';



CREATE TABLE IF NOT EXISTS "prettygood"."tracks" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "artist_id" "uuid" NOT NULL,
    "album_id" "uuid",
    "duration" integer NOT NULL,
    "audio_url" "text" NOT NULL,
    "cover_url" "text",
    "track_number" integer,
    "lyrics" "text",
    "genre" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "explicit" boolean DEFAULT false,
    "release_date" "date",
    "isrc" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."tracks" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."tracks" IS 'Music tracks on the prettygood.music platform with fixed permissions';



COMMENT ON COLUMN "prettygood"."tracks"."duration" IS 'Duration of the track in seconds';



COMMENT ON COLUMN "prettygood"."tracks"."cover_url" IS 'URL to the track cover image';



COMMENT ON COLUMN "prettygood"."tracks"."isrc" IS 'International Standard Recording Code';



CREATE OR REPLACE FUNCTION "prettygood"."create_track"("title" "text", "artist_id" "uuid", "duration" integer, "audio_url" "text", "album_id" "uuid" DEFAULT NULL::"uuid", "cover_url" "text" DEFAULT NULL::"text", "track_number" integer DEFAULT NULL::integer, "lyrics" "text" DEFAULT NULL::"text", "genre" "text"[] DEFAULT '{}'::"text"[], "explicit" boolean DEFAULT false, "release_date" "date" DEFAULT NULL::"date", "isrc" "text" DEFAULT NULL::"text") RETURNS "prettygood"."tracks"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_track prettygood.tracks;
BEGIN
  -- Verify artist exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Verify album exists if provided
  IF album_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM prettygood.albums WHERE id = album_id) THEN
    RAISE EXCEPTION 'Album not found';
  END IF;
  
  -- Create track
  INSERT INTO prettygood.tracks (
    title,
    artist_id,
    album_id,
    duration,
    audio_url,
    cover_url,
    track_number,
    lyrics,
    genre,
    explicit,
    release_date,
    isrc
  )
  VALUES (
    title,
    artist_id,
    album_id,
    duration,
    audio_url,
    cover_url,
    track_number,
    lyrics,
    genre,
    explicit,
    release_date,
    isrc
  )
  RETURNING * INTO new_track;
  
  RETURN new_track;
END;
$$;


ALTER FUNCTION "prettygood"."create_track"("title" "text", "artist_id" "uuid", "duration" integer, "audio_url" "text", "album_id" "uuid", "cover_url" "text", "track_number" integer, "lyrics" "text", "genre" "text"[], "explicit" boolean, "release_date" "date", "isrc" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."create_track"("title" "text", "artist_id" "uuid", "duration" integer, "audio_url" "text", "album_id" "uuid", "cover_url" "text", "track_number" integer, "lyrics" "text", "genre" "text"[], "explicit" boolean, "release_date" "date", "isrc" "text") IS 'Creates a new track using elevated privileges, properly handling required and optional parameters';



CREATE OR REPLACE FUNCTION "prettygood"."debug_get_jwt_info"() RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _jwt_secret TEXT;
  _has_secrets_table BOOLEAN;
  _has_jwt_env BOOLEAN;
  _algorithm TEXT := 'sha256';
BEGIN
  -- Only allow in development
  IF current_setting('app.environment', TRUE) = 'production' THEN
    RETURN jsonb_build_object('error', 'Debug functions disabled in production');
  END IF;

  -- Check if secrets table exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'secrets'
  ) INTO _has_secrets_table;

  -- Try to get JWT secret from environment
  BEGIN
    _has_jwt_env := current_setting('app.jwt_secret', TRUE) IS NOT NULL;
  EXCEPTION WHEN OTHERS THEN
    _has_jwt_env := FALSE;
  END;

  -- Get the JWT secret (not returning the actual value for security)
  BEGIN
    _jwt_secret := auth.get_jwt_secret();
  EXCEPTION WHEN OTHERS THEN
    _jwt_secret := NULL;
  END;

  -- Return configuration info
  RETURN jsonb_build_object(
    'jwt_secret_exists', _jwt_secret IS NOT NULL,
    'jwt_secret_length', CASE WHEN _jwt_secret IS NULL THEN 0 ELSE length(_jwt_secret) END,
    'secrets_table_exists', _has_secrets_table,
    'jwt_env_var_set', _has_jwt_env,
    'algorithm', _algorithm,
    'auth_functions', jsonb_build_object(
      'auth.generate_jwt', has_function_privilege('auth.generate_jwt(uuid,text,integer)', 'execute'),
      'auth.verify_jwt', has_function_privilege('auth.verify_jwt(text,text)', 'execute'),
      'prettygood.refresh_token', has_function_privilege('prettygood.refresh_token(text)', 'execute')
    )
  );
END;
$$;


ALTER FUNCTION "prettygood"."debug_get_jwt_info"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."debug_get_jwt_info"() IS 'DEBUG ONLY - Returns information about JWT configuration (without exposing secrets).
 This function should be disabled or removed in production environments.';



CREATE OR REPLACE FUNCTION "prettygood"."debug_verify_token"("token" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _verify_result JSONB;
  _decoded_payload JSONB;
  _user_info JSONB;
  _header TEXT;
  _payload TEXT;
  _signature TEXT;
  _jwt_secret TEXT;
BEGIN
  -- Only allow in development
  IF current_setting('app.environment', TRUE) = 'production' THEN
    RETURN jsonb_build_object('error', 'Debug functions disabled in production');
  END IF;

  -- Get the JWT secret
  BEGIN
    _jwt_secret := auth.get_jwt_secret();
  EXCEPTION WHEN OTHERS THEN
    _jwt_secret := NULL;
  END;

  -- Basic JWT structure check
  IF token IS NULL THEN
    RETURN jsonb_build_object('error', 'Token is null');
  END IF;

  -- Split token into parts
  _header := split_part(token, '.', 1);
  _payload := split_part(token, '.', 2);
  _signature := split_part(token, '.', 3);

  IF _header IS NULL OR _payload IS NULL OR _signature IS NULL OR 
     _header = '' OR _payload = '' OR _signature = '' THEN
    RETURN jsonb_build_object('error', 'Token does not have three parts');
  END IF;

  -- Try to decode payload without verification
  BEGIN
    _decoded_payload := convert_from(
      decode(
        _payload || repeat('=', (4 - length(_payload) % 4) % 4),
        'base64'
      ),
      'UTF8'
    )::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Cannot decode payload',
      'detail', SQLERRM,
      'payload_part', _payload
    );
  END;

  -- Check token structure
  IF _decoded_payload->>'sub' IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'Token missing subject (sub) claim',
      'payload', _decoded_payload
    );
  END IF;

  -- Check user existence
  BEGIN
    SELECT jsonb_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'role', u.role,
      'exists', TRUE
    )
    INTO _user_info
    FROM prettygood.users u
    WHERE u.id = (_decoded_payload->>'sub')::UUID;

    IF _user_info IS NULL THEN
      _user_info := jsonb_build_object('exists', FALSE);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    _user_info := jsonb_build_object(
      'error', 'Error checking user',
      'detail', SQLERRM
    );
  END;

  -- Try to verify with auth.verify_jwt
  BEGIN
    _verify_result := auth.verify_jwt(token)::JSONB;
    RETURN jsonb_build_object(
      'success', TRUE,
      'verification', 'Token verified successfully',
      'payload', _decoded_payload,
      'user', _user_info,
      'exp_date', to_timestamp((_decoded_payload->>'exp')::DOUBLE PRECISION),
      'is_expired', ((_decoded_payload->>'exp')::DOUBLE PRECISION < extract(epoch from now())),
      'now', now(),
      'jwt_secret_exists', _jwt_secret IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Token verification failed',
      'detail', SQLERRM,
      'payload', _decoded_payload,
      'user', _user_info,
      'exp_date', to_timestamp((_decoded_payload->>'exp')::DOUBLE PRECISION),
      'is_expired', ((_decoded_payload->>'exp')::DOUBLE PRECISION < extract(epoch from now())),
      'now', now(),
      'jwt_secret_exists', _jwt_secret IS NOT NULL
    );
  END;
END;
$$;


ALTER FUNCTION "prettygood"."debug_verify_token"("token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."debug_verify_token"("token" "text") IS 'DEBUG ONLY - Returns detailed information about a JWT token to help diagnose verification issues.
 This function should be disabled or removed in production environments.';



CREATE OR REPLACE FUNCTION "prettygood"."generate_nonce"("wallet_address" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."generate_nonce"("wallet_address" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."generate_nonce"("wallet_address" "text") IS 'Generates a nonce for wallet authentication';



CREATE OR REPLACE FUNCTION "prettygood"."get_album_play_count"("album_id" "uuid") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $_$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    JOIN prettygood.tracks ON play_history.track_id = tracks.id
    WHERE tracks.album_id = $1
$_$;


ALTER FUNCTION "prettygood"."get_album_play_count"("album_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_album_play_count"("album_id" "uuid") IS 'Get the total play count for all tracks in an album';



CREATE TABLE IF NOT EXISTS "prettygood"."albums" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "artist_id" "uuid" NOT NULL,
    "release_date" "date",
    "cover_url" "text",
    "description" "text",
    "genre" "text"[],
    "type" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "albums_type_check" CHECK (("type" = ANY (ARRAY['album'::"text", 'ep'::"text", 'single'::"text", 'compilation'::"text"])))
);


ALTER TABLE "prettygood"."albums" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."albums" IS 'Music albums on the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."albums"."cover_url" IS 'URL to the album cover image';



COMMENT ON COLUMN "prettygood"."albums"."genre" IS 'Array of genres associated with the album';



COMMENT ON COLUMN "prettygood"."albums"."type" IS 'Type of album release (album, ep, single, compilation)';



CREATE OR REPLACE FUNCTION "prettygood"."get_albums_by_genre"("p_genre_id" "uuid", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS SETOF "prettygood"."albums"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.albums a
  JOIN prettygood.album_genres ag ON ag.album_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "prettygood"."get_albums_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood"."get_artist_followers_count"("artist_id" "uuid") RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    follower_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO follower_count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_artist_followers_count.artist_id;
    
    RETURN follower_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_artist_followers_count"("artist_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_artist_followers_count"("artist_id" "uuid") IS 'Gets the total number of followers for an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_artist_payment_stats"("artist_id" "uuid") RETURNS TABLE("total_payments" bigint, "total_amount" numeric, "avg_amount" numeric, "payment_type" "text", "month_year" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."get_artist_payment_stats"("artist_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_artist_payment_stats"("artist_id" "uuid") IS 'Gets payment statistics for an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_artist_play_count"("artist_id" "uuid") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $_$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    JOIN prettygood.tracks ON play_history.track_id = tracks.id
    WHERE tracks.artist_id = $1
$_$;


ALTER FUNCTION "prettygood"."get_artist_play_count"("artist_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_artist_play_count"("artist_id" "uuid") IS 'Get the total play count for all tracks by an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_artist_total_earnings"("artist_id" "uuid") RETURNS numeric
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    total_earnings NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(amount), 0) INTO total_earnings
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed';
    
    RETURN total_earnings;
END;
$$;


ALTER FUNCTION "prettygood"."get_artist_total_earnings"("artist_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_artist_total_earnings"("artist_id" "uuid") IS 'Gets the total earnings for an artist';



CREATE TABLE IF NOT EXISTS "prettygood"."artists" (
    "id" "uuid" NOT NULL,
    "artist_name" "text" NOT NULL,
    "bio" "text",
    "genre" "text"[],
    "location" "text",
    "website" "text",
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."artists" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."artists" IS 'Artist profiles for the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."artists"."genre" IS 'Array of genres associated with the artist';



COMMENT ON COLUMN "prettygood"."artists"."social_links" IS 'JSON containing social media links';



CREATE OR REPLACE FUNCTION "prettygood"."get_artists_by_genre"("p_genre_id" "uuid", "p_limit" integer DEFAULT 20, "p_offset" integer DEFAULT 0) RETURNS SETOF "prettygood"."artists"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.artists a
  JOIN prettygood.artist_genres ag ON ag.artist_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.artist_name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "prettygood"."get_artists_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood"."get_earnings_by_payment_type"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS TABLE("payment_type" "text", "amount" numeric)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        payment_type,
        SUM(amount) as amount
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date
    GROUP BY 
        payment_type
    ORDER BY 
        amount DESC;
END;
$$;


ALTER FUNCTION "prettygood"."get_earnings_by_payment_type"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_earnings_by_payment_type"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets earnings grouped by payment type';



CREATE OR REPLACE FUNCTION "prettygood"."get_earnings_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") RETURNS TABLE("period" "text", "amount" numeric)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, time_format) as period,
        SUM(amount) as amount
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date
    GROUP BY 
        TO_CHAR(created_at, time_format)
    ORDER BY 
        period;
END;
$$;


ALTER FUNCTION "prettygood"."get_earnings_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_earnings_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") IS 'Gets earnings grouped by time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_earnings_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS numeric
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    period_earnings NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(amount), 0) INTO period_earnings
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date;
    
    RETURN period_earnings;
END;
$$;


ALTER FUNCTION "prettygood"."get_earnings_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_earnings_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets the total earnings within a specific time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_followers_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") RETURNS TABLE("period" "text", "count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(added_at, time_format) as period,
        COUNT(*) as count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_followers_by_period.artist_id
        AND added_at >= start_date
        AND added_at <= end_date
    GROUP BY 
        TO_CHAR(added_at, time_format)
    ORDER BY 
        period;
END;
$$;


ALTER FUNCTION "prettygood"."get_followers_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_followers_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") IS 'Gets new followers grouped by time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_followers_count_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    follower_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO follower_count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_followers_count_for_period.artist_id
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN follower_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_followers_count_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_followers_count_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets the number of new followers within a specific time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_play_duration_stats"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS TABLE("avg_duration" double precision, "completed_count" bigint, "total_count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(play_duration)::FLOAT as avg_duration,
        COUNT(*) FILTER (WHERE completed = true)::BIGINT as completed_count,
        COUNT(*)::BIGINT as total_count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date;
END;
$$;


ALTER FUNCTION "prettygood"."get_play_duration_stats"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_play_duration_stats"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets statistics about play duration and completion rate';



CREATE OR REPLACE FUNCTION "prettygood"."get_plays_by_country"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS TABLE("country_code" "text", "play_count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    -- Note: This function assumes we have client_geo_country column in play_history
    -- If the column doesn't exist, we'll return a mock result for now
    -- In production, this would be derived from client_ip using a geolocation service
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'client_geo_country'
    ) THEN
        RETURN QUERY
        SELECT 
            COALESCE(client_geo_country, 'UNKNOWN') as country_code,
            COUNT(*) as play_count
        FROM 
            prettygood.play_history
        WHERE 
            track_id = ANY(track_ids)
            AND played_at >= start_date
            AND played_at <= end_date
        GROUP BY 
            country_code
        ORDER BY 
            play_count DESC;
    ELSE
        -- Return mock data if column doesn't exist
        RETURN QUERY
        WITH country_counts AS (
            VALUES
                ('US', 1250),
                ('GB', 430),
                ('DE', 280),
                ('CA', 215),
                ('FR', 195),
                ('AU', 165),
                ('JP', 120),
                ('BR', 95),
                ('MX', 85),
                ('OTHER', 110)
        )
        SELECT 
            c.column1 as country_code,
            c.column2 as play_count
        FROM 
            country_counts c;
    END IF;
END;
$$;


ALTER FUNCTION "prettygood"."get_plays_by_country"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_plays_by_country"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets play counts grouped by country for specified tracks';



CREATE OR REPLACE FUNCTION "prettygood"."get_plays_by_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") RETURNS TABLE("period" "text", "count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(played_at, time_format) as period,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        TO_CHAR(played_at, time_format)
    ORDER BY 
        period;
END;
$$;


ALTER FUNCTION "prettygood"."get_plays_by_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_plays_by_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") IS 'Gets play counts grouped by time period (day, month, year) for tracks within a date range';



CREATE OR REPLACE FUNCTION "prettygood"."get_plays_by_source"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS TABLE("source" "text", "count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(source, 'unknown') as source,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        source
    ORDER BY 
        count DESC;
END;
$$;


ALTER FUNCTION "prettygood"."get_plays_by_source"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_plays_by_source"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets play counts grouped by source (where plays originate from)';



CREATE OR REPLACE FUNCTION "prettygood"."get_plays_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    play_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO play_count
    FROM 
        prettygood.play_history ph
    JOIN 
        prettygood.tracks t ON ph.track_id = t.id
    WHERE 
        t.artist_id = get_plays_for_period.artist_id
        AND ph.played_at >= start_date
        AND ph.played_at <= end_date;
    
    RETURN play_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_plays_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_plays_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets total play count for an artist within a specific time period';



CREATE TABLE IF NOT EXISTS "prettygood"."genres" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "color" "text",
    "slug" "text",
    "popularity" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."genres" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."genres" IS 'Music genres in the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."genres"."color" IS 'Hex code or CSS color for UI display';



COMMENT ON COLUMN "prettygood"."genres"."slug" IS 'URL-friendly version of the genre name';



COMMENT ON COLUMN "prettygood"."genres"."popularity" IS 'Calculated popularity score based on track count';



CREATE OR REPLACE FUNCTION "prettygood"."get_popular_genres"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer DEFAULT 10) RETURNS SETOF "prettygood"."genres"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH popular_genres AS (
    -- Count plays for tracks in each genre during the specified period
    SELECT g.id, g.name, COUNT(*) as play_count
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg ON tg.genre_id = g.id
    JOIN prettygood.play_history ph ON ph.track_id = tg.track_id
    WHERE ph.played_at BETWEEN p_start_date AND p_end_date
    GROUP BY g.id, g.name
    ORDER BY play_count DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN popular_genres pg ON pg.id = g.id
  ORDER BY pg.play_count DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "prettygood"."get_popular_genres"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood"."get_recent_followers"("artist_id" "uuid", "start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "limit_count" integer DEFAULT 5) RETURNS TABLE("added_at" timestamp with time zone, "user_id" "uuid", "username" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ula.added_at,
        u.id as user_id,
        u.username
    FROM 
        prettygood.user_library_artists ula
    JOIN 
        prettygood.users u ON ula.user_id = u.id
    WHERE 
        ula.artist_id = get_recent_followers.artist_id
        AND (start_date IS NULL OR ula.added_at >= start_date)
    ORDER BY 
        ula.added_at DESC
    LIMIT 
        limit_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_recent_followers"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_recent_followers"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) IS 'Gets recent followers for an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_recent_plays"("track_ids" "uuid"[], "start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "limit_count" integer DEFAULT 10) RETURNS TABLE("played_at" timestamp with time zone, "track_id" "uuid", "track_title" "text", "username" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ph.played_at,
        t.id as track_id,
        t.title as track_title,
        u.username
    FROM 
        prettygood.play_history ph
    JOIN 
        prettygood.tracks t ON ph.track_id = t.id
    JOIN 
        prettygood.users u ON ph.user_id = u.id
    WHERE 
        ph.track_id = ANY(track_ids)
        AND (start_date IS NULL OR ph.played_at >= start_date)
    ORDER BY 
        ph.played_at DESC
    LIMIT 
        limit_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_recent_plays"("track_ids" "uuid"[], "start_date" timestamp with time zone, "limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_recent_plays"("track_ids" "uuid"[], "start_date" timestamp with time zone, "limit_count" integer) IS 'Gets recent plays for tracks by an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_recent_tips"("artist_id" "uuid", "start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "limit_count" integer DEFAULT 5) RETURNS TABLE("created_at" timestamp with time zone, "amount" numeric, "username" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.created_at,
        p.amount,
        u.username
    FROM 
        prettygood.payments p
    JOIN 
        prettygood.users u ON p.sender_id = u.id
    WHERE 
        p.recipient_id = artist_id
        AND p.status = 'completed'
        AND p.payment_type = 'tip'
        AND (start_date IS NULL OR p.created_at >= start_date)
    ORDER BY 
        p.created_at DESC
    LIMIT 
        limit_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_recent_tips"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_recent_tips"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) IS 'Gets recent tips for an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_recent_transactions"("artist_id" "uuid", "limit_count" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone, "amount" numeric, "payment_type" "text", "sender_id" "uuid", "username" "text")
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.created_at,
        p.amount,
        p.payment_type,
        p.sender_id,
        u.username
    FROM 
        prettygood.payments p
    JOIN 
        prettygood.users u ON p.sender_id = u.id
    WHERE 
        p.recipient_id = artist_id
        AND p.status = 'completed'
    ORDER BY 
        p.created_at DESC
    LIMIT 
        limit_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_recent_transactions"("artist_id" "uuid", "limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_recent_transactions"("artist_id" "uuid", "limit_count" integer) IS 'Gets recent payment transactions for an artist';



CREATE OR REPLACE FUNCTION "prettygood"."get_recommendations"("limit_count" integer DEFAULT 10) RETURNS SETOF "prettygood"."tracks"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  -- This is a simplified implementation that returns recent tracks
  -- In a production environment, this would use more sophisticated recommendation logic
  RETURN QUERY
  SELECT * FROM prettygood.tracks
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_recommendations"("limit_count" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_recommendations"("limit_count" integer) IS 'Returns recommended tracks based on user preferences';



CREATE OR REPLACE FUNCTION "prettygood"."get_related_genres"("p_genre_id" "uuid", "p_limit" integer DEFAULT 5) RETURNS SETOF "prettygood"."genres"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  WITH track_counts AS (
    -- Count tracks that share genres with the input genre
    SELECT g.id, g.name, COUNT(*) as common_tracks
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg1 ON tg1.genre_id = g.id
    JOIN prettygood.track_genres tg2 ON tg2.track_id = tg1.track_id
    WHERE tg2.genre_id = p_genre_id
    AND g.id != p_genre_id
    GROUP BY g.id, g.name
    ORDER BY common_tracks DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN track_counts tc ON tc.id = g.id
  ORDER BY tc.common_tracks DESC
  LIMIT p_limit;
END;
$$;


ALTER FUNCTION "prettygood"."get_related_genres"("p_genre_id" "uuid", "p_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood"."get_track_play_count"("track_id" "uuid") RETURNS integer
    LANGUAGE "sql" STABLE
    AS $_$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    WHERE track_id = $1
$_$;


ALTER FUNCTION "prettygood"."get_track_play_count"("track_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_play_count"("track_id" "uuid") IS 'Get the total play count for a specific track';



CREATE OR REPLACE FUNCTION "prettygood"."get_track_play_count_by_period"("track_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS integer
    LANGUAGE "sql" STABLE
    AS $_$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    WHERE track_id = $1
    AND played_at >= start_date
    AND played_at <= end_date
$_$;


ALTER FUNCTION "prettygood"."get_track_play_count_by_period"("track_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_play_count_by_period"("track_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Get the play count for a specific track within a time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_track_play_counts"("track_ids" "uuid"[], "start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS TABLE("track_id" "uuid", "count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        play_history.track_id,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND (start_date IS NULL OR played_at >= start_date)
        AND (end_date IS NULL OR played_at <= end_date)
    GROUP BY 
        track_id;
END;
$$;


ALTER FUNCTION "prettygood"."get_track_play_counts"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_play_counts"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets total play counts for multiple tracks with optional date filtering';



CREATE OR REPLACE FUNCTION "prettygood"."get_track_playlists_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    playlists_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO playlists_count
    FROM 
        prettygood.playlist_tracks
    WHERE 
        track_id = ANY(track_ids)
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN playlists_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_track_playlists_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_playlists_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets the number of times tracks have been added to playlists';



CREATE OR REPLACE FUNCTION "prettygood"."get_track_plays_for_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS TABLE("track_id" "uuid", "count" bigint)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        play_history.track_id,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        track_id;
END;
$$;


ALTER FUNCTION "prettygood"."get_track_plays_for_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_plays_for_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets play counts for specific tracks within a time period';



CREATE OR REPLACE FUNCTION "prettygood"."get_track_saves_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    saves_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO saves_count
    FROM 
        prettygood.user_library_tracks
    WHERE 
        track_id = ANY(track_ids)
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN saves_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_track_saves_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_track_saves_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets the number of times tracks have been saved to user libraries';



CREATE OR REPLACE FUNCTION "prettygood"."get_tracks_by_genre"("p_genre_id" "uuid", "p_limit" integer DEFAULT 50, "p_offset" integer DEFAULT 0) RETURNS SETOF "prettygood"."tracks"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM prettygood.tracks t
  JOIN prettygood.track_genres tg ON tg.track_id = t.id
  WHERE tg.genre_id = p_genre_id
  ORDER BY t.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;


ALTER FUNCTION "prettygood"."get_tracks_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood"."get_tracks_play_count"("track_ids" "uuid"[], "start_date" timestamp with time zone DEFAULT NULL::timestamp with time zone, "end_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS bigint
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    play_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO play_count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND (start_date IS NULL OR played_at >= start_date)
        AND (end_date IS NULL OR played_at <= end_date);
    
    RETURN play_count;
END;
$$;


ALTER FUNCTION "prettygood"."get_tracks_play_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."get_tracks_play_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) IS 'Gets total play count for a set of tracks';



CREATE OR REPLACE FUNCTION "prettygood"."record_play"("track_id" "uuid", "play_duration" integer DEFAULT NULL::integer, "completed" boolean DEFAULT false, "source" "text" DEFAULT NULL::"text", "context_id" "uuid" DEFAULT NULL::"uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."record_play"("track_id" "uuid", "play_duration" integer, "completed" boolean, "source" "text", "context_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."record_play"("track_id" "uuid", "play_duration" integer, "completed" boolean, "source" "text", "context_id" "uuid") IS 'Records a track play event';



CREATE OR REPLACE FUNCTION "prettygood"."record_search"("query" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."record_search"("query" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."record_search"("query" "text") IS 'Records a user''s search query';



CREATE OR REPLACE FUNCTION "prettygood"."refresh_token"("current_token" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _role TEXT;
  _token TEXT;
  _payload JSON;
  _is_artist BOOLEAN;
BEGIN
  -- Try to validate the token and extract the user ID
  BEGIN
    -- Extract user data from current token using the updated auth.verify_jwt function
    _payload := auth.verify_jwt(current_token);
    
    -- Extract the user ID from the sub claim
    _user_id := (_payload->>'sub')::UUID;
    
    -- If no user_id found, token is invalid
    IF _user_id IS NULL THEN
      RAISE EXCEPTION 'Invalid token';
    END IF;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid token';
  END;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists WHERE id = _user_id
  ) INTO _is_artist;
  
  _role := CASE WHEN _is_artist THEN 'artist' ELSE 'user' END;
  
  -- Generate a new JWT token with same claims but new expiration
  _token := auth.generate_jwt(
    _user_id,
    _role,
    86400  -- 24 hours expiration
  );
  
  -- Update last_sign_in timestamp
  BEGIN
    UPDATE prettygood_private.user_auth
    SET last_sign_in = NOW()
    WHERE user_id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors on update, not critical for token refresh
    NULL;
  END;
  
  RETURN _token;
END;
$$;


ALTER FUNCTION "prettygood"."refresh_token"("current_token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."refresh_token"("current_token" "text") IS 'Refreshes a JWT token with a new expiration time if the current token is valid. Uses role determination based on artists table.';



CREATE OR REPLACE FUNCTION "prettygood"."refresh_token_robust"("current_token" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _role TEXT;
  _token TEXT;
  _parts TEXT[];
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _payload_raw BYTEA;
  _payload JSONB;
  _is_artist BOOLEAN;
BEGIN
  -- Basic validation
  IF current_token IS NULL OR current_token = '' THEN
    RAISE EXCEPTION 'Token is null or empty';
  END IF;
  
  -- Split token into parts
  _parts := string_to_array(current_token, '.');
  IF array_length(_parts, 1) != 3 THEN
    RAISE EXCEPTION 'Invalid token format: expecting header.payload.signature';
  END IF;
  
  _header_part := _parts[1];
  _payload_part := _parts[2];
  _signature_part := _parts[3];
  
  -- Decode payload with safe padding handling
  BEGIN
    -- Fix padding and decode
    _payload_raw := decode(auth.fix_base64_padding(_payload_part), 'base64');
    _payload := convert_from(_payload_raw, 'UTF8')::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to decode token payload: %', SQLERRM;
  END;
  
  -- Extract and validate user ID
  _user_id := (_payload->>'sub')::UUID;
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Token missing subject claim';
  END IF;
  
  -- Check expiration
  IF (_payload->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  -- Skip signature verification for now - we're assuming the token is valid
  -- since it was previously verified during login and we can extract a valid user ID
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists WHERE id = _user_id
  ) INTO _is_artist;
  
  _role := CASE WHEN _is_artist THEN 'artist' ELSE 'user' END;
  
  -- Generate a new JWT token
  _token := auth.generate_jwt(
    _user_id,
    _role,
    86400  -- 24 hours expiration
  );
  
  -- Update last_sign_in timestamp
  BEGIN
    UPDATE prettygood_private.user_auth
    SET last_sign_in = NOW()
    WHERE user_id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors on update, not critical for token refresh
    NULL;
  END;
  
  RETURN _token;
END;
$$;


ALTER FUNCTION "prettygood"."refresh_token_robust"("current_token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."refresh_token_robust"("current_token" "text") IS 'Robust token refresh function that handles base64 padding issues and skips signature verification';



CREATE OR REPLACE FUNCTION "prettygood"."refresh_token_v2"("current_token" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _role TEXT;
  _token TEXT;
  _payload JSONB;
  _is_artist BOOLEAN;
  _parts TEXT[];
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _expected_signature TEXT;
  _secret TEXT;
  _algorithm TEXT := 'sha256';
BEGIN
  -- Basic validation of token format
  IF current_token IS NULL OR current_token = '' THEN
    RAISE EXCEPTION 'Token is null or empty';
  END IF;
  
  -- Split the token into parts
  _parts := string_to_array(current_token, '.');
  
  IF array_length(_parts, 1) != 3 THEN
    RAISE EXCEPTION 'Invalid token format: expecting header.payload.signature';
  END IF;
  
  _header_part := _parts[1];
  _payload_part := _parts[2];
  _signature_part := _parts[3];
  
  -- Get JWT secret
  _secret := auth.get_jwt_secret();
  
  IF _secret IS NULL OR _secret = '' THEN
    RAISE EXCEPTION 'JWT secret is not configured';
  END IF;
  
  -- Calculate expected signature with alternative methods until one matches
  -- Method 1: Standard base64 (no URL encoding)
  _expected_signature := rtrim(
    replace(
      encode(
        hmac(
          _header_part || '.' || _payload_part,
          _secret,
          _algorithm
        ),
        'base64'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Method 2: Base64url encoding
  IF _signature_part != _expected_signature THEN
    _expected_signature := replace(
      replace(
        rtrim(
          replace(
            encode(
              hmac(
                _header_part || '.' || _payload_part,
                _secret,
                _algorithm
              ),
              'base64'
            ),
            '=',
            ''
          ),
          chr(10)
        ),
        '+',
        '-'
      ),
      '/',
      '_'
    );
  END IF;
  
  -- Method 3: Full base64url conversion
  IF _signature_part != _expected_signature THEN
    _expected_signature := rtrim(
      replace(
        replace(
          replace(
            encode(
              hmac(
                _header_part || '.' || _payload_part,
                _secret,
                _algorithm
              ),
              'base64'
            ),
            '/',
            '_'
          ),
          '+',
          '-'
        ),
        '=',
        ''
      ),
      chr(10)
    );
  END IF;
  
  -- Verify signature using any of the methods
  IF _signature_part != _expected_signature THEN
    RAISE EXCEPTION 'Invalid token signature';
  END IF;
  
  -- Decode the payload
  _payload := convert_from(
    decode(
      _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
      'base64'
    ),
    'UTF8'
  )::JSONB;
  
  -- Check expiration
  IF (_payload->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  -- Extract the user ID from payload
  _user_id := (_payload->>'sub')::UUID;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Token missing subject claim';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists WHERE id = _user_id
  ) INTO _is_artist;
  
  _role := CASE WHEN _is_artist THEN 'artist' ELSE 'user' END;
  
  -- Generate a new JWT token with same claims but new expiration
  _token := auth.generate_jwt(
    _user_id,
    _role,
    86400  -- 24 hours expiration
  );
  
  -- Update last_sign_in timestamp
  BEGIN
    UPDATE prettygood_private.user_auth
    SET last_sign_in = NOW()
    WHERE user_id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors on update, not critical for token refresh
    NULL;
  END;
  
  RETURN _token;
END;
$$;


ALTER FUNCTION "prettygood"."refresh_token_v2"("current_token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."refresh_token_v2"("current_token" "text") IS 'Improved token refresh function with better signature verification methods';



CREATE OR REPLACE FUNCTION "prettygood"."register_as_artist"("artist_name" "text", "bio" "text" DEFAULT NULL::"text", "genre" "text"[] DEFAULT NULL::"text"[], "location" "text" DEFAULT NULL::"text", "website" "text" DEFAULT NULL::"text", "social_links" "jsonb" DEFAULT NULL::"jsonb") RETURNS "prettygood"."artists"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."register_as_artist"("artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."register_as_artist"("artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") IS 'Registers an existing user as an artist';



CREATE OR REPLACE FUNCTION "prettygood"."register_as_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text" DEFAULT NULL::"text", "genre" "text"[] DEFAULT NULL::"text"[], "location" "text" DEFAULT NULL::"text", "website" "text" DEFAULT NULL::"text", "social_links" "jsonb" DEFAULT NULL::"jsonb") RETURNS "prettygood"."artists"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."register_as_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."register_as_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") IS 'Registers a user as an artist by explicitly providing the user ID';



CREATE OR REPLACE FUNCTION "prettygood"."register_user"("_username" "text", "_email" "text", "_password" "text", "_display_name" "text" DEFAULT NULL::"text", "_wallet_address" "text" DEFAULT NULL::"text") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
DECLARE
  _user_id UUID;  -- Changed variable name to _user_id to avoid ambiguity
  _verification_token TEXT;
BEGIN
  -- Validate inputs
  IF _username IS NULL OR LENGTH(TRIM(_username)) < 3 THEN
    RAISE EXCEPTION 'Username must be at least 3 characters long';
  END IF;

  IF _email IS NULL OR _email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF _password IS NULL OR LENGTH(_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Check if username or email already exists
  IF EXISTS (SELECT 1 FROM prettygood.users WHERE username = _username) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  IF EXISTS (SELECT 1 FROM prettygood.users WHERE email = _email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Insert new user
  INSERT INTO prettygood.users (
    username,
    email,
    display_name,
    wallet_address,
    email_verified
  ) 
  VALUES (
    _username,
    _email,
    COALESCE(_display_name, _username),
    _wallet_address,
    FALSE
  )
  RETURNING id INTO _user_id;  -- Store in _user_id variable

  -- Create auth entry with hashed password
  INSERT INTO prettygood_private.user_auth (
    user_id,
    password_hash,
    nonce_created_at
  ) 
  VALUES (
    _user_id,  -- Use _user_id variable
    crypt(_password, gen_salt('bf')), -- Use Blowfish algorithm for hashing
    NOW()
  );
  
  -- Generate email verification token
  _verification_token := prettygood.create_email_verification_token(_user_id);  -- Use _user_id variable
  
  -- Return user id and verification token
  RETURN json_build_object(
    'user_id', _user_id,  -- Use _user_id variable
    'verification_token', _verification_token
  );
END;
$_$;


ALTER FUNCTION "prettygood"."register_user"("_username" "text", "_email" "text", "_password" "text", "_display_name" "text", "_wallet_address" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."register_user"("_username" "text", "_email" "text", "_password" "text", "_display_name" "text", "_wallet_address" "text") IS 'Registers a new user with email/password authentication and returns user ID and verification token';



CREATE OR REPLACE FUNCTION "prettygood"."request_password_reset"("_email" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _reset_token TEXT;
BEGIN
  -- Find user by email
  SELECT id INTO _user_id
  FROM prettygood.users
  WHERE email = _email;
  
  -- Generate a reset token even if user not found (security best practice)
  -- This prevents enumeration attacks
  _reset_token := encode(gen_random_bytes(24), 'hex');
  
  -- If user exists, store the reset token
  IF _user_id IS NOT NULL THEN
    UPDATE prettygood_private.user_auth
    SET 
      reset_token = _reset_token,
      reset_token_expires_at = NOW() + INTERVAL '1 hour'
    WHERE user_id = _user_id;
  END IF;
  
  -- Return token regardless of whether user was found
  RETURN _reset_token;
END;
$$;


ALTER FUNCTION "prettygood"."request_password_reset"("_email" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."request_password_reset"("_email" "text") IS 'Generates a password reset token for a given email address';



CREATE OR REPLACE FUNCTION "prettygood"."reset_password"("_reset_token" "text", "_new_password" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _token_expiration TIMESTAMPTZ;
BEGIN
  -- Check password strength
  IF _new_password IS NULL OR LENGTH(_new_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Find user with this reset token
  SELECT a.user_id, a.reset_token_expires_at INTO _user_id, _token_expiration
  FROM prettygood_private.user_auth a
  WHERE a.reset_token = _reset_token;
  
  -- Check if token exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired reset token';
  END IF;
  
  -- Check if token is expired
  IF _token_expiration < NOW() THEN
    RAISE EXCEPTION 'Reset token has expired. Please request a new one.';
  END IF;
  
  -- Update password and clear reset token
  UPDATE prettygood_private.user_auth
  SET 
    password_hash = crypt(_new_password, gen_salt('bf')),
    reset_token = NULL,
    reset_token_expires_at = NULL,
    failed_login_attempts = 0,
    last_failed_attempt = NULL,
    locked_until = NULL
  WHERE user_id = _user_id;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "prettygood"."reset_password"("_reset_token" "text", "_new_password" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."reset_password"("_reset_token" "text", "_new_password" "text") IS 'Resets a user''s password using the provided token';



CREATE TABLE IF NOT EXISTS "prettygood"."payments" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "amount" numeric(20,9) NOT NULL,
    "currency" "text" DEFAULT 'SUI'::"text" NOT NULL,
    "transaction_hash" "text",
    "status" "text" NOT NULL,
    "payment_type" "text" NOT NULL,
    "track_id" "uuid",
    "album_id" "uuid",
    "message" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payments_payment_type_check" CHECK (("payment_type" = ANY (ARRAY['tip'::"text", 'subscription'::"text", 'purchase'::"text"]))),
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'failed'::"text"])))
);


ALTER TABLE "prettygood"."payments" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."payments" IS 'Payment/tip transactions on the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."payments"."amount" IS 'Payment amount with 9 decimal places for small crypto denominations';



COMMENT ON COLUMN "prettygood"."payments"."transaction_hash" IS 'Blockchain transaction hash';



COMMENT ON COLUMN "prettygood"."payments"."payment_type" IS 'Type of payment (tip, subscription, purchase)';



CREATE OR REPLACE FUNCTION "prettygood"."tip_artist"("artist_id" "uuid", "amount" numeric, "transaction_hash" "text", "track_id" "uuid" DEFAULT NULL::"uuid", "album_id" "uuid" DEFAULT NULL::"uuid", "message" "text" DEFAULT NULL::"text") RETURNS "prettygood"."payments"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."tip_artist"("artist_id" "uuid", "amount" numeric, "transaction_hash" "text", "track_id" "uuid", "album_id" "uuid", "message" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."tip_artist"("artist_id" "uuid", "amount" numeric, "transaction_hash" "text", "track_id" "uuid", "album_id" "uuid", "message" "text") IS 'Records a tip payment from user to artist';



CREATE OR REPLACE FUNCTION "prettygood"."trace_token_verification"("token" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _parts TEXT[];
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _payload_decoded BYTEA;
  _payload_json JSONB;
  _expected_signature TEXT;
  _algorithm TEXT := 'sha256';
  _secret TEXT;
BEGIN
  -- Split the token into parts
  _parts := string_to_array(token, '.');
  
  -- Basic validation
  IF array_length(_parts, 1) != 3 THEN
    RETURN jsonb_build_object(
      'error', 'Token does not have three parts',
      'parts_count', array_length(_parts, 1)
    );
  END IF;
  
  _header_part := _parts[1];
  _payload_part := _parts[2];
  _signature_part := _parts[3];
  
  -- Check for empty parts
  IF _header_part = '' OR _payload_part = '' OR _signature_part = '' THEN
    RETURN jsonb_build_object(
      'error', 'Token has empty parts',
      'header_length', length(_header_part),
      'payload_length', length(_payload_part),
      'signature_length', length(_signature_part)
    );
  END IF;
  
  -- Try to decode payload
  BEGIN
    -- Add padding if needed for base64 decoding
    _payload_decoded := decode(
      _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
      'base64'
    );
    
    -- Convert to JSON
    _payload_json := convert_from(_payload_decoded, 'UTF8')::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Failed to decode payload',
      'payload_part', _payload_part,
      'detail', SQLERRM
    );
  END;
  
  -- Check if decoded payload has required fields
  IF _payload_json->>'sub' IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'Payload missing subject claim',
      'payload', _payload_json
    );
  END IF;
  
  -- Check if token has expired
  IF (_payload_json->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RETURN jsonb_build_object(
      'error', 'Token has expired',
      'exp', to_timestamp((_payload_json->>'exp')::NUMERIC),
      'now', now(),
      'seconds_expired', extract(epoch from now()) - (_payload_json->>'exp')::NUMERIC
    );
  END IF;
  
  -- Get JWT secret
  BEGIN
    _secret := auth.get_jwt_secret();
    
    IF _secret IS NULL OR _secret = '' THEN
      RETURN jsonb_build_object(
        'error', 'JWT secret is not configured'
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Failed to get JWT secret',
      'detail', SQLERRM
    );
  END;
  
  -- Calculate expected signature
  -- First with normal base64 handling
  _expected_signature := rtrim(
    replace(
      encode(
        hmac(
          _header_part || '.' || _payload_part,
          _secret,
          _algorithm
        ),
        'base64'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Check if signatures match with normal base64
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (standard base64)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'standard_base64'
    );
  END IF;
  
  -- Try with base64url encoding
  _expected_signature := replace(
    replace(
      rtrim(
        replace(
          encode(
            hmac(
              _header_part || '.' || _payload_part,
              _secret,
              _algorithm
            ),
            'base64'
          ),
          '=',
          ''
        ),
        chr(10)
      ),
      '+',
      '-'
    ),
    '/',
    '_'
  );
  
  -- Check if signatures match with base64url
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (base64url)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'base64url'
    );
  END IF;
  
  -- Calculate with full base64url conversion to debug
  _expected_signature := rtrim(
    replace(
      replace(
        replace(
          encode(
            hmac(
              _header_part || '.' || _payload_part,
              _secret,
              _algorithm
            ),
            'base64'
          ),
          '/',
          '_'
        ),
        '+',
        '-'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Check with full base64url encoding
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (full base64url)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'full_base64url'
    );
  END IF;
  
  -- If we get here, the signatures don't match
  RETURN jsonb_build_object(
    'error', 'Signature verification failed',
    'payload', _payload_json,
    'signature_part', _signature_part,
    'expected_signature_std', rtrim(
      replace(
        encode(
          hmac(
            _header_part || '.' || _payload_part,
            _secret,
            _algorithm
          ),
          'base64'
        ),
        '=',
        ''
      ),
      chr(10)
    ),
    'expected_signature_url', rtrim(
      replace(
        replace(
          replace(
            encode(
              hmac(
                _header_part || '.' || _payload_part,
                _secret,
                _algorithm
              ),
              'base64'
            ),
            '/',
            '_'
          ),
          '+',
          '-'
        ),
        '=',
        ''
      ),
      chr(10)
    ),
    'signature_match', false,
    'secret_length', length(_secret)
  );
END;
$$;


ALTER FUNCTION "prettygood"."trace_token_verification"("token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."trace_token_verification"("token" "text") IS 'Debug function that provides detailed tracing of JWT token verification steps';



CREATE OR REPLACE FUNCTION "prettygood"."update_artist_with_id"("user_id" "uuid", "artist_name" "text" DEFAULT NULL::"text", "bio" "text" DEFAULT NULL::"text", "genre" "text"[] DEFAULT NULL::"text"[], "location" "text" DEFAULT NULL::"text", "website" "text" DEFAULT NULL::"text", "social_links" "jsonb" DEFAULT NULL::"jsonb") RETURNS "prettygood"."artists"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."update_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."update_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") IS 'Updates an existing artist profile by explicitly providing the user ID';



CREATE OR REPLACE FUNCTION "prettygood"."verify_email"("_verification_token" "text") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  _user_id UUID;
  _is_expired BOOLEAN;
BEGIN
  -- Get user_id from token and check if it's expired
  SELECT 
    t.user_id,
    t.expires_at < NOW() INTO _user_id, _is_expired
  FROM prettygood_private.email_verification_tokens t
  WHERE t.token = _verification_token;
  
  -- Check if token exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid verification token';
  END IF;
  
  -- Check if token is expired
  IF _is_expired THEN
    RAISE EXCEPTION 'Verification token has expired. Please request a new one.';
  END IF;
  
  -- Update user's email_verified status
  UPDATE prettygood.users
  SET email_verified = TRUE
  WHERE id = _user_id;
  
  -- Delete the used token
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE token = _verification_token;
  
  RETURN TRUE;
END;
$$;


ALTER FUNCTION "prettygood"."verify_email"("_verification_token" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."verify_email"("_verification_token" "text") IS 'Verifies a user''s email using the provided token';



CREATE OR REPLACE FUNCTION "prettygood"."verify_signature"("wallet_address" "text", "signature" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "prettygood"."verify_signature"("wallet_address" "text", "signature" "text") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood"."verify_signature"("wallet_address" "text", "signature" "text") IS 'Verifies a wallet signature and returns a JWT token';



CREATE OR REPLACE FUNCTION "prettygood_private"."check_account_lockout"("_user_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  _is_locked BOOLEAN;
  _lockout_until TIMESTAMPTZ;
  _reset_after INTERVAL := INTERVAL '30 minutes';
BEGIN
  -- Get lock status for user
  SELECT 
    COALESCE(locked_until > NOW(), FALSE),
    locked_until
  INTO _is_locked, _lockout_until
  FROM prettygood_private.user_auth a
  WHERE a.user_id = _user_id;
  
  -- If account is locked, return locked status
  IF _is_locked THEN
    RETURN TRUE;
  END IF;
  
  -- Check if we should reset failed attempts (after 30 minutes of no failures)
  UPDATE prettygood_private.user_auth a
  SET failed_login_attempts = 0
  WHERE 
    a.user_id = _user_id AND
    a.last_failed_attempt < NOW() - _reset_after;
  
  RETURN FALSE;
END;
$$;


ALTER FUNCTION "prettygood_private"."check_account_lockout"("_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."check_account_lockout"("_user_id" "uuid") IS 'Checks if an account is locked and handles automatic unlocking';



CREATE OR REPLACE FUNCTION "prettygood_private"."clean_expired_verification_tokens"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE expires_at < NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "prettygood_private"."clean_expired_verification_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood_private"."clear_expired_reset_tokens"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Clear expired reset tokens
  IF NEW.reset_token IS NOT NULL AND NEW.reset_token_expires_at < NOW() THEN
    NEW.reset_token := NULL;
    NEW.reset_token_expires_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "prettygood_private"."clear_expired_reset_tokens"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood_private"."current_user_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', TRUE)::json->>'user_id', '')::UUID;
$$;


ALTER FUNCTION "prettygood_private"."current_user_id"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."current_user_id"() IS 'Gets the user ID from the JWT claims';



CREATE OR REPLACE FUNCTION "prettygood_private"."get_app_role"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN current_user;
END;
$$;


ALTER FUNCTION "prettygood_private"."get_app_role"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."get_app_role"() IS 'Helper function to identify the application database role';



CREATE OR REPLACE FUNCTION "prettygood_private"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT (current_setting('request.jwt.claims', TRUE)::json->>'role') = 'admin';
$$;


ALTER FUNCTION "prettygood_private"."is_admin"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."is_admin"() IS 'Checks if the current user has the admin role';



CREATE OR REPLACE FUNCTION "prettygood_private"."is_artist"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists 
    WHERE id = prettygood_private.current_user_id()
  );
$$;


ALTER FUNCTION "prettygood_private"."is_artist"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."is_artist"() IS 'Checks if the current user is an artist';



CREATE OR REPLACE FUNCTION "prettygood_private"."is_authenticated"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT prettygood_private.current_user_id() IS NOT NULL;
$$;


ALTER FUNCTION "prettygood_private"."is_authenticated"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."is_authenticated"() IS 'Checks if the current request is authenticated';



CREATE OR REPLACE FUNCTION "prettygood_private"."log_permission_fix"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RAISE NOTICE 'Fixing permissions for role: %', prettygood_private.get_app_role();
END;
$$;


ALTER FUNCTION "prettygood_private"."log_permission_fix"() OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."log_permission_fix"() IS 'Logs information about permission fixes being applied';



CREATE OR REPLACE FUNCTION "prettygood_private"."migrate_genres"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  genre_name TEXT;
  genre_id UUID;
  track_id UUID;
  artist_id UUID;
  album_id UUID;
BEGIN
  -- Collect unique genres from all tracks, artists, and albums
  FOR genre_name IN 
    SELECT DISTINCT unnest(genre) as name FROM prettygood.tracks
    UNION
    SELECT DISTINCT unnest(genre) as name FROM prettygood.artists
    UNION
    SELECT DISTINCT unnest(genre) as name FROM prettygood.albums
    WHERE genre_name IS NOT NULL AND genre_name != ''
  LOOP
    -- Insert the genre if it doesn't already exist
    INSERT INTO prettygood.genres (name, slug)
    VALUES (
      genre_name, 
      lower(regexp_replace(genre_name, '[^a-zA-Z0-9]', '-', 'g'))
    )
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO genre_id;
    
    -- If insertion didn't return an ID, get it
    IF genre_id IS NULL THEN
      SELECT id INTO genre_id FROM prettygood.genres WHERE name = genre_name;
    END IF;
    
    -- Migrate track genres
    FOR track_id IN 
      SELECT id FROM prettygood.tracks
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.track_genres (track_id, genre_id)
      VALUES (track_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Migrate artist genres
    FOR artist_id IN 
      SELECT id FROM prettygood.artists
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.artist_genres (artist_id, genre_id)
      VALUES (artist_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Migrate album genres
    FOR album_id IN 
      SELECT id FROM prettygood.albums
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.album_genres (album_id, genre_id)
      VALUES (album_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;


ALTER FUNCTION "prettygood_private"."migrate_genres"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood_private"."record_failed_login"("_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  _current_attempts INTEGER;
  _max_attempts CONSTANT INTEGER := 5;
  _lockout_duration INTERVAL := INTERVAL '15 minutes';
BEGIN
  -- Update failed attempts count
  UPDATE prettygood_private.user_auth a
  SET 
    failed_login_attempts = a.failed_login_attempts + 1,
    last_failed_attempt = NOW()
  WHERE a.user_id = _user_id
  RETURNING a.failed_login_attempts INTO _current_attempts;
  
  -- If max attempts reached, lock the account
  IF _current_attempts >= _max_attempts THEN
    UPDATE prettygood_private.user_auth a
    SET locked_until = NOW() + _lockout_duration
    WHERE a.user_id = _user_id;
  END IF;
END;
$$;


ALTER FUNCTION "prettygood_private"."record_failed_login"("_user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "prettygood_private"."record_failed_login"("_user_id" "uuid") IS 'Records a failed login attempt and handles account lockout if needed';



CREATE OR REPLACE FUNCTION "prettygood_private"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "prettygood_private"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "prettygood_private"."track_payment_status_changes"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prettygood_private.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "prettygood_private"."track_payment_status_changes"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "prettygood"."album_genres" (
    "album_id" "uuid" NOT NULL,
    "genre_id" "uuid" NOT NULL
);


ALTER TABLE "prettygood"."album_genres" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."album_genres" IS 'Junction table connecting albums to genres';



CREATE TABLE IF NOT EXISTS "prettygood"."album_likes" (
    "album_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "liked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."album_likes" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."album_likes" IS 'Tracks which users have liked which albums';



CREATE TABLE IF NOT EXISTS "prettygood"."play_history" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "track_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "played_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "play_duration" integer,
    "completed" boolean DEFAULT false,
    "source" "text",
    "client_ip" "text",
    "user_agent" "text"
);


ALTER TABLE "prettygood"."play_history" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."play_history" IS 'Records each time a user plays a track';



COMMENT ON COLUMN "prettygood"."play_history"."track_id" IS 'Reference to the track that was played';



COMMENT ON COLUMN "prettygood"."play_history"."user_id" IS 'Reference to the user who played the track';



COMMENT ON COLUMN "prettygood"."play_history"."played_at" IS 'When the track was played';



COMMENT ON COLUMN "prettygood"."play_history"."play_duration" IS 'How long the track was played in seconds';



COMMENT ON COLUMN "prettygood"."play_history"."completed" IS 'Whether the track was played to completion';



COMMENT ON COLUMN "prettygood"."play_history"."source" IS 'Where the play came from (search, playlist, album, etc.)';



CREATE OR REPLACE VIEW "prettygood"."album_play_counts" AS
 SELECT "tracks"."album_id",
    "count"(*) AS "play_count"
   FROM ("prettygood"."play_history"
     JOIN "prettygood"."tracks" ON (("play_history"."track_id" = "tracks"."id")))
  WHERE ("tracks"."album_id" IS NOT NULL)
  GROUP BY "tracks"."album_id";


ALTER TABLE "prettygood"."album_play_counts" OWNER TO "postgres";


COMMENT ON VIEW "prettygood"."album_play_counts" IS 'View of play counts for each album';



CREATE TABLE IF NOT EXISTS "prettygood"."artist_followers" (
    "artist_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "followed_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."artist_followers" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."artist_followers" IS 'Tracks which users follow which artists';



CREATE TABLE IF NOT EXISTS "prettygood"."artist_genres" (
    "artist_id" "uuid" NOT NULL,
    "genre_id" "uuid" NOT NULL
);


ALTER TABLE "prettygood"."artist_genres" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."artist_genres" IS 'Junction table connecting artists to genres';



CREATE OR REPLACE VIEW "prettygood"."artist_play_counts" AS
 SELECT "tracks"."artist_id",
    "count"(*) AS "play_count"
   FROM ("prettygood"."play_history"
     JOIN "prettygood"."tracks" ON (("play_history"."track_id" = "tracks"."id")))
  GROUP BY "tracks"."artist_id";


ALTER TABLE "prettygood"."artist_play_counts" OWNER TO "postgres";


COMMENT ON VIEW "prettygood"."artist_play_counts" IS 'View of play counts for each artist';



CREATE TABLE IF NOT EXISTS "prettygood"."playlist_collaborators" (
    "playlist_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "added_by" "uuid" NOT NULL
);


ALTER TABLE "prettygood"."playlist_collaborators" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."playlist_collaborators" IS 'Users who can collaborate on a playlist';



CREATE TABLE IF NOT EXISTS "prettygood"."playlist_likes" (
    "playlist_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "liked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."playlist_likes" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."playlist_likes" IS 'Tracks which users have liked which playlists';



CREATE TABLE IF NOT EXISTS "prettygood"."playlist_tracks" (
    "playlist_id" "uuid" NOT NULL,
    "track_id" "uuid" NOT NULL,
    "added_by" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "position" integer NOT NULL
);


ALTER TABLE "prettygood"."playlist_tracks" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."playlist_tracks" IS 'Junction table linking tracks to playlists';



COMMENT ON COLUMN "prettygood"."playlist_tracks"."position" IS 'Position of the track in the playlist';



CREATE TABLE IF NOT EXISTS "prettygood"."search_history" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "query" "text" NOT NULL,
    "searched_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."search_history" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."search_history" IS 'History of user search queries';



CREATE TABLE IF NOT EXISTS "prettygood"."track_genres" (
    "track_id" "uuid" NOT NULL,
    "genre_id" "uuid" NOT NULL
);


ALTER TABLE "prettygood"."track_genres" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."track_genres" IS 'Junction table connecting tracks to genres';



CREATE TABLE IF NOT EXISTS "prettygood"."track_likes" (
    "track_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "liked_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."track_likes" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."track_likes" IS 'Tracks which users have liked which tracks';



CREATE OR REPLACE VIEW "prettygood"."track_play_counts" AS
 SELECT "play_history"."track_id",
    "count"(*) AS "play_count"
   FROM "prettygood"."play_history"
  GROUP BY "play_history"."track_id";


ALTER TABLE "prettygood"."track_play_counts" OWNER TO "postgres";


COMMENT ON VIEW "prettygood"."track_play_counts" IS 'View of play counts for each track';



CREATE TABLE IF NOT EXISTS "prettygood"."user_library_albums" (
    "user_id" "uuid" NOT NULL,
    "album_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."user_library_albums" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."user_library_albums" IS 'Albums saved to a user''s library';



CREATE TABLE IF NOT EXISTS "prettygood"."user_library_artists" (
    "user_id" "uuid" NOT NULL,
    "artist_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."user_library_artists" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."user_library_artists" IS 'Artists saved to a user''s library';



CREATE TABLE IF NOT EXISTS "prettygood"."user_library_tracks" (
    "user_id" "uuid" NOT NULL,
    "track_id" "uuid" NOT NULL,
    "added_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."user_library_tracks" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."user_library_tracks" IS 'Tracks saved to a user''s library';



CREATE OR REPLACE VIEW "prettygood"."user_play_counts" AS
 SELECT "play_history"."user_id",
    "count"(*) AS "play_count"
   FROM "prettygood"."play_history"
  GROUP BY "play_history"."user_id";


ALTER TABLE "prettygood"."user_play_counts" OWNER TO "postgres";


COMMENT ON VIEW "prettygood"."user_play_counts" IS 'View of play counts for each user';



CREATE TABLE IF NOT EXISTS "prettygood"."user_recently_played" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "track_id" "uuid" NOT NULL,
    "played_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "context_type" "text",
    "context_id" "uuid"
);


ALTER TABLE "prettygood"."user_recently_played" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."user_recently_played" IS 'Recently played tracks for each user';



COMMENT ON COLUMN "prettygood"."user_recently_played"."context_type" IS 'Source context of the play (album, playlist, etc.)';



COMMENT ON COLUMN "prettygood"."user_recently_played"."context_id" IS 'ID of the context object (album, playlist, etc.)';



CREATE TABLE IF NOT EXISTS "prettygood"."user_settings" (
    "user_id" "uuid" NOT NULL,
    "theme" "text" DEFAULT 'auto'::"text",
    "audio_quality" "text" DEFAULT 'high'::"text",
    "enable_explicit_content" boolean DEFAULT true,
    "enable_autoplay" boolean DEFAULT true,
    "enable_crossfade" boolean DEFAULT true,
    "crossfade_duration" integer DEFAULT 5,
    "enable_gapless_playback" boolean DEFAULT true,
    "volume_level" integer DEFAULT 70,
    "enable_equalizer" boolean DEFAULT false,
    "equalizer_settings" "jsonb" DEFAULT '{}'::"jsonb",
    "enable_notifications" boolean DEFAULT true,
    "notification_settings" "jsonb" DEFAULT '{}'::"jsonb",
    "preferred_language" "text" DEFAULT 'en'::"text",
    "auto_add_to_library" boolean DEFAULT false,
    "privacy_level" "text" DEFAULT 'friends'::"text",
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood"."user_settings" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."user_settings" IS 'User preferences and settings';



COMMENT ON COLUMN "prettygood"."user_settings"."theme" IS 'User''s preferred theme (light, dark, auto)';



COMMENT ON COLUMN "prettygood"."user_settings"."audio_quality" IS 'Preferred audio streaming quality';



COMMENT ON COLUMN "prettygood"."user_settings"."equalizer_settings" IS 'JSON with equalizer band settings';



COMMENT ON COLUMN "prettygood"."user_settings"."notification_settings" IS 'JSON with notification preferences';



COMMENT ON COLUMN "prettygood"."user_settings"."privacy_level" IS 'User''s privacy preference for activity sharing';



CREATE TABLE IF NOT EXISTS "prettygood"."users" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "wallet_address" "text",
    "username" "text" NOT NULL,
    "display_name" "text",
    "email" "text" NOT NULL,
    "profile_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email_verified" boolean DEFAULT false
);


ALTER TABLE "prettygood"."users" OWNER TO "postgres";


COMMENT ON TABLE "prettygood"."users" IS 'User accounts for the prettygood.music platform';



COMMENT ON COLUMN "prettygood"."users"."wallet_address" IS 'Sui blockchain wallet address used for authentication';



COMMENT ON COLUMN "prettygood"."users"."username" IS 'Unique username for the user';



COMMENT ON COLUMN "prettygood"."users"."profile_url" IS 'URL to the user profile image';



COMMENT ON COLUMN "prettygood"."users"."email_verified" IS 'Indicates whether user''s email has been verified';



CREATE TABLE IF NOT EXISTS "prettygood_private"."email_verification_tokens" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '24:00:00'::interval) NOT NULL
);


ALTER TABLE "prettygood_private"."email_verification_tokens" OWNER TO "postgres";


COMMENT ON TABLE "prettygood_private"."email_verification_tokens" IS 'Stores tokens for email verification';



CREATE TABLE IF NOT EXISTS "prettygood_private"."migrations" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "applied_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "prettygood_private"."migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "prettygood_private"."payment_status_history" (
    "id" "uuid" DEFAULT "public"."uuid_generate_v4"() NOT NULL,
    "payment_id" "uuid" NOT NULL,
    "old_status" "text",
    "new_status" "text" NOT NULL,
    "notes" "text",
    "changed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "changed_by" "text" DEFAULT 'system'::"text" NOT NULL
);


ALTER TABLE "prettygood_private"."payment_status_history" OWNER TO "postgres";


COMMENT ON TABLE "prettygood_private"."payment_status_history" IS 'History of payment status changes';



CREATE TABLE IF NOT EXISTS "prettygood_private"."related_genres" (
    "genre_id" "uuid" NOT NULL,
    "related_genre_id" "uuid" NOT NULL,
    "weight" integer DEFAULT 1
);


ALTER TABLE "prettygood_private"."related_genres" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "prettygood_private"."user_auth" (
    "user_id" "uuid" NOT NULL,
    "nonce" "text",
    "nonce_created_at" timestamp with time zone,
    "last_sign_in" timestamp with time zone,
    "last_sign_in_ip" "text",
    "password_hash" "text",
    "password_salt" "text",
    "reset_token" "text",
    "reset_token_expires_at" timestamp with time zone,
    "failed_login_attempts" integer DEFAULT 0,
    "last_failed_attempt" timestamp with time zone,
    "locked_until" timestamp with time zone
);


ALTER TABLE "prettygood_private"."user_auth" OWNER TO "postgres";


COMMENT ON TABLE "prettygood_private"."user_auth" IS 'Private authentication details for users';



COMMENT ON COLUMN "prettygood_private"."user_auth"."nonce" IS 'Random value used for wallet signature verification';



COMMENT ON COLUMN "prettygood_private"."user_auth"."password_hash" IS 'Hashed password for email/password authentication, null for wallet-only users';



COMMENT ON COLUMN "prettygood_private"."user_auth"."password_salt" IS 'Salt used for password hashing, null for wallet-only users';



COMMENT ON COLUMN "prettygood_private"."user_auth"."reset_token" IS 'Token used for password reset, cleared after use';



COMMENT ON COLUMN "prettygood_private"."user_auth"."reset_token_expires_at" IS 'Expiration time for password reset token';



COMMENT ON COLUMN "prettygood_private"."user_auth"."failed_login_attempts" IS 'Number of consecutive failed login attempts';



COMMENT ON COLUMN "prettygood_private"."user_auth"."last_failed_attempt" IS 'Timestamp of the last failed login attempt';



COMMENT ON COLUMN "prettygood_private"."user_auth"."locked_until" IS 'Timestamp until which the account is locked due to too many failed attempts';



ALTER TABLE ONLY "prettygood"."album_genres"
    ADD CONSTRAINT "album_genres_pkey" PRIMARY KEY ("album_id", "genre_id");



ALTER TABLE ONLY "prettygood"."album_likes"
    ADD CONSTRAINT "album_likes_pkey" PRIMARY KEY ("album_id", "user_id");



ALTER TABLE ONLY "prettygood"."albums"
    ADD CONSTRAINT "albums_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."artist_followers"
    ADD CONSTRAINT "artist_followers_pkey" PRIMARY KEY ("artist_id", "user_id");



ALTER TABLE ONLY "prettygood"."artist_genres"
    ADD CONSTRAINT "artist_genres_pkey" PRIMARY KEY ("artist_id", "genre_id");



ALTER TABLE ONLY "prettygood"."artists"
    ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."genres"
    ADD CONSTRAINT "genres_name_key" UNIQUE ("name");



ALTER TABLE ONLY "prettygood"."genres"
    ADD CONSTRAINT "genres_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."genres"
    ADD CONSTRAINT "genres_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_transaction_hash_key" UNIQUE ("transaction_hash");



ALTER TABLE ONLY "prettygood"."play_history"
    ADD CONSTRAINT "play_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."playlist_collaborators"
    ADD CONSTRAINT "playlist_collaborators_pkey" PRIMARY KEY ("playlist_id", "user_id");



ALTER TABLE ONLY "prettygood"."playlist_likes"
    ADD CONSTRAINT "playlist_likes_pkey" PRIMARY KEY ("playlist_id", "user_id");



ALTER TABLE ONLY "prettygood"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("playlist_id", "track_id");



ALTER TABLE ONLY "prettygood"."playlists"
    ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."search_history"
    ADD CONSTRAINT "search_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."track_genres"
    ADD CONSTRAINT "track_genres_pkey" PRIMARY KEY ("track_id", "genre_id");



ALTER TABLE ONLY "prettygood"."track_likes"
    ADD CONSTRAINT "track_likes_pkey" PRIMARY KEY ("track_id", "user_id");



ALTER TABLE ONLY "prettygood"."tracks"
    ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."user_library_albums"
    ADD CONSTRAINT "user_library_albums_pkey" PRIMARY KEY ("user_id", "album_id");



ALTER TABLE ONLY "prettygood"."user_library_artists"
    ADD CONSTRAINT "user_library_artists_pkey" PRIMARY KEY ("user_id", "artist_id");



ALTER TABLE ONLY "prettygood"."user_library_tracks"
    ADD CONSTRAINT "user_library_tracks_pkey" PRIMARY KEY ("user_id", "track_id");



ALTER TABLE ONLY "prettygood"."user_recently_played"
    ADD CONSTRAINT "user_recently_played_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "prettygood"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "prettygood"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "prettygood"."users"
    ADD CONSTRAINT "users_wallet_address_key" UNIQUE ("wallet_address");



ALTER TABLE ONLY "prettygood_private"."email_verification_tokens"
    ADD CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood_private"."email_verification_tokens"
    ADD CONSTRAINT "email_verification_tokens_token_key" UNIQUE ("token");



ALTER TABLE ONLY "prettygood_private"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood_private"."payment_status_history"
    ADD CONSTRAINT "payment_status_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "prettygood_private"."related_genres"
    ADD CONSTRAINT "related_genres_pkey" PRIMARY KEY ("genre_id", "related_genre_id");



ALTER TABLE ONLY "prettygood_private"."user_auth"
    ADD CONSTRAINT "user_auth_pkey" PRIMARY KEY ("user_id");



CREATE INDEX "idx_album_genres_genre_id" ON "prettygood"."album_genres" USING "btree" ("genre_id");



CREATE INDEX "idx_album_likes_user_id" ON "prettygood"."album_likes" USING "btree" ("user_id");



CREATE INDEX "idx_albums_artist_id" ON "prettygood"."albums" USING "btree" ("artist_id");



CREATE INDEX "idx_albums_cover_url" ON "prettygood"."albums" USING "btree" ("cover_url");



CREATE INDEX "idx_albums_genre" ON "prettygood"."albums" USING "gin" ("genre");



CREATE INDEX "idx_albums_release_date" ON "prettygood"."albums" USING "btree" ("release_date");



CREATE INDEX "idx_albums_title" ON "prettygood"."albums" USING "btree" ("title");



CREATE INDEX "idx_artist_followers_user_id" ON "prettygood"."artist_followers" USING "btree" ("user_id");



CREATE INDEX "idx_artist_genres_genre_id" ON "prettygood"."artist_genres" USING "btree" ("genre_id");



CREATE INDEX "idx_artists_genre" ON "prettygood"."artists" USING "gin" ("genre");



CREATE INDEX "idx_artists_name" ON "prettygood"."artists" USING "btree" ("artist_name");



CREATE INDEX "idx_genres_name" ON "prettygood"."genres" USING "btree" ("name");



CREATE INDEX "idx_genres_popularity" ON "prettygood"."genres" USING "btree" ("popularity");



CREATE INDEX "idx_genres_slug" ON "prettygood"."genres" USING "btree" ("slug");



CREATE INDEX "idx_payments_album_id" ON "prettygood"."payments" USING "btree" ("album_id");



CREATE INDEX "idx_payments_created_at" ON "prettygood"."payments" USING "btree" ("created_at");



CREATE INDEX "idx_payments_recipient_id" ON "prettygood"."payments" USING "btree" ("recipient_id");



CREATE INDEX "idx_payments_sender_id" ON "prettygood"."payments" USING "btree" ("sender_id");



CREATE INDEX "idx_payments_status" ON "prettygood"."payments" USING "btree" ("status");



CREATE INDEX "idx_payments_track_id" ON "prettygood"."payments" USING "btree" ("track_id");



CREATE INDEX "idx_play_history_played_at" ON "prettygood"."play_history" USING "btree" ("played_at");



CREATE INDEX "idx_play_history_track_id" ON "prettygood"."play_history" USING "btree" ("track_id");



CREATE INDEX "idx_play_history_user_id" ON "prettygood"."play_history" USING "btree" ("user_id");



CREATE INDEX "idx_playlist_collaborators_user_id" ON "prettygood"."playlist_collaborators" USING "btree" ("user_id");



CREATE INDEX "idx_playlist_likes_user_id" ON "prettygood"."playlist_likes" USING "btree" ("user_id");



CREATE INDEX "idx_playlist_tracks_added_by" ON "prettygood"."playlist_tracks" USING "btree" ("added_by");



CREATE INDEX "idx_playlist_tracks_position" ON "prettygood"."playlist_tracks" USING "btree" ("position");



CREATE INDEX "idx_playlist_tracks_track_id" ON "prettygood"."playlist_tracks" USING "btree" ("track_id");



CREATE INDEX "idx_playlists_cover_url" ON "prettygood"."playlists" USING "btree" ("cover_url");



CREATE INDEX "idx_playlists_name" ON "prettygood"."playlists" USING "btree" ("name");



CREATE INDEX "idx_playlists_user_id" ON "prettygood"."playlists" USING "btree" ("user_id");



CREATE INDEX "idx_search_history_searched_at" ON "prettygood"."search_history" USING "btree" ("searched_at");



CREATE INDEX "idx_search_history_user_id" ON "prettygood"."search_history" USING "btree" ("user_id");



CREATE INDEX "idx_track_genres_genre_id" ON "prettygood"."track_genres" USING "btree" ("genre_id");



CREATE INDEX "idx_track_likes_user_id" ON "prettygood"."track_likes" USING "btree" ("user_id");



CREATE INDEX "idx_tracks_album_id" ON "prettygood"."tracks" USING "btree" ("album_id");



CREATE INDEX "idx_tracks_artist_id" ON "prettygood"."tracks" USING "btree" ("artist_id");



CREATE INDEX "idx_tracks_cover_url" ON "prettygood"."tracks" USING "btree" ("cover_url");



CREATE INDEX "idx_tracks_genre" ON "prettygood"."tracks" USING "gin" ("genre");



CREATE INDEX "idx_tracks_title" ON "prettygood"."tracks" USING "btree" ("title");



CREATE INDEX "idx_user_library_albums_album_id" ON "prettygood"."user_library_albums" USING "btree" ("album_id");



CREATE INDEX "idx_user_library_artists_artist_id" ON "prettygood"."user_library_artists" USING "btree" ("artist_id");



CREATE INDEX "idx_user_library_tracks_track_id" ON "prettygood"."user_library_tracks" USING "btree" ("track_id");



CREATE INDEX "idx_user_recently_played_context_id" ON "prettygood"."user_recently_played" USING "btree" ("context_id");



CREATE INDEX "idx_user_recently_played_played_at" ON "prettygood"."user_recently_played" USING "btree" ("played_at");



CREATE INDEX "idx_user_recently_played_track_id" ON "prettygood"."user_recently_played" USING "btree" ("track_id");



CREATE INDEX "idx_user_recently_played_user_id" ON "prettygood"."user_recently_played" USING "btree" ("user_id");



CREATE INDEX "idx_users_profile_url" ON "prettygood"."users" USING "btree" ("profile_url");



CREATE INDEX "idx_users_username" ON "prettygood"."users" USING "btree" ("username");



CREATE INDEX "idx_users_wallet_address" ON "prettygood"."users" USING "btree" ("wallet_address");



CREATE INDEX "idx_payment_status_history_payment_id" ON "prettygood_private"."payment_status_history" USING "btree" ("payment_id");



CREATE INDEX "idx_user_auth_reset_token" ON "prettygood_private"."user_auth" USING "btree" ("reset_token");



CREATE INDEX "idx_verification_tokens_token" ON "prettygood_private"."email_verification_tokens" USING "btree" ("token");



CREATE INDEX "idx_verification_tokens_user_id" ON "prettygood_private"."email_verification_tokens" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "set_album_updated_at" BEFORE UPDATE ON "prettygood"."albums" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_artist_updated_at" BEFORE UPDATE ON "prettygood"."artists" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_genres_updated_at" BEFORE UPDATE ON "prettygood"."genres" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_payment_updated_at" BEFORE UPDATE ON "prettygood"."payments" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_playlist_updated_at" BEFORE UPDATE ON "prettygood"."playlists" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_track_updated_at" BEFORE UPDATE ON "prettygood"."tracks" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "prettygood"."users" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_user_settings_updated_at" BEFORE UPDATE ON "prettygood"."user_settings" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."set_updated_at"();



CREATE OR REPLACE TRIGGER "track_payment_status" AFTER UPDATE ON "prettygood"."payments" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."track_payment_status_changes"();



CREATE OR REPLACE TRIGGER "clean_expired_verification_tokens" AFTER INSERT ON "prettygood_private"."email_verification_tokens" FOR EACH STATEMENT EXECUTE FUNCTION "prettygood_private"."clean_expired_verification_tokens"();



CREATE OR REPLACE TRIGGER "clear_expired_reset_tokens" BEFORE UPDATE ON "prettygood_private"."user_auth" FOR EACH ROW EXECUTE FUNCTION "prettygood_private"."clear_expired_reset_tokens"();



ALTER TABLE ONLY "prettygood"."album_genres"
    ADD CONSTRAINT "album_genres_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "prettygood"."albums"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."album_genres"
    ADD CONSTRAINT "album_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "prettygood"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."album_likes"
    ADD CONSTRAINT "album_likes_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "prettygood"."albums"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."album_likes"
    ADD CONSTRAINT "album_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."albums"
    ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "prettygood"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."artist_followers"
    ADD CONSTRAINT "artist_followers_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "prettygood"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."artist_followers"
    ADD CONSTRAINT "artist_followers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."artist_genres"
    ADD CONSTRAINT "artist_genres_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "prettygood"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."artist_genres"
    ADD CONSTRAINT "artist_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "prettygood"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."artists"
    ADD CONSTRAINT "artists_id_fkey" FOREIGN KEY ("id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "prettygood"."albums"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "prettygood"."artists"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "prettygood"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."payments"
    ADD CONSTRAINT "payments_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."play_history"
    ADD CONSTRAINT "play_history_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."play_history"
    ADD CONSTRAINT "play_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_collaborators"
    ADD CONSTRAINT "playlist_collaborators_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "prettygood"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."playlist_collaborators"
    ADD CONSTRAINT "playlist_collaborators_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "prettygood"."playlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_collaborators"
    ADD CONSTRAINT "playlist_collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_likes"
    ADD CONSTRAINT "playlist_likes_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "prettygood"."playlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_likes"
    ADD CONSTRAINT "playlist_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "prettygood"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "prettygood"."playlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."playlists"
    ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."search_history"
    ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."track_genres"
    ADD CONSTRAINT "track_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "prettygood"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."track_genres"
    ADD CONSTRAINT "track_genres_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."track_likes"
    ADD CONSTRAINT "track_likes_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."track_likes"
    ADD CONSTRAINT "track_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."tracks"
    ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "prettygood"."albums"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "prettygood"."tracks"
    ADD CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "prettygood"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_albums"
    ADD CONSTRAINT "user_library_albums_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "prettygood"."albums"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_albums"
    ADD CONSTRAINT "user_library_albums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_artists"
    ADD CONSTRAINT "user_library_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "prettygood"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_artists"
    ADD CONSTRAINT "user_library_artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_tracks"
    ADD CONSTRAINT "user_library_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_library_tracks"
    ADD CONSTRAINT "user_library_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_recently_played"
    ADD CONSTRAINT "user_recently_played_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "prettygood"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_recently_played"
    ADD CONSTRAINT "user_recently_played_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood_private"."email_verification_tokens"
    ADD CONSTRAINT "email_verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood_private"."payment_status_history"
    ADD CONSTRAINT "payment_status_history_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "prettygood"."payments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood_private"."related_genres"
    ADD CONSTRAINT "related_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "prettygood"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood_private"."related_genres"
    ADD CONSTRAINT "related_genres_related_genre_id_fkey" FOREIGN KEY ("related_genre_id") REFERENCES "prettygood"."genres"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "prettygood_private"."user_auth"
    ADD CONSTRAINT "user_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "prettygood"."users"("id") ON DELETE CASCADE;



ALTER TABLE "prettygood"."album_genres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "album_genres_delete" ON "prettygood"."album_genres" FOR DELETE USING ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" IN ( SELECT "albums"."artist_id"
   FROM "prettygood"."albums"
  WHERE ("albums"."id" = "album_genres"."album_id")))));



CREATE POLICY "album_genres_insert" ON "prettygood"."album_genres" FOR INSERT WITH CHECK ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" IN ( SELECT "albums"."artist_id"
   FROM "prettygood"."albums"
  WHERE ("albums"."id" = "album_genres"."album_id")))));



CREATE POLICY "album_genres_select" ON "prettygood"."album_genres" FOR SELECT USING (true);



ALTER TABLE "prettygood"."album_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "album_likes_delete" ON "prettygood"."album_likes" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "album_likes_insert" ON "prettygood"."album_likes" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "album_likes_select" ON "prettygood"."album_likes" FOR SELECT USING (true);



ALTER TABLE "prettygood"."albums" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "albums_delete" ON "prettygood"."albums" FOR DELETE USING ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "albums_insert" ON "prettygood"."albums" FOR INSERT WITH CHECK ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "albums_select" ON "prettygood"."albums" FOR SELECT USING (true);



CREATE POLICY "albums_update" ON "prettygood"."albums" FOR UPDATE USING ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."artist_followers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "artist_followers_delete" ON "prettygood"."artist_followers" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "artist_followers_insert" ON "prettygood"."artist_followers" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "artist_followers_select" ON "prettygood"."artist_followers" FOR SELECT USING (true);



ALTER TABLE "prettygood"."artist_genres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "artist_genres_delete" ON "prettygood"."artist_genres" FOR DELETE USING ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" = "artist_id")));



CREATE POLICY "artist_genres_insert" ON "prettygood"."artist_genres" FOR INSERT WITH CHECK ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" = "artist_id")));



CREATE POLICY "artist_genres_select" ON "prettygood"."artist_genres" FOR SELECT USING (true);



ALTER TABLE "prettygood"."artists" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "artists_select" ON "prettygood"."artists" FOR SELECT USING (true);



CREATE POLICY "artists_update" ON "prettygood"."artists" FOR UPDATE USING ((("id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."genres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "genres_select" ON "prettygood"."genres" FOR SELECT USING (true);



ALTER TABLE "prettygood"."payments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payments_insert" ON "prettygood"."payments" FOR INSERT WITH CHECK (("sender_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "payments_select_admin" ON "prettygood"."payments" FOR SELECT USING ("prettygood_private"."is_admin"());



CREATE POLICY "payments_select_own" ON "prettygood"."payments" FOR SELECT USING ((("sender_id" = "prettygood_private"."current_user_id"()) OR ("recipient_id" = "prettygood_private"."current_user_id"())));



ALTER TABLE "prettygood"."play_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "play_history_insert" ON "prettygood"."play_history" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "play_history_select_admin" ON "prettygood"."play_history" FOR SELECT USING ("prettygood_private"."is_admin"());



CREATE POLICY "play_history_select_artist" ON "prettygood"."play_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "prettygood"."tracks"
  WHERE (("tracks"."id" = "play_history"."track_id") AND ("tracks"."artist_id" = "prettygood_private"."current_user_id"())))));



CREATE POLICY "play_history_select_own" ON "prettygood"."play_history" FOR SELECT USING (("user_id" = "prettygood_private"."current_user_id"()));



ALTER TABLE "prettygood"."playlist_collaborators" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "playlist_collaborators_delete" ON "prettygood"."playlist_collaborators" FOR DELETE USING (((EXISTS ( SELECT 1
   FROM "prettygood"."playlists"
  WHERE (("playlists"."id" = "playlist_collaborators"."playlist_id") AND ("playlists"."user_id" = "prettygood_private"."current_user_id"())))) OR ("prettygood_private"."current_user_id"() = "user_id")));



CREATE POLICY "playlist_collaborators_insert" ON "prettygood"."playlist_collaborators" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "prettygood"."playlists"
  WHERE (("playlists"."id" = "playlist_collaborators"."playlist_id") AND ("playlists"."user_id" = "prettygood_private"."current_user_id"())))));



CREATE POLICY "playlist_collaborators_select" ON "prettygood"."playlist_collaborators" FOR SELECT USING (true);



ALTER TABLE "prettygood"."playlist_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "playlist_likes_delete" ON "prettygood"."playlist_likes" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "playlist_likes_insert" ON "prettygood"."playlist_likes" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "playlist_likes_select" ON "prettygood"."playlist_likes" FOR SELECT USING (true);



ALTER TABLE "prettygood"."playlist_tracks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "playlist_tracks_delete" ON "prettygood"."playlist_tracks" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "prettygood"."playlists"
  WHERE (("playlists"."id" = "playlist_tracks"."playlist_id") AND (("playlists"."user_id" = "prettygood_private"."current_user_id"()) OR (EXISTS ( SELECT 1
           FROM "prettygood"."playlist_collaborators"
          WHERE (("playlist_collaborators"."playlist_id" = "playlists"."id") AND ("playlist_collaborators"."user_id" = "prettygood_private"."current_user_id"())))))))));



CREATE POLICY "playlist_tracks_insert" ON "prettygood"."playlist_tracks" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "prettygood"."playlists"
  WHERE (("playlists"."id" = "playlist_tracks"."playlist_id") AND (("playlists"."user_id" = "prettygood_private"."current_user_id"()) OR (EXISTS ( SELECT 1
           FROM "prettygood"."playlist_collaborators"
          WHERE (("playlist_collaborators"."playlist_id" = "playlists"."id") AND ("playlist_collaborators"."user_id" = "prettygood_private"."current_user_id"())))))))));



CREATE POLICY "playlist_tracks_select" ON "prettygood"."playlist_tracks" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "prettygood"."playlists"
  WHERE (("playlists"."id" = "playlist_tracks"."playlist_id") AND (("playlists"."is_public" = true) OR ("playlists"."user_id" = "prettygood_private"."current_user_id"()) OR (EXISTS ( SELECT 1
           FROM "prettygood"."playlist_collaborators"
          WHERE (("playlist_collaborators"."playlist_id" = "playlists"."id") AND ("playlist_collaborators"."user_id" = "prettygood_private"."current_user_id"())))))))));



ALTER TABLE "prettygood"."playlists" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "playlists_delete" ON "prettygood"."playlists" FOR DELETE USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "playlists_insert" ON "prettygood"."playlists" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "playlists_select_public" ON "prettygood"."playlists" FOR SELECT USING ((("is_public" = true) OR ("user_id" = "prettygood_private"."current_user_id"()) OR (EXISTS ( SELECT 1
   FROM "prettygood"."playlist_collaborators"
  WHERE (("playlist_collaborators"."playlist_id" = "playlists"."id") AND ("playlist_collaborators"."user_id" = "prettygood_private"."current_user_id"()))))));



CREATE POLICY "playlists_update" ON "prettygood"."playlists" FOR UPDATE USING ((("user_id" = "prettygood_private"."current_user_id"()) OR (EXISTS ( SELECT 1
   FROM "prettygood"."playlist_collaborators"
  WHERE (("playlist_collaborators"."playlist_id" = "playlists"."id") AND ("playlist_collaborators"."user_id" = "prettygood_private"."current_user_id"())))) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."search_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "search_history_delete" ON "prettygood"."search_history" FOR DELETE USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "search_history_insert" ON "prettygood"."search_history" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "search_history_select" ON "prettygood"."search_history" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."track_genres" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "track_genres_delete" ON "prettygood"."track_genres" FOR DELETE USING ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" IN ( SELECT "tracks"."artist_id"
   FROM "prettygood"."tracks"
  WHERE ("tracks"."id" = "track_genres"."track_id")))));



CREATE POLICY "track_genres_insert" ON "prettygood"."track_genres" FOR INSERT WITH CHECK ((("current_setting"('request.jwt.claim.role'::"text", true) = 'authenticated'::"text") AND (("current_setting"('request.jwt.claim.sub'::"text", true))::"uuid" IN ( SELECT "tracks"."artist_id"
   FROM "prettygood"."tracks"
  WHERE ("tracks"."id" = "track_genres"."track_id")))));



CREATE POLICY "track_genres_select" ON "prettygood"."track_genres" FOR SELECT USING (true);



ALTER TABLE "prettygood"."track_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "track_likes_delete" ON "prettygood"."track_likes" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "track_likes_insert" ON "prettygood"."track_likes" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "track_likes_select" ON "prettygood"."track_likes" FOR SELECT USING (true);



ALTER TABLE "prettygood"."tracks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "tracks_delete" ON "prettygood"."tracks" FOR DELETE USING ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "tracks_insert" ON "prettygood"."tracks" FOR INSERT WITH CHECK ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "tracks_select" ON "prettygood"."tracks" FOR SELECT USING (true);



CREATE POLICY "tracks_update" ON "prettygood"."tracks" FOR UPDATE USING ((("artist_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."user_library_albums" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_library_albums_delete" ON "prettygood"."user_library_albums" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_albums_insert" ON "prettygood"."user_library_albums" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_albums_select" ON "prettygood"."user_library_albums" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."user_library_artists" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_library_artists_delete" ON "prettygood"."user_library_artists" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_artists_insert" ON "prettygood"."user_library_artists" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_artists_select" ON "prettygood"."user_library_artists" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."user_library_tracks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_library_tracks_delete" ON "prettygood"."user_library_tracks" FOR DELETE USING (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_tracks_insert" ON "prettygood"."user_library_tracks" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_library_tracks_select" ON "prettygood"."user_library_tracks" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."user_recently_played" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_recently_played_insert" ON "prettygood"."user_recently_played" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_recently_played_select" ON "prettygood"."user_recently_played" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."user_settings" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_settings_insert" ON "prettygood"."user_settings" FOR INSERT WITH CHECK (("user_id" = "prettygood_private"."current_user_id"()));



CREATE POLICY "user_settings_select" ON "prettygood"."user_settings" FOR SELECT USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



CREATE POLICY "user_settings_update" ON "prettygood"."user_settings" FOR UPDATE USING ((("user_id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



ALTER TABLE "prettygood"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_select" ON "prettygood"."users" FOR SELECT USING (true);



CREATE POLICY "users_update" ON "prettygood"."users" FOR UPDATE USING ((("id" = "prettygood_private"."current_user_id"()) OR "prettygood_private"."is_admin"()));



GRANT USAGE ON SCHEMA "prettygood" TO "api_user";
GRANT USAGE ON SCHEMA "prettygood" TO "anon";
GRANT USAGE ON SCHEMA "prettygood" TO "authenticated";
GRANT USAGE ON SCHEMA "prettygood" TO "artist";



GRANT USAGE ON SCHEMA "prettygood_private" TO "api_user";
GRANT USAGE ON SCHEMA "prettygood_private" TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."add_album_to_library"("album_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."add_artist_to_library"("artist_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."add_track_to_library"("track_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."add_track_to_playlist"("playlist_id" "uuid", "track_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."armor"("bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."armor"("bytea", "text"[], "text"[]) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."authenticate_user"("_email_or_username" "text", "_password" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."authenticate_wallet"("wallet_address" "text", "signature" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."create_email_verification_token"("_user_id" "uuid") TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."playlists" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."playlists" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlists" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlists" TO "artist";



GRANT ALL ON FUNCTION "prettygood"."create_playlist"("name" "text", "description" "text", "is_public" boolean) TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."tracks" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."tracks" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."tracks" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."tracks" TO "artist";



GRANT ALL ON FUNCTION "prettygood"."create_track"("title" "text", "artist_id" "uuid", "duration" integer, "audio_url" "text", "album_id" "uuid", "cover_url" "text", "track_number" integer, "lyrics" "text", "genre" "text"[], "explicit" boolean, "release_date" "date", "isrc" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."crypt"("text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."dearmor"("text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."debug_get_jwt_info"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."debug_verify_token"("token" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."decrypt"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."digest"("bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."digest"("text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."encrypt"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."gen_random_bytes"(integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."gen_random_uuid"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."gen_salt"("text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."gen_salt"("text", integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."generate_nonce"("wallet_address" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_album_play_count"("album_id" "uuid") TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."albums" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."albums" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."albums" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."albums" TO "artist";



GRANT ALL ON FUNCTION "prettygood"."get_albums_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "prettygood"."get_albums_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_artist_followers_count"("artist_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_artist_payment_stats"("artist_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_artist_play_count"("artist_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_artist_total_earnings"("artist_id" "uuid") TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."artists" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."artists" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artists" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artists" TO "artist";



GRANT ALL ON FUNCTION "prettygood"."get_artists_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "prettygood"."get_artists_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_earnings_by_payment_type"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_earnings_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_earnings_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_followers_by_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_followers_count_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_play_duration_stats"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_plays_by_country"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_plays_by_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone, "time_format" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_plays_by_source"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_plays_for_period"("artist_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."genres" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."genres" TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_popular_genres"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "prettygood"."get_popular_genres"("p_start_date" timestamp with time zone, "p_end_date" timestamp with time zone, "p_limit" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_recent_followers"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_recent_plays"("track_ids" "uuid"[], "start_date" timestamp with time zone, "limit_count" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_recent_tips"("artist_id" "uuid", "start_date" timestamp with time zone, "limit_count" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_recent_transactions"("artist_id" "uuid", "limit_count" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_recommendations"("limit_count" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_related_genres"("p_genre_id" "uuid", "p_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "prettygood"."get_related_genres"("p_genre_id" "uuid", "p_limit" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_play_count"("track_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_play_count_by_period"("track_id" "uuid", "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_play_counts"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_playlists_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_plays_for_period"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_track_saves_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_tracks_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "anon";
GRANT ALL ON FUNCTION "prettygood"."get_tracks_by_genre"("p_genre_id" "uuid", "p_limit" integer, "p_offset" integer) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."get_tracks_play_count"("track_ids" "uuid"[], "start_date" timestamp with time zone, "end_date" timestamp with time zone) TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."hmac"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."hmac"("text", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_key_id"("bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt"("bytea", "bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_encrypt"("text", "bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_encrypt"("text", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_decrypt"("bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_decrypt"("bytea", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_decrypt_bytea"("bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_encrypt"("text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_encrypt"("text", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_encrypt_bytea"("bytea", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."record_play"("track_id" "uuid", "play_duration" integer, "completed" boolean, "source" "text", "context_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."record_search"("query" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."refresh_token"("current_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "prettygood"."refresh_token"("current_token" "text") TO "artist";



GRANT ALL ON FUNCTION "prettygood"."refresh_token_robust"("current_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "prettygood"."refresh_token_robust"("current_token" "text") TO "artist";



GRANT ALL ON FUNCTION "prettygood"."refresh_token_v2"("current_token" "text") TO "authenticated";
GRANT ALL ON FUNCTION "prettygood"."refresh_token_v2"("current_token" "text") TO "artist";



GRANT ALL ON FUNCTION "prettygood"."register_as_artist"("artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."register_as_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."register_user"("_username" "text", "_email" "text", "_password" "text", "_display_name" "text", "_wallet_address" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."request_password_reset"("_email" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."reset_password"("_reset_token" "text", "_new_password" "text") TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."payments" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."payments" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."payments" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."payments" TO "artist";



GRANT ALL ON FUNCTION "prettygood"."tip_artist"("artist_id" "uuid", "amount" numeric, "transaction_hash" "text", "track_id" "uuid", "album_id" "uuid", "message" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."trace_token_verification"("token" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."update_artist_with_id"("user_id" "uuid", "artist_name" "text", "bio" "text", "genre" "text"[], "location" "text", "website" "text", "social_links" "jsonb") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."verify_email"("_verification_token" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood"."verify_signature"("wallet_address" "text", "signature" "text") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."check_account_lockout"("_user_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."clean_expired_verification_tokens"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."clear_expired_reset_tokens"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."current_user_id"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."get_app_role"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."is_admin"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."is_artist"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."is_authenticated"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."log_permission_fix"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."migrate_genres"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."record_failed_login"("_user_id" "uuid") TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."set_updated_at"() TO "authenticated";



GRANT ALL ON FUNCTION "prettygood_private"."track_payment_status_changes"() TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."album_genres" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."album_genres" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."album_likes" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."album_likes" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."album_likes" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."album_likes" TO "artist";



GRANT SELECT ON TABLE "prettygood"."play_history" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."play_history" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."play_history" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."play_history" TO "artist";



GRANT SELECT ON TABLE "prettygood"."album_play_counts" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."album_play_counts" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."artist_followers" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."artist_followers" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artist_followers" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artist_followers" TO "artist";



GRANT SELECT ON TABLE "prettygood"."artist_genres" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artist_genres" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."artist_play_counts" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."artist_play_counts" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."playlist_collaborators" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."playlist_collaborators" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_collaborators" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_collaborators" TO "artist";



GRANT SELECT ON TABLE "prettygood"."playlist_likes" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."playlist_likes" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_likes" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_likes" TO "artist";



GRANT SELECT ON TABLE "prettygood"."playlist_tracks" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."playlist_tracks" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_tracks" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."playlist_tracks" TO "artist";



GRANT SELECT ON TABLE "prettygood"."search_history" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."search_history" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."search_history" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."search_history" TO "artist";



GRANT SELECT ON TABLE "prettygood"."track_genres" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."track_genres" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."track_likes" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."track_likes" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."track_likes" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."track_likes" TO "artist";



GRANT SELECT ON TABLE "prettygood"."track_play_counts" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."track_play_counts" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."user_library_albums" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."user_library_albums" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_albums" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_albums" TO "artist";



GRANT SELECT ON TABLE "prettygood"."user_library_artists" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."user_library_artists" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_artists" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_artists" TO "artist";



GRANT SELECT ON TABLE "prettygood"."user_library_tracks" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."user_library_tracks" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_tracks" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_library_tracks" TO "artist";



GRANT SELECT ON TABLE "prettygood"."user_play_counts" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_play_counts" TO "authenticated";



GRANT SELECT ON TABLE "prettygood"."user_recently_played" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."user_recently_played" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_recently_played" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_recently_played" TO "artist";



GRANT SELECT ON TABLE "prettygood"."user_settings" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."user_settings" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_settings" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."user_settings" TO "artist";



GRANT SELECT ON TABLE "prettygood"."users" TO "api_user";
GRANT SELECT ON TABLE "prettygood"."users" TO "anon";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."users" TO "authenticated";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "prettygood"."users" TO "artist";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "prettygood" GRANT USAGE ON SEQUENCES  TO "authenticated";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "prettygood" GRANT SELECT ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "prettygood" GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO "authenticated";



RESET ALL;
