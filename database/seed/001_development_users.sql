-- Seed file: 001_development_users.sql
-- Description: Creates development/test users with predictable credentials

-- Development admin user
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', '0x0000000000000000000000000000000000000000000000000000000000000001', 'admin', 'System Admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- Development artist users with fixed IDs for testing
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000002', '0x0000000000000000000000000000000000000000000000000000000000000002', 'testartist1', 'Test Artist 1', NOW()),
  ('00000000-0000-0000-0000-000000000003', '0x0000000000000000000000000000000000000000000000000000000000000003', 'testartist2', 'Test Artist 2', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create artist profiles for the test artists
INSERT INTO prettygood.artists (
  id, artist_name, bio, genre, location, verified
) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Test Artist 1', 'This is a test artist for development.', ARRAY['test', 'development'], 'Testland', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Test Artist 2', 'Another test artist for development.', ARRAY['test', 'development'], 'Testville', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Development regular users with fixed IDs for testing
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000004', '0x0000000000000000000000000000000000000000000000000000000000000004', 'testuser1', 'Test User 1', NOW()),
  ('00000000-0000-0000-0000-000000000005', '0x0000000000000000000000000000000000000000000000000000000000000005', 'testuser2', 'Test User 2', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create user settings for all users
INSERT INTO prettygood.user_settings (
  user_id, theme, audio_quality
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'dark', 'high'),
  ('00000000-0000-0000-0000-000000000002', 'dark', 'high'),
  ('00000000-0000-0000-0000-000000000003', 'light', 'high'),
  ('00000000-0000-0000-0000-000000000004', 'dark', 'medium'),
  ('00000000-0000-0000-0000-000000000005', 'auto', 'medium')
ON CONFLICT (user_id) DO NOTHING;

-- Insert authentication data for easy testing
-- The nonce is set to a known value for development testing
INSERT INTO prettygood_private.user_auth (
  user_id, nonce, nonce_created_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'development_nonce_admin', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'development_nonce_artist1', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'development_nonce_artist2', NOW()),
  ('00000000-0000-0000-0000-000000000004', 'development_nonce_user1', NOW()),
  ('00000000-0000-0000-0000-000000000005', 'development_nonce_user2', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Make the admin user a superuser
-- Note: In a real system, you'd want to have proper role-based permissions
-- This is just for development/testing purposes
DO $$
BEGIN
  -- Create a function to set admin privileges if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'set_admin_role') THEN
    CREATE OR REPLACE FUNCTION auth.set_admin_role()
    RETURNS VOID AS $$
    BEGIN
      -- Create a special admin role if it doesn't exist
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin NOLOGIN;
        GRANT authenticated TO admin;
      END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  END IF;

  -- Execute the function
  PERFORM auth.set_admin_role();
END $$;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Development users created with the following credentials:';
  RAISE NOTICE '- Admin: wallet_address=0x0000...0001, username=admin, nonce=development_nonce_admin';
  RAISE NOTICE '- Artist 1: wallet_address=0x0000...0002, username=testartist1, nonce=development_nonce_artist1';
  RAISE NOTICE '- Artist 2: wallet_address=0x0000...0003, username=testartist2, nonce=development_nonce_artist2';
  RAISE NOTICE '- User 1: wallet_address=0x0000...0004, username=testuser1, nonce=development_nonce_user1';
  RAISE NOTICE '- User 2: wallet_address=0x0000...0005, username=testuser2, nonce=development_nonce_user2';
END $$;
