-- Migration: 002_consolidate_play_count.sql
-- Description: Consolidates play count tracking, replacing functions with views where appropriate
-- This migration replaces and optimizes functionality from:
-- - 014_create_play_count_functions.sql
-- - 017_add_play_count_views.sql

-- Create optimized views for play count statistics
CREATE OR REPLACE VIEW prettygood.track_play_counts AS
SELECT 
    track_id,
    COUNT(*) as play_count,
    COUNT(DISTINCT user_id) as unique_listeners,
    MAX(played_at) as last_played_at
FROM 
    prettygood.play_history
GROUP BY 
    track_id;

-- Create a view that gives artist play counts
CREATE OR REPLACE VIEW prettygood.artist_play_counts AS
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

-- Create a view that gives album play counts
CREATE OR REPLACE VIEW prettygood.album_play_counts AS
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

-- Create a view that gives user play counts (what they've listened to)
CREATE OR REPLACE VIEW prettygood.user_play_counts AS
SELECT 
    user_id,
    COUNT(*) as play_count,
    COUNT(DISTINCT track_id) as unique_tracks_played,
    MAX(played_at) as last_played_at
FROM 
    prettygood.play_history
WHERE
    user_id IS NOT NULL
GROUP BY 
    user_id;

-- Create a view for play counts by time period (daily)
CREATE OR REPLACE VIEW prettygood.daily_play_counts AS
SELECT 
    DATE_TRUNC('day', played_at) as play_date,
    track_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
GROUP BY 
    DATE_TRUNC('day', played_at), track_id
ORDER BY 
    play_date DESC, play_count DESC;

-- Create a view for play counts by time period (monthly)
CREATE OR REPLACE VIEW prettygood.monthly_play_counts AS
SELECT 
    DATE_TRUNC('month', played_at) as play_month,
    track_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
GROUP BY 
    DATE_TRUNC('month', played_at), track_id
ORDER BY 
    play_month DESC, play_count DESC;

-- Keep a few useful functions for specific time-based queries that aren't easily 
-- handled by the views alone

-- Function to get track play count within a specific time period
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

-- Function to get artist play count within a specific time period
CREATE OR REPLACE FUNCTION prettygood.get_artist_play_count_by_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS INTEGER AS $$
    SELECT COUNT(*) 
    FROM prettygood.play_history
    JOIN prettygood.tracks ON play_history.track_id = tracks.id
    WHERE tracks.artist_id = $1
    AND played_at >= start_date
    AND played_at <= end_date
$$ LANGUAGE SQL STABLE;

-- Add comments for documentation
COMMENT ON VIEW prettygood.track_play_counts IS 'View of play counts for each track with unique listeners and last played time';
COMMENT ON VIEW prettygood.artist_play_counts IS 'View of play counts for each artist with listener and track statistics';
COMMENT ON VIEW prettygood.album_play_counts IS 'View of play counts for each album with listener and track statistics';
COMMENT ON VIEW prettygood.user_play_counts IS 'View of play counts for each user with statistics on music variety';
COMMENT ON VIEW prettygood.daily_play_counts IS 'View of daily play counts for tracks';
COMMENT ON VIEW prettygood.monthly_play_counts IS 'View of monthly play counts for tracks';

COMMENT ON FUNCTION prettygood.get_track_play_count_by_period IS 'Get the play count for a specific track within a custom time period';
COMMENT ON FUNCTION prettygood.get_artist_play_count_by_period IS 'Get the play count for a specific artist within a custom time period';

-- Drop redundant functions since the views now provide the same data more efficiently
DROP FUNCTION IF EXISTS prettygood.get_track_play_count(UUID);
DROP FUNCTION IF EXISTS prettygood.get_artist_play_count(UUID);
DROP FUNCTION IF EXISTS prettygood.get_album_play_count(UUID);
