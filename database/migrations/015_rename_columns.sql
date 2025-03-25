-- Migration: 015_rename_columns.sql
-- Description: Renames columns to match the new model

-- Rename cover_image to cover_url in existing tables if it exists
DO $$
BEGIN
    -- Check and rename for albums
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'prettygood' AND table_name = 'albums' 
              AND column_name = 'cover_image') THEN
        ALTER TABLE prettygood.albums RENAME COLUMN cover_image TO cover_url;
    END IF;
    
    -- Check and rename for tracks
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'prettygood' AND table_name = 'tracks' 
              AND column_name = 'cover_image') THEN
        ALTER TABLE prettygood.tracks RENAME COLUMN cover_image TO cover_url;
    END IF;
    
    -- Check and rename for playlists
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'prettygood' AND table_name = 'playlists' 
              AND column_name = 'cover_image') THEN
        ALTER TABLE prettygood.playlists RENAME COLUMN cover_image TO cover_url;
    END IF;
    
    -- Check and rename profile_image to profile_url in users table
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'prettygood' AND table_name = 'users' 
              AND column_name = 'profile_image') THEN
        ALTER TABLE prettygood.users RENAME COLUMN profile_image TO profile_url;
    END IF;
END $$;

-- Add index on the cover_url and profile_url columns
CREATE INDEX IF NOT EXISTS idx_albums_cover_url ON prettygood.albums(cover_url);
CREATE INDEX IF NOT EXISTS idx_tracks_cover_url ON prettygood.tracks(cover_url);
CREATE INDEX IF NOT EXISTS idx_playlists_cover_url ON prettygood.playlists(cover_url);
CREATE INDEX IF NOT EXISTS idx_users_profile_url ON prettygood.users(profile_url);

-- Check if collaborative column exists before dropping it
DO $$
BEGIN
    IF EXISTS(SELECT 1 FROM information_schema.columns 
              WHERE table_schema = 'prettygood' AND table_name = 'playlists' 
              AND column_name = 'collaborative') THEN
        ALTER TABLE prettygood.playlists DROP COLUMN collaborative;
    END IF;
END $$;

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
