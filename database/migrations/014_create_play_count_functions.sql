-- Migration: 014_create_play_count_functions.sql
-- Description: Creates functions to calculate play counts from play history

-- Function to get track play count
CREATE OR REPLACE FUNCTION prettygood.get_track_play_count(track_id UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    WHERE track_id = $1
$$ LANGUAGE SQL STABLE;

-- Function to get track play count within a time period
CREATE OR REPLACE FUNCTION prettygood.get_track_play_count_by_period(
    track_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS INTEGER AS $$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    WHERE track_id = $1
    AND played_at >= start_date
    AND played_at <= end_date
$$ LANGUAGE SQL STABLE;

-- Function to get artist play count
CREATE OR REPLACE FUNCTION prettygood.get_artist_play_count(artist_id UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    JOIN prettygood.tracks ON play_history.track_id = tracks.id
    WHERE tracks.artist_id = $1
$$ LANGUAGE SQL STABLE;

-- Function to get album play count
CREATE OR REPLACE FUNCTION prettygood.get_album_play_count(album_id UUID)
RETURNS INTEGER AS $$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    JOIN prettygood.tracks ON play_history.track_id = tracks.id
    WHERE tracks.album_id = $1
$$ LANGUAGE SQL STABLE;

-- Comments for documentation
COMMENT ON FUNCTION prettygood.get_track_play_count IS 'Get the total play count for a specific track';
COMMENT ON FUNCTION prettygood.get_track_play_count_by_period IS 'Get the play count for a specific track within a time period';
COMMENT ON FUNCTION prettygood.get_artist_play_count IS 'Get the total play count for all tracks by an artist';
COMMENT ON FUNCTION prettygood.get_album_play_count IS 'Get the total play count for all tracks in an album';
