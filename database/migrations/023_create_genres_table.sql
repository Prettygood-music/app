-- Migration: 023_create_genres_table.sql
-- Description: Creates a dedicated genres table and establishes many-to-many relationships

-- Create the genres table
CREATE TABLE IF NOT EXISTS prettygood.genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  color TEXT,
  slug TEXT UNIQUE,
  popularity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create junction tables for many-to-many relationships
-- Tracks to Genres
CREATE TABLE IF NOT EXISTS prettygood.track_genres (
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (track_id, genre_id)
);

-- Artists to Genres
CREATE TABLE IF NOT EXISTS prettygood.artist_genres (
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (artist_id, genre_id)
);

-- Albums to Genres
CREATE TABLE IF NOT EXISTS prettygood.album_genres (
  album_id UUID NOT NULL REFERENCES prettygood.albums(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES prettygood.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_genres_updated_at
BEFORE UPDATE ON prettygood.genres
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_genres_name ON prettygood.genres(name);
CREATE INDEX IF NOT EXISTS idx_genres_slug ON prettygood.genres(slug);
CREATE INDEX IF NOT EXISTS idx_genres_popularity ON prettygood.genres(popularity);
CREATE INDEX IF NOT EXISTS idx_track_genres_genre_id ON prettygood.track_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_artist_genres_genre_id ON prettygood.artist_genres(genre_id);
CREATE INDEX IF NOT EXISTS idx_album_genres_genre_id ON prettygood.album_genres(genre_id);

-- Create migration function to populate genres from existing data
CREATE OR REPLACE FUNCTION prettygood_private.migrate_genres()
RETURNS void AS $$
DECLARE
  genre_name TEXT;
  genre_id UUID;
  track_id UUID;
  artist_id UUID;
  album_id UUID;
BEGIN
  -- Collect unique genres from all tracks, artists, and albums
  FOR genre_name IN 
    SELECT DISTINCT unnest(genre) as name FROM prettygood.tracks
    UNION
    SELECT DISTINCT unnest(genre) as name FROM prettygood.artists
    UNION
    SELECT DISTINCT unnest(genre) as name FROM prettygood.albums
    WHERE genre_name IS NOT NULL AND genre_name != ''
  LOOP
    -- Insert the genre if it doesn't already exist
    INSERT INTO prettygood.genres (name, slug)
    VALUES (
      genre_name, 
      lower(regexp_replace(genre_name, '[^a-zA-Z0-9]', '-', 'g'))
    )
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO genre_id;
    
    -- If insertion didn't return an ID, get it
    IF genre_id IS NULL THEN
      SELECT id INTO genre_id FROM prettygood.genres WHERE name = genre_name;
    END IF;
    
    -- Migrate track genres
    FOR track_id IN 
      SELECT id FROM prettygood.tracks
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.track_genres (track_id, genre_id)
      VALUES (track_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Migrate artist genres
    FOR artist_id IN 
      SELECT id FROM prettygood.artists
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.artist_genres (artist_id, genre_id)
      VALUES (artist_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
    
    -- Migrate album genres
    FOR album_id IN 
      SELECT id FROM prettygood.albums
      WHERE genre_name = ANY(genre)
    LOOP
      INSERT INTO prettygood.album_genres (album_id, genre_id)
      VALUES (album_id, genre_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT prettygood_private.migrate_genres();

-- Calculate initial popularity based on track count
UPDATE prettygood.genres g
SET popularity = (
  SELECT COUNT(*) 
  FROM prettygood.track_genres 
  WHERE genre_id = g.id
);

-- Comments for documentation
COMMENT ON TABLE prettygood.genres IS 'Music genres in the prettygood.music platform';
COMMENT ON TABLE prettygood.track_genres IS 'Junction table connecting tracks to genres';
COMMENT ON TABLE prettygood.artist_genres IS 'Junction table connecting artists to genres';
COMMENT ON TABLE prettygood.album_genres IS 'Junction table connecting albums to genres';
COMMENT ON COLUMN prettygood.genres.slug IS 'URL-friendly version of the genre name';
COMMENT ON COLUMN prettygood.genres.color IS 'Hex code or CSS color for UI display';
COMMENT ON COLUMN prettygood.genres.popularity IS 'Calculated popularity score based on track count';

-- Create database functions for genre-related queries

-- Get related genres based on common tracks
CREATE OR REPLACE FUNCTION prettygood.get_related_genres(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS SETOF prettygood.genres
AS $$
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

-- Get popular genres for a specific time period
CREATE OR REPLACE FUNCTION prettygood.get_popular_genres(
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_limit INTEGER DEFAULT 10
)
RETURNS SETOF prettygood.genres
AS $$
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

-- Get tracks for a specific genre
CREATE OR REPLACE FUNCTION prettygood.get_tracks_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.tracks
AS $$
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

-- Get artists for a specific genre
CREATE OR REPLACE FUNCTION prettygood.get_artists_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.artists
AS $$
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

-- Get albums for a specific genre
CREATE OR REPLACE FUNCTION prettygood.get_albums_by_genre(
  p_genre_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS SETOF prettygood.albums
AS $$
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

-- Allow access to the new genres functions
GRANT EXECUTE ON FUNCTION prettygood.get_related_genres TO anon, authenticated;
GRANT EXECUTE ON FUNCTION prettygood.get_popular_genres TO anon, authenticated;
GRANT EXECUTE ON FUNCTION prettygood.get_tracks_by_genre TO anon, authenticated;
GRANT EXECUTE ON FUNCTION prettygood.get_artists_by_genre TO anon, authenticated;
GRANT EXECUTE ON FUNCTION prettygood.get_albums_by_genre TO anon, authenticated;

-- Add RLS policies for the new tables
-- Genres are readable by anyone, but only admins can create/update
ALTER TABLE prettygood.genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY genres_select ON prettygood.genres FOR SELECT USING (true);
CREATE POLICY genres_insert ON prettygood.genres FOR INSERT 
  WITH CHECK (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
             current_setting('request.jwt.claim.sub', true)::uuid IN 
             (SELECT id FROM prettygood.users WHERE is_admin = true));
CREATE POLICY genres_update ON prettygood.genres FOR UPDATE
  USING (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
         current_setting('request.jwt.claim.sub', true)::uuid IN 
         (SELECT id FROM prettygood.users WHERE is_admin = true));

-- Track genres junction table
ALTER TABLE prettygood.track_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY track_genres_select ON prettygood.track_genres FOR SELECT USING (true);
CREATE POLICY track_genres_insert ON prettygood.track_genres FOR INSERT 
  WITH CHECK (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
             current_setting('request.jwt.claim.sub', true)::uuid IN (
    SELECT artist_id FROM prettygood.tracks WHERE id = track_id
  ));
CREATE POLICY track_genres_delete ON prettygood.track_genres FOR DELETE
  USING (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
         current_setting('request.jwt.claim.sub', true)::uuid IN (
    SELECT artist_id FROM prettygood.tracks WHERE id = track_id
  ));

-- Artist genres junction table
ALTER TABLE prettygood.artist_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY artist_genres_select ON prettygood.artist_genres FOR SELECT USING (true);
CREATE POLICY artist_genres_insert ON prettygood.artist_genres FOR INSERT 
  WITH CHECK (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
             current_setting('request.jwt.claim.sub', true)::uuid = artist_id);
CREATE POLICY artist_genres_delete ON prettygood.artist_genres FOR DELETE
  USING (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
         current_setting('request.jwt.claim.sub', true)::uuid = artist_id);

-- Album genres junction table
ALTER TABLE prettygood.album_genres ENABLE ROW LEVEL SECURITY;
CREATE POLICY album_genres_select ON prettygood.album_genres FOR SELECT USING (true);
CREATE POLICY album_genres_insert ON prettygood.album_genres FOR INSERT 
  WITH CHECK (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
             current_setting('request.jwt.claim.sub', true)::uuid IN (
    SELECT artist_id FROM prettygood.albums WHERE id = album_id
  ));
CREATE POLICY album_genres_delete ON prettygood.album_genres FOR DELETE
  USING (current_setting('request.jwt.claim.role', true)::text = 'authenticated' AND 
         current_setting('request.jwt.claim.sub', true)::uuid IN (
    SELECT artist_id FROM prettygood.albums WHERE id = album_id
  ));

-- Grant permissions on the new tables
GRANT SELECT ON TABLE prettygood.genres TO anon, authenticated;
GRANT SELECT ON TABLE prettygood.track_genres TO anon, authenticated;
GRANT SELECT ON TABLE prettygood.artist_genres TO anon, authenticated;
GRANT SELECT ON TABLE prettygood.album_genres TO anon, authenticated;

GRANT INSERT, UPDATE ON TABLE prettygood.genres TO authenticated;
GRANT INSERT, DELETE ON TABLE prettygood.track_genres TO authenticated;
GRANT INSERT, DELETE ON TABLE prettygood.artist_genres TO authenticated;
GRANT INSERT, DELETE ON TABLE prettygood.album_genres TO authenticated;

-- Grant permissions on related views
GRANT SELECT ON prettygood.track_play_counts TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA prettygood TO anon, authenticated;
