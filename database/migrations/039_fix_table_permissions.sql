-- Migration: 039_fix_table_permissions.sql
-- Description: Fixes permission issues with tables for web and API access

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- First, identify the role being used by the application
-- Create a function to get the current application role
CREATE OR REPLACE FUNCTION prettygood_private.get_app_role() 
RETURNS TEXT AS $$
BEGIN
  RETURN current_user;
END;
$$ LANGUAGE plpgsql;

-- Create function to log current permissions issue
CREATE OR REPLACE FUNCTION prettygood_private.log_permission_fix() 
RETURNS VOID AS $$
BEGIN
  RAISE NOTICE 'Fixing permissions for role: %', prettygood_private.get_app_role();
END;
$$ LANGUAGE plpgsql;

-- Log the role we're fixing
SELECT prettygood_private.log_permission_fix();

-- Grant proper permissions to the authenticator/web role (this would be the role your API uses)
-- First to schemas
GRANT USAGE ON SCHEMA prettygood TO authenticated;
GRANT USAGE ON SCHEMA prettygood TO anon;
GRANT USAGE ON SCHEMA prettygood_private TO authenticated;

-- Grant access to all tables in prettygood schema for authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA prettygood TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA prettygood TO anon;

-- Grant access specifically to the tracks table and related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.tracks TO authenticated;
GRANT SELECT ON prettygood.tracks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.track_likes TO authenticated;
GRANT SELECT ON prettygood.track_likes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON prettygood.play_history TO authenticated;
GRANT SELECT ON prettygood.play_history TO anon;

-- Grant usage on sequences to allow ID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA prettygood TO authenticated;

-- If you need to support anonymous access (e.g., for public tracks)
GRANT SELECT ON prettygood.tracks TO anon;

-- Additional recommended grants for application functionality
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA prettygood TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA prettygood_private TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon;

-- Make sure future tables and sequences will have proper permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA prettygood
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA prettygood
GRANT SELECT ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA prettygood
GRANT USAGE ON SEQUENCES TO authenticated;

-- Add comment to document this fix
COMMENT ON FUNCTION prettygood_private.get_app_role IS 'Helper function to identify the application database role';
COMMENT ON FUNCTION prettygood_private.log_permission_fix IS 'Logs information about permission fixes being applied';
