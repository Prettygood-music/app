-- Migration: 017_add_play_count_views.sql
-- Description: Creates views for easier access to play count statistics

-- Create a view that gives track play counts
CREATE OR REPLACE VIEW prettygood.track_play_counts AS
SELECT 
    track_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
GROUP BY 
    track_id;

-- Create a view that gives artist play counts
CREATE OR REPLACE VIEW prettygood.artist_play_counts AS
SELECT 
    tracks.artist_id,
    COUNT(*) as play_count
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
    COUNT(*) as play_count
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
    COUNT(*) as play_count
FROM 
    prettygood.play_history
GROUP BY 
    user_id;

-- Comments for documentation
COMMENT ON VIEW prettygood.track_play_counts IS 'View of play counts for each track';
COMMENT ON VIEW prettygood.artist_play_counts IS 'View of play counts for each artist';
COMMENT ON VIEW prettygood.album_play_counts IS 'View of play counts for each album';
COMMENT ON VIEW prettygood.user_play_counts IS 'View of play counts for each user';
