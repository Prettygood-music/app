-- Migration: 006_optimize_track_functions.sql
-- Description: Optimizes track-related functions by replacing RPCs with views where appropriate
-- This consolidates and improves functionality from:
-- - 041_create_track_rpc.sql
-- - parts of 011_create_api_functions.sql related to tracks

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- Create view for tracks with artist information
CREATE OR REPLACE VIEW prettygood.tracks_with_artist AS
SELECT 
    t.*,
    a.artist_name,
    a.verified AS artist_verified,
    al.title AS album_title,
    al.release_date AS album_release_date
FROM 
    prettygood.tracks t
JOIN 
    prettygood.artists a ON t.artist_id = a.id
LEFT JOIN 
    prettygood.albums al ON t.album_id = al.id;

-- Create view for user's recently played tracks with detailed info
CREATE OR REPLACE VIEW prettygood.user_recent_tracks AS
SELECT 
    urp.user_id,
    urp.played_at,
    t.id AS track_id,
    t.title AS track_title,
    t.duration,
    t.cover_url,
    t.audio_url,
    a.id AS artist_id,
    a.artist_name,
    al.id AS album_id,
    al.title AS album_title
FROM 
    prettygood.user_recently_played urp
JOIN 
    prettygood.tracks t ON urp.track_id = t.id
JOIN 
    prettygood.artists a ON t.artist_id = a.id
LEFT JOIN 
    prettygood.albums al ON t.album_id = al.id
ORDER BY 
    urp.played_at DESC;

-- Create view for top tracks by play count
CREATE OR REPLACE VIEW prettygood.top_tracks AS
SELECT 
    t.*,
    a.artist_name,
    COALESCE(pc.play_count, 0) AS play_count
FROM 
    prettygood.tracks t
JOIN 
    prettygood.artists a ON t.artist_id = a.id
LEFT JOIN 
    prettygood.track_play_counts pc ON t.id = pc.track_id
ORDER BY 
    COALESCE(pc.play_count, 0) DESC;

-- Create view for artist's tracks with play counts
CREATE OR REPLACE VIEW prettygood.artist_tracks_with_stats AS
SELECT 
    t.*,
    COALESCE(pc.play_count, 0) AS play_count,
    COALESCE(pc.unique_listeners, 0) AS unique_listeners,
    pc.last_played_at
FROM 
    prettygood.tracks t
LEFT JOIN 
    prettygood.track_play_counts pc ON t.id = pc.track_id
ORDER BY 
    t.artist_id, 
    COALESCE(pc.play_count, 0) DESC;

-- Keep the RPC function for track creation as it requires elevated privileges
CREATE OR REPLACE FUNCTION prettygood.create_track(
    title TEXT,
    artist_id UUID,
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
    new_track prettygood.tracks;
    current_user_id UUID := prettygood_private.current_user_id();
BEGIN
    -- Verify authentication
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Verify artist exists
    IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
        RAISE EXCEPTION 'Artist not found';
    END IF;
    
    -- Check if user is authorized (is the artist or an admin)
    IF artist_id != current_user_id AND NOT prettygood_private.is_admin() THEN
        RAISE EXCEPTION 'Not authorized to create tracks for this artist';
    END IF;
    
    -- Verify album exists if provided
    IF album_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM prettygood.albums WHERE id = album_id) THEN
        RAISE EXCEPTION 'Album not found';
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

-- Optimize the record_play function to handle both authenticated and anonymous users
CREATE OR REPLACE FUNCTION prettygood.record_play(
    track_id UUID,
    play_duration INTEGER DEFAULT NULL,
    completed BOOLEAN DEFAULT FALSE,
    source TEXT DEFAULT NULL,
    context_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    current_user_id UUID := prettygood_private.current_user_id();
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
        current_setting('request.headers', TRUE)::json->>'x-forwarded-for',
        current_setting('request.headers', TRUE)::json->>'user-agent'
    );
    
    -- If authenticated, also add to recently played
    IF current_user_id IS NOT NULL THEN
        -- Add to recently played
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

-- Add library operations as efficient views and functions

-- View for user library statistics
CREATE OR REPLACE VIEW prettygood.user_library_stats AS
SELECT
    user_id,
    (SELECT COUNT(*) FROM prettygood.user_library_tracks WHERE user_id = u.id) AS track_count,
    (SELECT COUNT(*) FROM prettygood.user_library_albums WHERE user_id = u.id) AS album_count,
    (SELECT COUNT(*) FROM prettygood.user_library_artists WHERE user_id = u.id) AS artist_count,
    u.created_at AS account_created_at
