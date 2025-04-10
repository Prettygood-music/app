-- Migration: 040_fix_tracks_permissions.sql
-- Description: Fixes permission issues with tracks table by granting direct access

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- Grant direct access to tracks table and related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.tracks TO authenticated;
GRANT SELECT ON prettygood.tracks TO anon;

-- Grant access to related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.track_likes TO authenticated;
GRANT SELECT ON prettygood.track_likes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.play_history TO authenticated;
GRANT SELECT ON prettygood.play_history TO anon;

-- Grant sequence usage for ID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA prettygood TO authenticated;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA prettygood
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA prettygood
GRANT SELECT ON TABLES TO anon;

-- Comment to document this fix
COMMENT ON TABLE prettygood.tracks IS 'Music tracks on the prettygood.music platform with fixed permissions';
