-- Migration: 003_consolidate_permissions.sql
-- Description: Consolidates permission fixes from migrations 039 and 040
-- This migration replaces the following original migrations:
-- - 039_fix_table_permissions.sql
-- - 040_fix_tracks_permissions.sql

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- Ensure all tables have RLS enabled
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'prettygood' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE prettygood.%I ENABLE ROW LEVEL SECURITY', table_record.table_name);
    END LOOP;
END $$;

-- Fix tracks table permissions
DROP POLICY IF EXISTS tracks_select ON prettygood.tracks;
DROP POLICY IF EXISTS tracks_insert ON prettygood.tracks;
DROP POLICY IF EXISTS tracks_update ON prettygood.tracks;
DROP POLICY IF EXISTS tracks_delete ON prettygood.tracks;

-- Create comprehensive RLS policies for tracks
CREATE POLICY tracks_select ON prettygood.tracks
    FOR SELECT USING (TRUE);  -- All tracks are visible to everyone

CREATE POLICY tracks_insert ON prettygood.tracks
    FOR INSERT WITH CHECK (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

CREATE POLICY tracks_update ON prettygood.tracks
    FOR UPDATE USING (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

CREATE POLICY tracks_delete ON prettygood.tracks
    FOR DELETE USING (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

-- Fix albums table permissions
DROP POLICY IF EXISTS albums_select ON prettygood.albums;
DROP POLICY IF EXISTS albums_insert ON prettygood.albums;
DROP POLICY IF EXISTS albums_update ON prettygood.albums;
DROP POLICY IF EXISTS albums_delete ON prettygood.albums;

-- Create comprehensive RLS policies for albums
CREATE POLICY albums_select ON prettygood.albums
    FOR SELECT USING (TRUE);  -- All albums are visible to everyone

CREATE POLICY albums_insert ON prettygood.albums
    FOR INSERT WITH CHECK (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

CREATE POLICY albums_update ON prettygood.albums
    FOR UPDATE USING (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

CREATE POLICY albums_delete ON prettygood.albums
    FOR DELETE USING (
        prettygood_private.is_artist() AND
        artist_id = prettygood_private.current_user_id()
    );

-- Fix artists table permissions
DROP POLICY IF EXISTS artists_select ON prettygood.artists;
DROP POLICY IF EXISTS artists_update ON prettygood.artists;
DROP POLICY IF EXISTS artists_insert ON prettygood.artists;
DROP POLICY IF EXISTS artists_delete ON prettygood.artists;

-- Create comprehensive RLS policies for artists
CREATE POLICY artists_select ON prettygood.artists
    FOR SELECT USING (TRUE);  -- All artists are visible to everyone

CREATE POLICY artists_update ON prettygood.artists
    FOR UPDATE USING (
        id = prettygood_private.current_user_id()
    );

CREATE POLICY artists_insert ON prettygood.artists
    FOR INSERT WITH CHECK (
        id = prettygood_private.current_user_id()
    );

CREATE POLICY artists_delete ON prettygood.artists
    FOR DELETE USING (FALSE);  -- Don't allow deletion of artist profiles

-- Fix playlists table permissions
DROP POLICY IF EXISTS playlists_select_public ON prettygood.playlists;
DROP POLICY IF EXISTS playlists_insert ON prettygood.playlists;
DROP POLICY IF EXISTS playlists_update ON prettygood.playlists;
DROP POLICY IF EXISTS playlists_delete ON prettygood.playlists;

-- Create comprehensive RLS policies for playlists
CREATE POLICY playlists_select_public ON prettygood.playlists
    FOR SELECT USING (
        is_public = TRUE OR
        user_id = prettygood_private.current_user_id() OR
        EXISTS (
            SELECT 1 FROM prettygood.playlist_collaborators
            WHERE playlist_id = prettygood.playlists.id
            AND user_id = prettygood_private.current_user_id()
        )
    );

CREATE POLICY playlists_insert ON prettygood.playlists
    FOR INSERT WITH CHECK (
        user_id = prettygood_private.current_user_id()
    );

CREATE POLICY playlists_update ON prettygood.playlists
    FOR UPDATE USING (
        user_id = prettygood_private.current_user_id() OR
        EXISTS (
            SELECT 1 FROM prettygood.playlist_collaborators
            WHERE playlist_id = prettygood.playlists.id
            AND user_id = prettygood_private.current_user_id()
        )
    );

CREATE POLICY playlists_delete ON prettygood.playlists
    FOR DELETE USING (
        user_id = prettygood_private.current_user_id()
    );

-- Fix playlist tracks permissions
DROP POLICY IF EXISTS playlist_tracks_select ON prettygood.playlist_tracks;
DROP POLICY IF EXISTS playlist_tracks_insert ON prettygood.playlist_tracks;
DROP POLICY IF EXISTS playlist_tracks_update ON prettygood.playlist_tracks;
DROP POLICY IF EXISTS playlist_tracks_delete ON prettygood.playlist_tracks;

-- Create improved RLS policies for playlist tracks
CREATE POLICY playlist_tracks_select ON prettygood.playlist_tracks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM prettygood.playlists
            WHERE id = prettygood.playlist_tracks.playlist_id
            AND (
                is_public = TRUE OR
                user_id = prettygood_private.current_user_id() OR
                EXISTS (
                    SELECT 1 FROM prettygood.playlist_collaborators
                    WHERE playlist_id = prettygood.playlists.id
                    AND user_id = prettygood_private.current_user_id()
                )
            )
        )
    );

CREATE POLICY playlist_tracks_insert ON prettygood.playlist_tracks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM prettygood.playlists
            WHERE id = prettygood.playlist_tracks.playlist_id
            AND (
                user_id = prettygood_private.current_user_id() OR
                EXISTS (
                    SELECT 1 FROM prettygood.playlist_collaborators
                    WHERE playlist_id = prettygood.playlists.id
                    AND user_id = prettygood_private.current_user_id()
                    AND can_add_tracks = TRUE
                )
            )
        )
    );

CREATE POLICY playlist_tracks_update ON prettygood.playlist_tracks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM prettygood.playlists
            WHERE id = prettygood.playlist_tracks.playlist_id
            AND (
                user_id = prettygood_private.current_user_id() OR
                EXISTS (
                    SELECT 1 FROM prettygood.playlist_collaborators
                    WHERE playlist_id = prettygood.playlists.id
                    AND user_id = prettygood_private.current_user_id()
                    AND can_reorder_tracks = TRUE
                )
            )
        )
    );

