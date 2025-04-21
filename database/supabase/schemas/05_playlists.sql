-- Playlists schema for the Pretty Good Music application
CREATE TABLE prettygood.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE prettygood.playlists IS 'User-created playlists on the prettygood.music platform';
COMMENT ON COLUMN prettygood.playlists.cover_url IS 'URL to the playlist cover image';

-- Enable RLS
ALTER TABLE prettygood.playlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public playlists are viewable by everyone" ON prettygood.playlists
  FOR SELECT USING (
    is_public = TRUE OR
    auth.uid() = user_id
  );

CREATE POLICY "Users can create their own playlists" ON prettygood.playlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists" ON prettygood.playlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists" ON prettygood.playlists
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER set_playlist_updated_at
BEFORE UPDATE ON prettygood.playlists
FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

-- Create indexes
CREATE INDEX idx_playlists_user_id ON prettygood.playlists(user_id);
CREATE INDEX idx_playlists_name ON prettygood.playlists(name);
CREATE INDEX idx_playlists_cover_url ON prettygood.playlists(cover_url);

-- Create playlist_tracks junction table
CREATE TABLE prettygood.playlist_tracks (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  position INTEGER NOT NULL,
  PRIMARY KEY (playlist_id, track_id)
);

COMMENT ON TABLE prettygood.playlist_tracks IS 'Junction table linking tracks to playlists';
COMMENT ON COLUMN prettygood.playlist_tracks.position IS 'Position of the track in the playlist';

-- Enable RLS
ALTER TABLE prettygood.playlist_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view tracks in playlists they can access" ON prettygood.playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND (
        playlists.is_public = TRUE OR
        playlists.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can add tracks to their own playlists" ON prettygood.playlist_tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.user_id = auth.uid()
    ) AND
    added_by = auth.uid()
  );

CREATE POLICY "Users can delete tracks from their own playlists" ON prettygood.playlist_tracks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
      AND playlists.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_playlist_tracks_track_id ON prettygood.playlist_tracks(track_id);
CREATE INDEX idx_playlist_tracks_added_by ON prettygood.playlist_tracks(added_by);
CREATE INDEX idx_playlist_tracks_position ON prettygood.playlist_tracks(position);

-- Create playlist_likes table
CREATE TABLE prettygood.playlist_likes (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (playlist_id, user_id)
);

COMMENT ON TABLE prettygood.playlist_likes IS 'Tracks which users have liked which playlists';

-- Enable RLS
ALTER TABLE prettygood.playlist_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Playlist likes are viewable by everyone" ON prettygood.playlist_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can like playlists" ON prettygood.playlist_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike playlists" ON prettygood.playlist_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_playlist_likes_user_id ON prettygood.playlist_likes(user_id);

-- Function to create a playlist
CREATE OR REPLACE FUNCTION prettygood.create_playlist(
  name TEXT,
  description TEXT DEFAULT NULL,
  is_public BOOLEAN DEFAULT TRUE
)
RETURNS prettygood.playlists AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_playlist prettygood.playlists;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Create playlist
  INSERT INTO prettygood.playlists (
    name,
    description,
    user_id,
    is_public
  )
  VALUES (
    name,
    description,
    current_user_id,
    is_public
  )
  RETURNING * INTO new_playlist;
  
  RETURN new_playlist;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a track to a playlist
CREATE OR REPLACE FUNCTION prettygood.add_track_to_playlist(
  playlist_id UUID,
  track_id UUID
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
  max_position INTEGER;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if playlist exists and user has permission
  IF NOT EXISTS (
    SELECT 1 FROM prettygood.playlists
    WHERE id = playlist_id
    AND user_id = current_user_id
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
