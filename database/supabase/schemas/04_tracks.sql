-- Tracks schema for the Pretty Good Music application
CREATE TABLE prettygood.tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES prettygood.albums(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  track_number INTEGER,
  lyrics TEXT,
  genre TEXT[] DEFAULT '{}',
  explicit BOOLEAN DEFAULT FALSE,
  release_date DATE,
  isrc TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE prettygood.tracks IS 'Music tracks on the prettygood.music platform';
COMMENT ON COLUMN prettygood.tracks.duration IS 'Duration of the track in seconds';
COMMENT ON COLUMN prettygood.tracks.cover_url IS 'URL to the track cover image';
COMMENT ON COLUMN prettygood.tracks.isrc IS 'International Standard Recording Code';

-- Enable RLS
ALTER TABLE prettygood.tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tracks are viewable by everyone" ON prettygood.tracks
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can create their own tracks" ON prettygood.tracks
  FOR INSERT WITH CHECK (
    auth.uid() = artist_id AND
    EXISTS (SELECT 1 FROM prettygood.artists WHERE id = auth.uid() AND approved = TRUE)
  );

CREATE POLICY "Artists can update their own tracks" ON prettygood.tracks
  FOR UPDATE USING (auth.uid() = artist_id);

CREATE POLICY "Artists can delete their own tracks" ON prettygood.tracks
  FOR DELETE USING (auth.uid() = artist_id);

-- Create trigger for updated_at
CREATE TRIGGER set_track_updated_at
BEFORE UPDATE ON prettygood.tracks
FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

-- Create indexes
CREATE INDEX idx_tracks_artist_id ON prettygood.tracks(artist_id);
CREATE INDEX idx_tracks_album_id ON prettygood.tracks(album_id);
CREATE INDEX idx_tracks_title ON prettygood.tracks(title);
CREATE INDEX idx_tracks_cover_url ON prettygood.tracks(cover_url);
CREATE INDEX idx_tracks_genre ON prettygood.tracks USING GIN(genre);

-- Create track_likes table
CREATE TABLE prettygood.track_likes (
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (track_id, user_id)
);

COMMENT ON TABLE prettygood.track_likes IS 'Tracks which users have liked which tracks';

-- Enable RLS
ALTER TABLE prettygood.track_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Track likes are viewable by everyone" ON prettygood.track_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can like tracks" ON prettygood.track_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike tracks" ON prettygood.track_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_track_likes_user_id ON prettygood.track_likes(user_id);

-- Create user_library_tracks table
CREATE TABLE prettygood.user_library_tracks (
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, track_id)
);

COMMENT ON TABLE prettygood.user_library_tracks IS 'Tracks saved to a user''s library';

-- Enable RLS
ALTER TABLE prettygood.user_library_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own track library" ON prettygood.user_library_tracks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add tracks to their library" ON prettygood.user_library_tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove tracks from their library" ON prettygood.user_library_tracks
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_library_tracks_track_id ON prettygood.user_library_tracks(track_id);

-- Play history table
CREATE TABLE prettygood.play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES prettygood.users(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  play_duration INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  source TEXT,
  context_id UUID,
  client_ip TEXT,
  user_agent TEXT
);

COMMENT ON TABLE prettygood.play_history IS 'Records each time a user plays a track';
COMMENT ON COLUMN prettygood.play_history.track_id IS 'Reference to the track that was played';
COMMENT ON COLUMN prettygood.play_history.user_id IS 'Reference to the user who played the track';
COMMENT ON COLUMN prettygood.play_history.played_at IS 'When the track was played';
COMMENT ON COLUMN prettygood.play_history.play_duration IS 'How long the track was played in seconds';
COMMENT ON COLUMN prettygood.play_history.completed IS 'Whether the track was played to completion';
COMMENT ON COLUMN prettygood.play_history.source IS 'Where the play came from (search, playlist, album, etc.)';

-- Enable RLS
ALTER TABLE prettygood.play_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artists can view play history for their tracks" ON prettygood.play_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prettygood.tracks
      WHERE tracks.id = play_history.track_id
      AND tracks.artist_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own play history" ON prettygood.play_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can record plays" ON prettygood.play_history
  FOR INSERT WITH CHECK (TRUE);  -- Allow anonymous plays

-- Create indexes
CREATE INDEX idx_play_history_track_id ON prettygood.play_history(track_id);
CREATE INDEX idx_play_history_user_id ON prettygood.play_history(user_id);
CREATE INDEX idx_play_history_played_at ON prettygood.play_history(played_at);

-- Recently played tracks
CREATE TABLE prettygood.user_recently_played (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  context_type TEXT,
  context_id UUID
);

