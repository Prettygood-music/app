-- Migration: 006_create_playlists.sql
-- Description: Creates playlist-related tables for the prettygood.music application

-- Playlists table
CREATE TABLE IF NOT EXISTS prettygood.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  cover_image TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  collaborative BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Playlist tracks junction table
CREATE TABLE IF NOT EXISTS prettygood.playlist_tracks (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  position INTEGER NOT NULL, -- Position in the playlist (for ordering)
  PRIMARY KEY (playlist_id, track_id)
);

-- Playlist collaborators
CREATE TABLE IF NOT EXISTS prettygood.playlist_collaborators (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  PRIMARY KEY (playlist_id, user_id)
);

-- Playlist likes
CREATE TABLE IF NOT EXISTS prettygood.playlist_likes (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (playlist_id, user_id)
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_playlist_updated_at
BEFORE UPDATE ON prettygood.playlists
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON prettygood.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_name ON prettygood.playlists(name);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON prettygood.playlist_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_position ON prettygood.playlist_tracks(position);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_added_by ON prettygood.playlist_tracks(added_by);
CREATE INDEX IF NOT EXISTS idx_playlist_collaborators_user_id ON prettygood.playlist_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_likes_user_id ON prettygood.playlist_likes(user_id);

-- Comments for documentation
COMMENT ON TABLE prettygood.playlists IS 'User-created playlists on the prettygood.music platform';
COMMENT ON TABLE prettygood.playlist_tracks IS 'Junction table linking tracks to playlists';
COMMENT ON TABLE prettygood.playlist_collaborators IS 'Users who can collaborate on a playlist';
COMMENT ON TABLE prettygood.playlist_likes IS 'Tracks which users have liked which playlists';
COMMENT ON COLUMN prettygood.playlists.collaborative IS 'Whether the playlist can be edited by collaborators';
COMMENT ON COLUMN prettygood.playlist_tracks.position IS 'Position of the track in the playlist';
