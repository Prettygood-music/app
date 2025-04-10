# Analytics Database Functions Implementation Plan

This document outlines the database functions (RPC calls) needed to support the analytics service for the artist dashboard. Each function is described with its purpose, parameters, return type, and implementation notes.

## Function Overview

The functions are grouped by category:

1. **Play Analytics Functions** - Functions for analyzing play data
2. **Follower Analytics Functions** - Functions for analyzing follower data
3. **Earnings Analytics Functions** - Functions for analyzing financial data
4. **Engagement Analytics Functions** - Functions for analyzing user engagement

## Implementation Details

### Play Analytics Functions

#### `get_plays_by_period`

**Purpose:** Get play counts grouped by time period (day, month, year)

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get play counts for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period
- `time_format` TEXT - PostgreSQL time format string (e.g., '%Y-%m-%d', '%Y-%m', '%Y')

**Returns:** TABLE (period TEXT, count BIGINT)

**Implementation Notes:**
```sql
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
```

#### `get_track_plays_for_period`

**Purpose:** Get play counts for specific tracks within a time period

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get play counts for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** TABLE (track_id UUID, count BIGINT)

**Implementation Notes:**
```sql
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
```

#### `get_track_play_counts`

**Purpose:** Get total play counts for multiple tracks

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get play counts for
- `start_date` TIMESTAMPTZ - Start date for the period (optional)
- `end_date` TIMESTAMPTZ - End date for the period (optional)

**Returns:** TABLE (track_id UUID, count BIGINT)

**Implementation Notes:**
```sql
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
```

#### `get_plays_for_period`

**Purpose:** Get total play count for an artist within a specific time period

**Parameters:**
- `artist_id` UUID - The artist ID to get play count for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

#### `get_plays_by_country`

**Purpose:** Get play counts grouped by country

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get play counts for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** TABLE (country_code TEXT, play_count BIGINT)

**Implementation Notes:**
```sql
CREATE OR REPLACE FUNCTION prettygood.get_plays_by_country(
    track_ids UUID[],
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
)
RETURNS TABLE (country_code TEXT, play_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- This assumes we have a client_geo_country column in play_history
        -- If not, this would need to be derived from IP address
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
END;
$$ LANGUAGE plpgsql STABLE;
```

#### `get_plays_by_source`

**Purpose:** Get play counts grouped by source (where plays originate from)

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get play counts for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** TABLE (source TEXT, count BIGINT)

**Implementation Notes:**
```sql
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
```

#### `get_recent_plays`

**Purpose:** Get recent plays for tracks by an artist

**Parameters:**
- `track_ids` UUID[] - Array of track IDs to get recent plays for
- `start_date` TIMESTAMPTZ - Optional start date filter
- `limit_count` INTEGER - Maximum number of plays to return

**Returns:** TABLE (played_at TIMESTAMPTZ, track_id UUID, track_title TEXT, username TEXT)

**Implementation Notes:**
```sql
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
```

#### `get_tracks_play_count`

**Purpose:** Get total play count for a set of tracks

**Parameters:**
- `track_ids` UUID[] - Array of track IDs
- `start_date` TIMESTAMPTZ - Start date filter (optional)
- `end_date` TIMESTAMPTZ - End date filter (optional)

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

#### `get_play_duration_stats`

**Purpose:** Get statistics about play duration and completion rate

**Parameters:**
- `track_ids` UUID[] - Array of track IDs
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** TABLE (avg_duration FLOAT, completed_count BIGINT, total_count BIGINT)

**Implementation Notes:**
```sql
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
```

### Follower Analytics Functions

#### `get_artist_followers_count`

**Purpose:** Get the total number of followers for an artist

**Parameters:**
- `artist_id` UUID - The artist ID to get follower count for

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

#### `get_followers_by_period`

**Purpose:** Get new followers grouped by time period

**Parameters:**
- `artist_id` UUID - The artist ID to get followers for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period
- `time_format` TEXT - PostgreSQL time format string (e.g., '%Y-%m-%d', '%Y-%m', '%Y')

**Returns:** TABLE (period TEXT, count BIGINT)

**Implementation Notes:**
```sql
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
```

#### `get_followers_count_for_period`

**Purpose:** Get the number of new followers within a specific time period

**Parameters:**
- `artist_id` UUID - The artist ID to get follower count for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

#### `get_recent_followers`

**Purpose:** Get recent followers for an artist

**Parameters:**
- `artist_id` UUID - The artist ID to get recent followers for
- `start_date` TIMESTAMPTZ - Optional start date filter
- `limit_count` INTEGER - Maximum number of followers to return

**Returns:** TABLE (added_at TIMESTAMPTZ, user_id UUID, username TEXT)

**Implementation Notes:**
```sql
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
```

### Earnings Analytics Functions

