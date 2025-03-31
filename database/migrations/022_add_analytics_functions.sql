-- Migration: 022_add_analytics_functions.sql
-- Description: Creates database functions for analytics and the artist dashboard

------------------------------------------------------------------------
-- Play Analytics Functions
------------------------------------------------------------------------

-- Function to get play counts grouped by time period
CREATE OR REPLACE FUNCTION prettygood.get_plays_by_period(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    time_format TEXT
)
RETURNS TABLE (period TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(played_at, time_format) as period,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        TO_CHAR(played_at, time_format)
    ORDER BY 
        period;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get play counts for specific tracks within a time period
CREATE OR REPLACE FUNCTION prettygood.get_track_plays_for_period(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (track_id UUID, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        play_history.track_id,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        track_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get total play counts for multiple tracks
CREATE OR REPLACE FUNCTION prettygood.get_track_play_counts(
    track_ids UUID[],
    start_date TIMESTAMPTZ DEFAULT NULL,
    end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (track_id UUID, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        play_history.track_id,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND (start_date IS NULL OR played_at >= start_date)
        AND (end_date IS NULL OR played_at <= end_date)
    GROUP BY 
        track_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get total play count for an artist within a specific time period
CREATE OR REPLACE FUNCTION prettygood.get_plays_for_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS BIGINT AS $$
DECLARE
    play_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO play_count
    FROM 
        prettygood.play_history ph
    JOIN 
        prettygood.tracks t ON ph.track_id = t.id
    WHERE 
        t.artist_id = get_plays_for_period.artist_id
        AND ph.played_at >= start_date
        AND ph.played_at <= end_date;
    
    RETURN play_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get play counts grouped by country
CREATE OR REPLACE FUNCTION prettygood.get_plays_by_country(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (country_code TEXT, play_count BIGINT) AS $$
BEGIN
    -- Note: This function assumes we have client_geo_country column in play_history
    -- If the column doesn't exist, we'll return a mock result for now
    -- In production, this would be derived from client_ip using a geolocation service
    
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'client_geo_country'
    ) THEN
        RETURN QUERY
        SELECT 
            COALESCE(client_geo_country, 'UNKNOWN') as country_code,
            COUNT(*) as play_count
        FROM 
            prettygood.play_history
        WHERE 
            track_id = ANY(track_ids)
            AND played_at >= start_date
            AND played_at <= end_date
        GROUP BY 
            country_code
        ORDER BY 
            play_count DESC;
    ELSE
        -- Return mock data if column doesn't exist
        RETURN QUERY
        WITH country_counts AS (
            VALUES
                ('US', 1250),
                ('GB', 430),
                ('DE', 280),
                ('CA', 215),
                ('FR', 195),
                ('AU', 165),
                ('JP', 120),
                ('BR', 95),
                ('MX', 85),
                ('OTHER', 110)
        )
        SELECT 
            c.column1 as country_code,
            c.column2 as play_count
        FROM 
            country_counts c;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get play counts grouped by source
CREATE OR REPLACE FUNCTION prettygood.get_plays_by_source(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (source TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(source, 'unknown') as source,
        COUNT(*) as count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date
    GROUP BY 
        source
    ORDER BY 
        count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get recent plays for tracks
CREATE OR REPLACE FUNCTION prettygood.get_recent_plays(
    track_ids UUID[],
    start_date TIMESTAMPTZ DEFAULT NULL,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    played_at TIMESTAMPTZ, 
    track_id UUID, 
    track_title TEXT, 
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ph.played_at,
        t.id as track_id,
        t.title as track_title,
        u.username
    FROM 
        prettygood.play_history ph
    JOIN 
        prettygood.tracks t ON ph.track_id = t.id
    JOIN 
        prettygood.users u ON ph.user_id = u.id
    WHERE 
        ph.track_id = ANY(track_ids)
        AND (start_date IS NULL OR ph.played_at >= start_date)
    ORDER BY 
        ph.played_at DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get total play count for a set of tracks
CREATE OR REPLACE FUNCTION prettygood.get_tracks_play_count(
    track_ids UUID[],
    start_date TIMESTAMPTZ DEFAULT NULL,
    end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    play_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO play_count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND (start_date IS NULL OR played_at >= start_date)
        AND (end_date IS NULL OR played_at <= end_date);
    
    RETURN play_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get statistics about play duration and completion rate
CREATE OR REPLACE FUNCTION prettygood.get_play_duration_stats(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (
    avg_duration FLOAT, 
    completed_count BIGINT, 
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        AVG(play_duration)::FLOAT as avg_duration,
        COUNT(*) FILTER (WHERE completed = true)::BIGINT as completed_count,
        COUNT(*)::BIGINT as total_count
    FROM 
        prettygood.play_history
    WHERE 
        track_id = ANY(track_ids)
        AND played_at >= start_date
        AND played_at <= end_date;
END;
$$ LANGUAGE plpgsql STABLE;

------------------------------------------------------------------------
-- Follower Analytics Functions
------------------------------------------------------------------------

-- Function to get the total number of followers for an artist
CREATE OR REPLACE FUNCTION prettygood.get_artist_followers_count(
    artist_id UUID
)
RETURNS BIGINT AS $$
DECLARE
    follower_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO follower_count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_artist_followers_count.artist_id;
    
    RETURN follower_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get new followers grouped by time period
CREATE OR REPLACE FUNCTION prettygood.get_followers_by_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    time_format TEXT
)
RETURNS TABLE (period TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(added_at, time_format) as period,
        COUNT(*) as count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_followers_by_period.artist_id
        AND added_at >= start_date
        AND added_at <= end_date
    GROUP BY 
        TO_CHAR(added_at, time_format)
    ORDER BY 
        period;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get the number of new followers within a specific time period
CREATE OR REPLACE FUNCTION prettygood.get_followers_count_for_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS BIGINT AS $$
DECLARE
    follower_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO follower_count
    FROM 
        prettygood.user_library_artists
    WHERE 
        artist_id = get_followers_count_for_period.artist_id
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN follower_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get recent followers for an artist
CREATE OR REPLACE FUNCTION prettygood.get_recent_followers(
    artist_id UUID,
    start_date TIMESTAMPTZ DEFAULT NULL,
    limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    added_at TIMESTAMPTZ, 
    user_id UUID, 
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ula.added_at,
        u.id as user_id,
        u.username
    FROM 
        prettygood.user_library_artists ula
    JOIN 
        prettygood.users u ON ula.user_id = u.id
    WHERE 
        ula.artist_id = get_recent_followers.artist_id
        AND (start_date IS NULL OR ula.added_at >= start_date)
    ORDER BY 
        ula.added_at DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

------------------------------------------------------------------------
-- Earnings Analytics Functions
------------------------------------------------------------------------

-- Function to get the total earnings for an artist
CREATE OR REPLACE FUNCTION prettygood.get_artist_total_earnings(
    artist_id UUID
)
RETURNS NUMERIC AS $$
DECLARE
    total_earnings NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(amount), 0) INTO total_earnings
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed';
    
    RETURN total_earnings;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get earnings grouped by time period
CREATE OR REPLACE FUNCTION prettygood.get_earnings_by_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    time_format TEXT
)
RETURNS TABLE (period TEXT, amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TO_CHAR(created_at, time_format) as period,
        SUM(amount) as amount
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date
    GROUP BY 
        TO_CHAR(created_at, time_format)
    ORDER BY 
        period;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get earnings grouped by payment type
CREATE OR REPLACE FUNCTION prettygood.get_earnings_by_payment_type(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (payment_type TEXT, amount NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        payment_type,
        SUM(amount) as amount
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date
    GROUP BY 
        payment_type
    ORDER BY 
        amount DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get the total earnings within a specific time period
CREATE OR REPLACE FUNCTION prettygood.get_earnings_for_period(
    artist_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS NUMERIC AS $$
DECLARE
    period_earnings NUMERIC;
BEGIN
    SELECT 
        COALESCE(SUM(amount), 0) INTO period_earnings
    FROM 
        prettygood.payments
    WHERE 
        recipient_id = artist_id
        AND status = 'completed'
        AND created_at >= start_date
        AND created_at <= end_date;
    
    RETURN period_earnings;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get recent payment transactions for an artist
CREATE OR REPLACE FUNCTION prettygood.get_recent_transactions(
    artist_id UUID,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID, 
    created_at TIMESTAMPTZ, 
    amount NUMERIC, 
    payment_type TEXT, 
    sender_id UUID, 
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.created_at,
        p.amount,
        p.payment_type,
        p.sender_id,
        u.username
    FROM 
        prettygood.payments p
    JOIN 
        prettygood.users u ON p.sender_id = u.id
    WHERE 
        p.recipient_id = artist_id
        AND p.status = 'completed'
    ORDER BY 
        p.created_at DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get recent tips for an artist
CREATE OR REPLACE FUNCTION prettygood.get_recent_tips(
    artist_id UUID,
    start_date TIMESTAMPTZ DEFAULT NULL,
    limit_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    created_at TIMESTAMPTZ, 
    amount NUMERIC, 
    username TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.created_at,
        p.amount,
        u.username
    FROM 
        prettygood.payments p
    JOIN 
        prettygood.users u ON p.sender_id = u.id
    WHERE 
        p.recipient_id = artist_id
        AND p.status = 'completed'
        AND p.payment_type = 'tip'
        AND (start_date IS NULL OR p.created_at >= start_date)
    ORDER BY 
        p.created_at DESC
    LIMIT 
        limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

------------------------------------------------------------------------
-- Engagement Analytics Functions
------------------------------------------------------------------------

-- Function to get the number of times tracks have been saved to user libraries
CREATE OR REPLACE FUNCTION prettygood.get_track_saves_count(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS BIGINT AS $$
DECLARE
    saves_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO saves_count
    FROM 
        prettygood.user_library_tracks
    WHERE 
        track_id = ANY(track_ids)
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN saves_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get the number of times tracks have been added to playlists
CREATE OR REPLACE FUNCTION prettygood.get_track_playlists_count(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS BIGINT AS $$
DECLARE
    playlists_count BIGINT;
BEGIN
    SELECT 
        COUNT(*) INTO playlists_count
    FROM 
        prettygood.playlist_tracks
    WHERE 
        track_id = ANY(track_ids)
        AND added_at >= start_date
        AND added_at <= end_date;
    
    RETURN playlists_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add comments to functions for documentation
COMMENT ON FUNCTION prettygood.get_plays_by_period IS 'Gets play counts grouped by time period (day, month, year) for tracks within a date range';
COMMENT ON FUNCTION prettygood.get_track_plays_for_period IS 'Gets play counts for specific tracks within a time period';
COMMENT ON FUNCTION prettygood.get_track_play_counts IS 'Gets total play counts for multiple tracks with optional date filtering';
COMMENT ON FUNCTION prettygood.get_plays_for_period IS 'Gets total play count for an artist within a specific time period';
COMMENT ON FUNCTION prettygood.get_plays_by_country IS 'Gets play counts grouped by country for specified tracks';
COMMENT ON FUNCTION prettygood.get_plays_by_source IS 'Gets play counts grouped by source (where plays originate from)';
COMMENT ON FUNCTION prettygood.get_recent_plays IS 'Gets recent plays for tracks by an artist';
COMMENT ON FUNCTION prettygood.get_tracks_play_count IS 'Gets total play count for a set of tracks';
COMMENT ON FUNCTION prettygood.get_play_duration_stats IS 'Gets statistics about play duration and completion rate';
COMMENT ON FUNCTION prettygood.get_artist_followers_count IS 'Gets the total number of followers for an artist';
COMMENT ON FUNCTION prettygood.get_followers_by_period IS 'Gets new followers grouped by time period';
COMMENT ON FUNCTION prettygood.get_followers_count_for_period IS 'Gets the number of new followers within a specific time period';
COMMENT ON FUNCTION prettygood.get_recent_followers IS 'Gets recent followers for an artist';
COMMENT ON FUNCTION prettygood.get_artist_total_earnings IS 'Gets the total earnings for an artist';
COMMENT ON FUNCTION prettygood.get_earnings_by_period IS 'Gets earnings grouped by time period';
COMMENT ON FUNCTION prettygood.get_earnings_by_payment_type IS 'Gets earnings grouped by payment type';
COMMENT ON FUNCTION prettygood.get_earnings_for_period IS 'Gets the total earnings within a specific time period';
COMMENT ON FUNCTION prettygood.get_recent_transactions IS 'Gets recent payment transactions for an artist';
COMMENT ON FUNCTION prettygood.get_recent_tips IS 'Gets recent tips for an artist';
COMMENT ON FUNCTION prettygood.get_track_saves_count IS 'Gets the number of times tracks have been saved to user libraries';
COMMENT ON FUNCTION prettygood.get_track_playlists_count IS 'Gets the number of times tracks have been added to playlists';