CREATE POLICY playlist_tracks_delete ON prettygood.playlist_tracks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM prettygood.playlists
            WHERE id = prettygood.playlist_tracks.playlist_id
            AND (
                user_id = prettygood_private.current_user_id() OR
                EXISTS (
                    SELECT 1 FROM prettygood.playlist_collaborators
                    WHERE playlist_id = prettygood.playlists.id
                    AND user_id = prettygood_private.current_user_id()
                    AND can_remove_tracks = TRUE
                )
            )
        )
    );

-- Fix payment table permissions
DROP POLICY IF EXISTS payments_select_admin ON prettygood.payments;
DROP POLICY IF EXISTS payments_select_own ON prettygood.payments;
DROP POLICY IF EXISTS payments_insert ON prettygood.payments;

CREATE POLICY payments_select_admin ON prettygood.payments
    FOR SELECT USING (
        prettygood_private.is_admin()
    );

CREATE POLICY payments_select_own ON prettygood.payments
    FOR SELECT USING (
        sender_id = prettygood_private.current_user_id() OR
        recipient_id = prettygood_private.current_user_id()
    );

CREATE POLICY payments_insert ON prettygood.payments
    FOR INSERT WITH CHECK (
        sender_id = prettygood_private.current_user_id()
    );

-- Fix library tables permissions to ensure proper access controls
DO $$
DECLARE
    library_table_name TEXT;
BEGIN
    FOR library_table_name IN
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'prettygood'
        AND table_name LIKE 'user_library_%'
    LOOP
        -- Drop existing policies
        EXECUTE format('DROP POLICY IF EXISTS %1$s_select ON prettygood.%1$s', library_table_name);
        EXECUTE format('DROP POLICY IF EXISTS %1$s_insert ON prettygood.%1$s', library_table_name);
        EXECUTE format('DROP POLICY IF EXISTS %1$s_delete ON prettygood.%1$s', library_table_name);
        
        -- Create select policy
        EXECUTE format('
            CREATE POLICY %1$s_select ON prettygood.%1$s
            FOR SELECT USING (
                user_id = prettygood_private.current_user_id() OR
                prettygood_private.is_admin()
            )
        ', library_table_name);
        
        -- Create insert policy
        EXECUTE format('
            CREATE POLICY %1$s_insert ON prettygood.%1$s
            FOR INSERT WITH CHECK (
                user_id = prettygood_private.current_user_id()
            )
        ', library_table_name);
        
        -- Create delete policy
        EXECUTE format('
            CREATE POLICY %1$s_delete ON prettygood.%1$s
            FOR DELETE USING (
                user_id = prettygood_private.current_user_id()
            )
        ', library_table_name);
    END LOOP;
END $$;

-- Add policy exception for bypass_rls role (for administrative access)
DO $$
BEGIN
    -- Check if role exists, create if not
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'bypass_rls') THEN
        CREATE ROLE bypass_rls;
    END IF;

    -- Grant permissions and bypass RLS for all prettygood tables
    FOR tab IN (SELECT tablename FROM pg_tables WHERE schemaname = 'prettygood')
    LOOP
        EXECUTE format('ALTER TABLE prettygood.%I FORCE ROW LEVEL SECURITY', tab.tablename);
        EXECUTE format('CREATE POLICY bypass_rls ON prettygood.%I FOR ALL TO bypass_rls USING (true)', tab.tablename);
    END LOOP;
END $$;

-- Grant appropriate permissions to roles
GRANT USAGE ON SCHEMA prettygood TO api_user, anon, authenticated, artist;
GRANT USAGE ON SCHEMA prettygood_private TO api_user;

-- Public schema access for all roles
GRANT SELECT ON ALL TABLES IN SCHEMA prettygood TO api_user, anon, authenticated, artist;

-- Additional permissions based on role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA prettygood TO authenticated, artist;

-- Authenticated user role inherits from anon
GRANT anon TO authenticated;

-- Artist role inherits from authenticated user role
GRANT authenticated TO artist;

COMMENT ON FUNCTION prettygood_private.is_artist IS 'Checks if the current user is an artist with appropriate permissions';
COMMENT ON FUNCTION prettygood_private.is_admin IS 'Checks if the current user has admin permissions';