#### `get_artist_total_earnings`

**Purpose:** Get the total earnings for an artist

**Parameters:**
- `artist_id` UUID - The artist ID to get earnings for

**Returns:** NUMERIC

**Implementation Notes:**
```sql
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
```

#### `get_earnings_by_period`

**Purpose:** Get earnings grouped by time period

**Parameters:**
- `artist_id` UUID - The artist ID to get earnings for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period
- `time_format` TEXT - PostgreSQL time format string (e.g., '%Y-%m-%d', '%Y-%m', '%Y')

**Returns:** TABLE (period TEXT, amount NUMERIC)

**Implementation Notes:**
```sql
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
```

#### `get_earnings_by_payment_type`

**Purpose:** Get earnings grouped by payment type

**Parameters:**
- `artist_id` UUID - The artist ID to get earnings for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** TABLE (payment_type TEXT, amount NUMERIC)

**Implementation Notes:**
```sql
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
```

#### `get_earnings_for_period`

**Purpose:** Get the total earnings within a specific time period

**Parameters:**
- `artist_id` UUID - The artist ID to get earnings for
- `start_date` TIMESTAMPTZ - Start date for the period
- `end_date` TIMESTAMPTZ - End date for the period

**Returns:** NUMERIC

**Implementation Notes:**
```sql
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
```

#### `get_recent_transactions`

**Purpose:** Get recent payment transactions for an artist

**Parameters:**
- `artist_id` UUID - The artist ID to get transactions for
- `limit_count` INTEGER - Maximum number of transactions to return

**Returns:** TABLE (id UUID, created_at TIMESTAMPTZ, amount NUMERIC, payment_type TEXT, sender_id UUID, username TEXT)

**Implementation Notes:**
```sql
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
```

#### `get_recent_tips`

**Purpose:** Get recent tips for an artist

**Parameters:**
- `artist_id` UUID - The artist ID to get tips for
- `start_date` TIMESTAMPTZ - Optional start date filter
- `limit_count` INTEGER - Maximum number of tips to return

**Returns:** TABLE (created_at TIMESTAMPTZ, amount NUMERIC, username TEXT)

**Implementation Notes:**
```sql
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
```

### Engagement Analytics Functions

#### `get_track_saves_count`

**Purpose:** Get the number of times tracks have been saved to user libraries

**Parameters:**
- `track_ids` UUID[] - Array of track IDs
- `start_date` TIMESTAMPTZ - Start date filter
- `end_date` TIMESTAMPTZ - End date filter

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

#### `get_track_playlists_count`

**Purpose:** Get the number of times tracks have been added to playlists

**Parameters:**
- `track_ids` UUID[] - Array of track IDs
- `start_date` TIMESTAMPTZ - Start date filter
- `end_date` TIMESTAMPTZ - End date filter

**Returns:** BIGINT

**Implementation Notes:**
```sql
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
```

## Implementation Sequence and Strategy

### Implementation Phases

1. **Phase 1: Core Analytics Functions**
   - `get_artist_play_count` (already implemented)
   - `get_artist_followers_count`
   - `get_artist_total_earnings`
   - `get_plays_for_period`
   - `get_track_play_counts`

2. **Phase 2: Period-Based Aggregation Functions**
   - `get_plays_by_period`
   - `get_followers_by_period`
   - `get_earnings_by_period`
   - `get_earnings_by_payment_type`

3. **Phase 3: Detail and Activity Functions**
   - `get_recent_plays`
   - `get_recent_followers`
   - `get_recent_transactions`
   - `get_recent_tips`
   - `get_plays_by_country`
   - `get_plays_by_source`

4. **Phase 4: Advanced Analytics Functions**
   - `get_play_duration_stats`
   - `get_track_saves_count`
   - `get_track_playlists_count`

### Testing Strategy

For each function:

1. Create unit tests with simple test data
2. Test boundary conditions (empty results, NULL parameters)
3. Test with realistic data volumes
4. Verify performance with large datasets

### Security Considerations

- All functions should use `SECURITY DEFINER` only when necessary
- Ensure proper parameter validation
- Use Row-Level Security (RLS) policies to control access to data
- Consider adding explicit permission checks in functions

## Documentation Style

For each implemented function, add a comment using PostgreSQL's `COMMENT ON FUNCTION` syntax:

```sql
COMMENT ON FUNCTION prettygood.get_plays_by_period IS 'Gets play counts grouped by time period for specified tracks within a date range. Returns a table with period and count columns.';
```

## Migration Strategy

Create a new migration file named `022_add_analytics_functions.sql` with all these function definitions.

## Next Steps After Implementation

1. Create TypeScript type definitions in the `@prettygood/database` package
2. Add example usage documentation
3. Create helper functions in the analytics service to abstract complex queries
4. Consider adding caching for frequently accessed analytics data
