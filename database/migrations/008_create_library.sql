-- Migration: 008_create_library.sql
-- Description: Creates user library tables for the prettygood.music application

-- User's library for tracks
CREATE TABLE IF NOT EXISTS prettygood.user_library_tracks (
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

-- User's library for albums
CREATE TABLE IF NOT EXISTS prettygood.user_library_albums (
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES prettygood.albums(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, album_id)
);

-- User's library for artists
CREATE TABLE IF NOT EXISTS prettygood.user_library_artists (
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- User's recently played tracks
CREATE TABLE IF NOT EXISTS prettygood.user_recently_played (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  context_type TEXT, -- e.g., 'album', 'playlist', 'artist', 'search'
  context_id UUID  -- ID of the album, playlist, or artist if applicable
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_library_tracks_track_id ON prettygood.user_library_tracks(track_id);
CREATE INDEX IF NOT EXISTS idx_user_library_albums_album_id ON prettygood.user_library_albums(album_id);
CREATE INDEX IF NOT EXISTS idx_user_library_artists_artist_id ON prettygood.user_library_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_user_recently_played_user_id ON prettygood.user_recently_played(user_id);
CREATE INDEX IF NOT EXISTS idx_user_recently_played_track_id ON prettygood.user_recently_played(track_id);
CREATE INDEX IF NOT EXISTS idx_user_recently_played_played_at ON prettygood.user_recently_played(played_at);
CREATE INDEX IF NOT EXISTS idx_user_recently_played_context_id ON prettygood.user_recently_played(context_id);

-- Comments for documentation
COMMENT ON TABLE prettygood.user_library_tracks IS 'Tracks saved to a user''s library';
COMMENT ON TABLE prettygood.user_library_albums IS 'Albums saved to a user''s library';
COMMENT ON TABLE prettygood.user_library_artists IS 'Artists saved to a user''s library';
COMMENT ON TABLE prettygood.user_recently_played IS 'Recently played tracks for each user';
COMMENT ON COLUMN prettygood.user_recently_played.context_type IS 'Source context of the play (album, playlist, etc.)';
COMMENT ON COLUMN prettygood.user_recently_played.context_id IS 'ID of the context object (album, playlist, etc.)';
