-- Migration: 015_rename_columns.sql
-- Description: Renames columns to match the new model

-- Rename cover_image to cover_url in existing tables
ALTER TABLE prettygood.albums RENAME COLUMN cover_image TO cover_url;
ALTER TABLE prettygood.tracks RENAME COLUMN cover_image TO cover_url;
ALTER TABLE prettygood.playlists RENAME COLUMN cover_image TO cover_url;

-- Rename profile_image to profile_url in users table
ALTER TABLE prettygood.users RENAME COLUMN profile_image TO profile_url;

-- Add index on the new column names
CREATE INDEX IF NOT EXISTS idx_albums_cover_url ON prettygood.albums(cover_url);
CREATE INDEX IF NOT EXISTS idx_tracks_cover_url ON prettygood.tracks(cover_url);
CREATE INDEX IF NOT EXISTS idx_playlists_cover_url ON prettygood.playlists(cover_url);
CREATE INDEX IF NOT EXISTS idx_users_profile_url ON prettygood.users(profile_url);

-- Drop collaborative column from playlists table
ALTER TABLE prettygood.playlists DROP COLUMN collaborative;

-- Make genre non-nullable in tracks table with default empty array
ALTER TABLE prettygood.tracks 
  ALTER COLUMN genre SET NOT NULL,
  ALTER COLUMN genre SET DEFAULT '{}';

-- Make wallet_address nullable in users table
ALTER TABLE prettygood.users 
  ALTER COLUMN wallet_address DROP NOT NULL;

-- Comments for documentation
COMMENT ON COLUMN prettygood.albums.cover_url IS 'URL to the album cover image';
COMMENT ON COLUMN prettygood.tracks.cover_url IS 'URL to the track cover image';
COMMENT ON COLUMN prettygood.playlists.cover_url IS 'URL to the playlist cover image';
COMMENT ON COLUMN prettygood.users.profile_url IS 'URL to the user profile image';
