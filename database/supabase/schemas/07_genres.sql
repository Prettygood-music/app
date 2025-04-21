-- Genres schema for the Pretty Good Music application
CREATE TABLE prettygood.genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  color TEXT,
  slug TEXT UNIQUE,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE prettygood.genres IS 'Music genres in the prettygood.music platform';
COMMENT ON COLUMN prettygood.genres.color IS 'Hex code or CSS color for UI display';
COMMENT ON COLUMN prettygood.genres.slug IS 'URL-friendly version of the genre name';
COMMENT ON COLUMN prettygood.genres.popularity IS 'Calculated popularity score based on track count';

-- Enable RLS
ALTER TABLE prettygood.genres ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Genres are viewable by everyone" ON prettygood.genres
  FOR SELECT USING (TRUE);

-- Only admins can create, update, or delete genres
CREATE POLICY "Admins can manage genres" ON prettygood.genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prettygood.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER set_genres_updated_at
BEFORE UPDATE ON prettygood.genres
FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

-- Create indexes
CREATE INDEX idx_genres_name ON prettygood.genres(name);
CREATE INDEX idx_genres_slug ON prettygood.genres(slug);
CREATE INDEX idx_genres_popularity ON prettygood.genres(popularity);

-- Create artist_genres junction table
CREATE TABLE prettygood.artist_genres (
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (artist_id, genre_id)
);

COMMENT ON TABLE prettygood.artist_genres IS 'Junction table connecting artists to genres';

-- Enable RLS
ALTER TABLE prettygood.artist_genres ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artist genres are viewable by everyone" ON prettygood.artist_genres
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can manage their own genres" ON prettygood.artist_genres
  FOR ALL USING (artist_id = auth.uid());

-- Create indexes
CREATE INDEX idx_artist_genres_genre_id ON prettygood.artist_genres(genre_id);

-- Create album_genres junction table
CREATE TABLE prettygood.album_genres (
  album_id UUID NOT NULL REFERENCES prettygood.albums(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
);

COMMENT ON TABLE prettygood.album_genres IS 'Junction table connecting albums to genres';

-- Enable RLS
ALTER TABLE prettygood.album_genres ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Album genres are viewable by everyone" ON prettygood.album_genres
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can manage their album genres" ON prettygood.album_genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prettygood.albums
      WHERE id = album_id AND artist_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_album_genres_genre_id ON prettygood.album_genres(genre_id);

-- Create track_genres junction table
CREATE TABLE prettygood.track_genres (
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (track_id, genre_id)
);

COMMENT ON TABLE prettygood.track_genres IS 'Junction table connecting tracks to genres';

-- Enable RLS
ALTER TABLE prettygood.track_genres ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Track genres are viewable by everyone" ON prettygood.track_genres
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can manage their track genres" ON prettygood.track_genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prettygood.tracks
      WHERE id = track_id AND artist_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_track_genres_genre_id ON prettygood.track_genres(genre_id);

-- Create related_genres table in main schema with RLS
CREATE TABLE prettygood.related_genres (
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  related_genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  weight INTEGER DEFAULT 1,
  PRIMARY KEY (genre_id, related_genre_id)
);

COMMENT ON TABLE prettygood.related_genres IS 'Manages relationships between genres';

-- Enable RLS
ALTER TABLE prettygood.related_genres ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage related genres" ON prettygood.related_genres
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM prettygood.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view related genres" ON prettygood.related_genres
  FOR SELECT USING (TRUE);

-- Function to get tracks by genre
CREATE OR REPLACE FUNCTION prettygood.get_tracks_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.tracks AS $$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM prettygood.tracks t
  JOIN prettygood.track_genres tg ON tg.track_id = t.id
  WHERE tg.genre_id = p_genre_id
  ORDER BY t.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get albums by genre
CREATE OR REPLACE FUNCTION prettygood.get_albums_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.albums AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.albums a
  JOIN prettygood.album_genres ag ON ag.album_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get artists by genre
CREATE OR REPLACE FUNCTION prettygood.get_artists_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.artists AS $$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.artists a
  JOIN prettygood.artist_genres ag ON ag.artist_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.artist_name
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get related genres
CREATE OR REPLACE FUNCTION prettygood.get_related_genres(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS SETOF prettygood.genres AS $$
BEGIN
  RETURN QUERY
  WITH track_counts AS (
    -- Count tracks that share genres with the input genre
    SELECT g.id, g.name, COUNT(*) as common_tracks
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg1 ON tg1.genre_id = g.id
    JOIN prettygood.track_genres tg2 ON tg2.track_id = tg1.track_id
    WHERE tg2.genre_id = p_genre_id
    AND g.id != p_genre_id
    GROUP BY g.id, g.name
    ORDER BY common_tracks DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN track_counts tc ON tc.id = g.id
  ORDER BY tc.common_tracks DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular genres
CREATE OR REPLACE FUNCTION prettygood.get_popular_genres(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF prettygood.genres AS $$
BEGIN
  RETURN QUERY
  WITH popular_genres AS (
    -- Count plays for tracks in each genre during the specified period
    SELECT g.id, g.name, COUNT(*) as play_count
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg ON tg.genre_id = g.id
    JOIN prettygood.play_history ph ON ph.track_id = tg.track_id
    WHERE ph.played_at BETWEEN p_start_date AND p_end_date
    GROUP BY g.id, g.name
    ORDER BY play_count DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN popular_genres pg ON pg.id = g.id
  ORDER BY pg.play_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate genre popularity (can be run periodically as a cron job)
CREATE OR REPLACE FUNCTION prettygood.update_genre_popularity()
RETURNS VOID AS $$
BEGIN
  -- Update popularity based on track count and play count
  UPDATE prettygood.genres g
  SET popularity = (
    SELECT COUNT(DISTINCT t.id) * 10 + COALESCE(SUM(pc.play_count), 0) / 10
    FROM prettygood.track_genres tg
    JOIN prettygood.tracks t ON t.id = tg.track_id
    LEFT JOIN prettygood.track_play_counts pc ON pc.track_id = t.id
    WHERE tg.genre_id = g.id
    GROUP BY tg.genre_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
