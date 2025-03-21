-- Migration: 004_create_albums.sql
-- Description: Creates album-related tables for the prettygood.music application

-- Albums table
CREATE TABLE IF NOT EXISTS prettygood.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  release_date DATE,
  cover_image TEXT,
  description TEXT,
  genre TEXT[],
  type TEXT CHECK (type IN ('album', 'ep', 'single', 'compilation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Album likes
CREATE TABLE IF NOT EXISTS prettygood.album_likes (
  album_id UUID NOT NULL REFERENCES prettygood.albums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (album_id, user_id)
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_album_updated_at
BEFORE UPDATE ON prettygood.albums
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON prettygood.albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_albums_title ON prettygood.albums(title);
CREATE INDEX IF NOT EXISTS idx_albums_release_date ON prettygood.albums(release_date);
CREATE INDEX IF NOT EXISTS idx_albums_genre ON prettygood.albums USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_album_likes_user_id ON prettygood.album_likes(user_id);

-- Comments for documentation
COMMENT ON TABLE prettygood.albums IS 'Music albums on the prettygood.music platform';
COMMENT ON TABLE prettygood.album_likes IS 'Tracks which users have liked which albums';
COMMENT ON COLUMN prettygood.albums.type IS 'Type of album release (album, ep, single, compilation)';
COMMENT ON COLUMN prettygood.albums.genre IS 'Array of genres associated with the album';
