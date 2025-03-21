-- Migration: 005_create_tracks.sql
-- Description: Creates track-related tables for the prettygood.music application

-- Tracks table
CREATE TABLE IF NOT EXISTS prettygood.tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES prettygood.albums(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- Duration in seconds
  audio_url TEXT NOT NULL,
  cover_image TEXT,
  track_number INTEGER,
  lyrics TEXT,
  genre TEXT[],
  explicit BOOLEAN DEFAULT FALSE,
  release_date DATE,
  isrc TEXT, -- International Standard Recording Code
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Track likes
CREATE TABLE IF NOT EXISTS prettygood.track_likes (
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (track_id, user_id)
);

-- Track play history
CREATE TABLE IF NOT EXISTS prettygood.play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  play_duration INTEGER, -- Duration of play in seconds
  completed BOOLEAN DEFAULT FALSE, -- Whether the track was played to completion
  source TEXT, -- Where the play originated (playlist, album, search, etc.)
  client_ip TEXT,
  user_agent TEXT
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_track_updated_at
BEFORE UPDATE ON prettygood.tracks
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON prettygood.tracks(artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON prettygood.tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_title ON prettygood.tracks(title);
CREATE INDEX IF NOT EXISTS idx_tracks_genre ON prettygood.tracks USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_track_likes_user_id ON prettygood.track_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_user_id ON prettygood.play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_track_id ON prettygood.play_history(track_id);
CREATE INDEX IF NOT EXISTS idx_play_history_played_at ON prettygood.play_history(played_at);

-- Comments for documentation
COMMENT ON TABLE prettygood.tracks IS 'Music tracks on the prettygood.music platform';
COMMENT ON TABLE prettygood.track_likes IS 'Tracks which users have liked which tracks';
COMMENT ON TABLE prettygood.play_history IS 'History of track plays by users';
COMMENT ON COLUMN prettygood.tracks.duration IS 'Duration of the track in seconds';
COMMENT ON COLUMN prettygood.tracks.isrc IS 'International Standard Recording Code';
COMMENT ON COLUMN prettygood.play_history.play_duration IS 'Duration of the play session in seconds';
COMMENT ON COLUMN prettygood.play_history.source IS 'Source of the play (playlist, album, search, etc.)';