FROM
    prettygood.users u;

-- Library functions remain as RPC functions since they need to modify data
CREATE OR REPLACE FUNCTION prettygood.add_to_library(
    item_type TEXT,
    item_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID := prettygood_private.current_user_id();
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    CASE item_type
        WHEN 'track' THEN
            -- Verify track exists
            IF NOT EXISTS (SELECT 1 FROM prettygood.tracks WHERE id = item_id) THEN
                RAISE EXCEPTION 'Track not found';
            END IF;
            
            -- Add track to library
            INSERT INTO prettygood.user_library_tracks (
                user_id,
                track_id
            )
            VALUES (
                current_user_id,
                item_id
            )
            ON CONFLICT (user_id, track_id) DO NOTHING;
            
        WHEN 'album' THEN
            -- Verify album exists
            IF NOT EXISTS (SELECT 1 FROM prettygood.albums WHERE id = item_id) THEN
                RAISE EXCEPTION 'Album not found';
            END IF;
            
            -- Add album to library
            INSERT INTO prettygood.user_library_albums (
                user_id,
                album_id
            )
            VALUES (
                current_user_id,
                item_id
            )
            ON CONFLICT (user_id, album_id) DO NOTHING;
            
            -- Also add all tracks from the album to library
            INSERT INTO prettygood.user_library_tracks (
                user_id,
                track_id
            )
            SELECT 
                current_user_id,
                id
            FROM 
                prettygood.tracks
            WHERE 
                album_id = item_id
            ON CONFLICT (user_id, track_id) DO NOTHING;
            
        WHEN 'artist' THEN
            -- Verify artist exists
            IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = item_id) THEN
                RAISE EXCEPTION 'Artist not found';
            END IF;
            
            -- Add artist to library
            INSERT INTO prettygood.user_library_artists (
                user_id,
                artist_id
            )
            VALUES (
                current_user_id,
                item_id
            )
            ON CONFLICT (user_id, artist_id) DO NOTHING;
            
        ELSE
            RAISE EXCEPTION 'Invalid item type. Must be track, album, or artist';
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remove from library function
CREATE OR REPLACE FUNCTION prettygood.remove_from_library(
    item_type TEXT,
    item_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_id UUID := prettygood_private.current_user_id();
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    CASE item_type
        WHEN 'track' THEN
            DELETE FROM prettygood.user_library_tracks
            WHERE user_id = current_user_id AND track_id = item_id;
            
        WHEN 'album' THEN
            DELETE FROM prettygood.user_library_albums
            WHERE user_id = current_user_id AND album_id = item_id;
            
        WHEN 'artist' THEN
            DELETE FROM prettygood.user_library_artists
            WHERE user_id = current_user_id AND artist_id = item_id;
            
        ELSE
            RAISE EXCEPTION 'Invalid item type. Must be track, album, or artist';
    END CASE;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION prettygood.create_track TO authenticated, artist;
GRANT EXECUTE ON FUNCTION prettygood.record_play TO anon, authenticated, artist;
GRANT EXECUTE ON FUNCTION prettygood.add_to_library TO authenticated, artist;
GRANT EXECUTE ON FUNCTION prettygood.remove_from_library TO authenticated, artist;

-- Add comments for documentation
COMMENT ON VIEW prettygood.tracks_with_artist IS 'Tracks with detailed artist information';
COMMENT ON VIEW prettygood.user_recent_tracks IS 'Recently played tracks for users with detailed information';
COMMENT ON VIEW prettygood.top_tracks IS 'Tracks ranked by play count';
COMMENT ON VIEW prettygood.artist_tracks_with_stats IS 'Artist tracks with play statistics';
COMMENT ON VIEW prettygood.user_library_stats IS 'User library statistics';

COMMENT ON FUNCTION prettygood.create_track IS 'Creates a new track with proper permission checks';
COMMENT ON FUNCTION prettygood.record_play IS 'Records a track play event for analytics';
COMMENT ON FUNCTION prettygood.add_to_library IS 'Adds a track, album, or artist to user library';
COMMENT ON FUNCTION prettygood.remove_from_library IS 'Removes a track, album, or artist from user library';