COMMENT ON TABLE prettygood.user_recently_played IS 'Recently played tracks for each user';
COMMENT ON COLUMN prettygood.user_recently_played.context_type IS 'Source context of the play (album, playlist, etc.)';
COMMENT ON COLUMN prettygood.user_recently_played.context_id IS 'ID of the context object (album, playlist, etc.)';

-- Enable RLS
ALTER TABLE prettygood.user_recently_played ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their recently played tracks" ON prettygood.user_recently_played
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to recently played" ON prettygood.user_recently_played
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_recently_played_user_id ON prettygood.user_recently_played(user_id);
CREATE INDEX idx_user_recently_played_track_id ON prettygood.user_recently_played(track_id);
CREATE INDEX idx_user_recently_played_played_at ON prettygood.user_recently_played(played_at);
CREATE INDEX idx_user_recently_played_context_id ON prettygood.user_recently_played(context_id);

-- Function to add track to library
CREATE OR REPLACE FUNCTION prettygood.add_track_to_library(track_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record play
CREATE OR REPLACE FUNCTION prettygood.record_play(
  track_id UUID,
  play_duration INTEGER DEFAULT NULL,
  completed BOOLEAN DEFAULT FALSE,
  source TEXT DEFAULT NULL,
  context_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID := auth.uid();
  anon_user_id UUID := '00000000-0000-0000-0000-000000000000'::UUID;
BEGIN
  -- Verify track exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.tracks WHERE id = track_id) THEN
    RAISE EXCEPTION 'Track not found';
  END IF;

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
    COALESCE(current_user_id, anon_user_id),
    play_duration,
    completed,
    source,
    context_id,
    NULLIF(current_setting('request.headers', TRUE)::json->>'x-forwarded-for', ''),
    NULLIF(current_setting('request.headers', TRUE)::json->>'user-agent', '')
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create track creation function
CREATE OR REPLACE FUNCTION prettygood.create_track(
  title TEXT,
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
  artist_id UUID := auth.uid();
  new_track prettygood.tracks;
BEGIN
  -- Verify authentication
  IF artist_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify user is an approved artist
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id AND approved = TRUE) THEN
    RAISE EXCEPTION 'User must be an approved artist to create tracks';
  END IF;
  
  -- Verify album exists if provided and belongs to artist
  IF album_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM prettygood.albums 
    WHERE id = album_id AND artist_id = create_track.artist_id
  ) THEN
    RAISE EXCEPTION 'Album not found or does not belong to artist';
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

-- Create efficient play count views
CREATE VIEW prettygood.track_play_counts AS
SELECT 
  track_id,
  COUNT(*) as play_count,
  COUNT(DISTINCT user_id) as unique_listeners,
  MAX(played_at) as last_played_at
FROM 
  prettygood.play_history
GROUP BY 
  track_id;

COMMENT ON VIEW prettygood.track_play_counts IS 'View of play counts for each track with additional statistics';

CREATE VIEW prettygood.artist_play_counts AS
SELECT 
  tracks.artist_id,
  COUNT(*) as play_count,
  COUNT(DISTINCT play_history.user_id) as unique_listeners,
  COUNT(DISTINCT play_history.track_id) as tracks_played,
  MAX(play_history.played_at) as last_played_at
FROM 
  prettygood.play_history
JOIN 
  prettygood.tracks ON play_history.track_id = tracks.id
GROUP BY 
  tracks.artist_id;

COMMENT ON VIEW prettygood.artist_play_counts IS 'View of play counts for each artist with additional statistics';

CREATE VIEW prettygood.album_play_counts AS
SELECT 
  tracks.album_id,
  COUNT(*) as play_count,
  COUNT(DISTINCT play_history.user_id) as unique_listeners,
  COUNT(DISTINCT play_history.track_id) as tracks_played,
  MAX(play_history.played_at) as last_played_at
FROM 
  prettygood.play_history
JOIN 
  prettygood.tracks ON play_history.track_id = tracks.id
WHERE 
  tracks.album_id IS NOT NULL
GROUP BY 
  tracks.album_id;

COMMENT ON VIEW prettygood.album_play_counts IS 'View of play counts for each album with additional statistics';

-- Create comprehensive tracks with details view
CREATE VIEW prettygood.tracks_with_details AS
SELECT 
  t.*,
  a.artist_name,
  a.verified AS artist_verified,
  al.title AS album_title,
  al.release_date AS album_release_date,
  COALESCE(pc.play_count, 0) AS play_count,
  COALESCE(pc.unique_listeners, 0) AS unique_listeners
FROM 
  prettygood.tracks t
JOIN 
  prettygood.artists a ON t.artist_id = a.id
LEFT JOIN 
  prettygood.albums al ON t.album_id = al.id
LEFT JOIN 
  prettygood.track_play_counts pc ON t.id = pc.track_id;

COMMENT ON VIEW prettygood.tracks_with_details IS 'Comprehensive view of tracks with artist, album, and play statistics';
