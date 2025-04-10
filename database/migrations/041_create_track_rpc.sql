-- Migration: 041_create_track_rpc.sql
-- Description: Creates RPC function for track creation with proper parameters

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- Function to create a track with properly defined defaults
CREATE OR REPLACE FUNCTION prettygood.create_track(
  title TEXT,
  artist_id UUID,
  duration INTEGER,
  audio_url TEXT,
  album_id UUID DEFAULT NULL,
  cover_url TEXT DEFAULT NULL,
  track_number INTEGER DEFAULT NULL,
  lyrics TEXT DEFAULT NULL,
  genre TEXT[] DEFAULT '{}',
  explicit BOOLEAN DEFAULT FALSE,
  release_date DATE DEFAULT NULL,
  isrc TEXT DEFAULT NULL
)
RETURNS prettygood.tracks AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the track creation function
GRANT EXECUTE ON FUNCTION prettygood.create_track(
  TEXT, UUID, INTEGER, TEXT, 
  UUID, TEXT, INTEGER, TEXT, TEXT[], 
  BOOLEAN, DATE, TEXT
) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION prettygood.create_track IS 'Creates a new track using elevated privileges, properly handling required and optional parameters';
