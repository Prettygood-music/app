-- Migration: 003_create_artists.sql
-- Description: Creates artist profile tables for the prettygood.music application

-- Artists table (extends users)
CREATE TABLE IF NOT EXISTS prettygood.artists (
  id UUID PRIMARY KEY REFERENCES prettygood.users(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  bio TEXT,
  genre TEXT[],
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artist followers
CREATE TABLE IF NOT EXISTS prettygood.artist_followers (
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (artist_id, user_id)
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_artist_updated_at
BEFORE UPDATE ON prettygood.artists
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_artists_name ON prettygood.artists(artist_name);
CREATE INDEX IF NOT EXISTS idx_artists_genre ON prettygood.artists USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_artist_followers_user_id ON prettygood.artist_followers(user_id);

-- Comments for documentation
COMMENT ON TABLE prettygood.artists IS 'Artist profiles for the prettygood.music platform';
COMMENT ON TABLE prettygood.artist_followers IS 'Tracks which users follow which artists';
COMMENT ON COLUMN prettygood.artists.genre IS 'Array of genres associated with the artist';
COMMENT ON COLUMN prettygood.artists.social_links IS 'JSON containing social media links';
