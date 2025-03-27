-- Seed file: 001_development_users.sql
-- Description: Creates development/test users with predictable credentials

-- Development admin user
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, email, email_verified, profile_url, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000001', '0x0000000000000000000000000000000000000000000000000000000000000001', 'admin', 'System Admin', 'admin@prettygood.music', TRUE, 'https://example.com/images/admin-profile.jpg', NOW())
ON CONFLICT (id) DO NOTHING;

-- Development artist users with fixed IDs for testing
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, email, email_verified, profile_url, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000002', '0x0000000000000000000000000000000000000000000000000000000000000002', 'electric_symphony', 'Electric Symphony', 'electric@prettygood.music', TRUE, 'https://example.com/images/electric-symphony.jpg', NOW()),
  ('00000000-0000-0000-0000-000000000003', '0x0000000000000000000000000000000000000000000000000000000000000003', 'vintage_echoes', 'Vintage Echoes', 'vintage@prettygood.music', TRUE, 'https://example.com/images/vintage-echoes.jpg', NOW()),
  ('00000000-0000-0000-0000-000000000006', '0x0000000000000000000000000000000000000000000000000000000000000006', 'sonic_wanderer', 'Sonic Wanderer', 'sonic@prettygood.music', TRUE, 'https://example.com/images/sonic-wanderer.jpg', NOW()),
  ('00000000-0000-0000-0000-000000000007', '0x0000000000000000000000000000000000000000000000000000000000000007', 'melodic_journey', 'Melodic Journey', 'melodic@prettygood.music', TRUE, 'https://example.com/images/melodic-journey.jpg', NOW()),
  ('00000000-0000-0000-0000-000000000008', '0x0000000000000000000000000000000000000000000000000000000000000008', 'bass_architect', 'Bass Architect', 'bass@prettygood.music', TRUE, 'https://example.com/images/bass-architect.jpg', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create artist profiles for our artists
INSERT INTO prettygood.artists (
  id, artist_name, bio, genre, location, website, social_links, verified
) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Electric Symphony', 'Electronic music producer creating futuristic soundscapes.', ARRAY['Electronic', 'Ambient'], 'New York, USA', 'https://www.electricsymphony.com', '{"twitter":"@electric_symphony", "instagram":"@electric_symphony", "website":"https://www.electricsymphony.com"}', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Vintage Echoes', 'Nostalgic lo-fi beats and chillwave melodies.', ARRAY['Lo-Fi', 'Chillwave', 'Downtempo'], 'Los Angeles, USA', 'https://www.vintage-echoes.com', '{"twitter":"@vintage_echoes", "instagram":"@vintage_echoes", "website":"https://www.vintage-echoes.com"}', TRUE),
  ('00000000-0000-0000-0000-000000000006', 'Sonic Wanderer', 'Experimental sound artist pushing the boundaries of music.', ARRAY['Experimental', 'Ambient', 'Noise'], 'Berlin, Germany', 'https://www.sonicwanderer.com', '{"twitter":"@sonic_wanderer", "instagram":"@sonic_wanderer", "website":"https://www.sonicwanderer.com"}', TRUE),
  ('00000000-0000-0000-0000-000000000007', 'Melodic Journey', 'Emotive ambient compositions that tell a story.', ARRAY['Ambient', 'Cinematic', 'Melodic'], 'Tokyo, Japan', 'https://www.melodicjourney.com', '{"twitter":"@melodic_journey", "instagram":"@melodic_journey", "website":"https://www.melodicjourney.com"}', TRUE),
  ('00000000-0000-0000-0000-000000000008', 'Bass Architect', 'Deep bass explorations and innovative electronic structures.', ARRAY['Bass', 'Electronic', 'Dubstep'], 'London, UK', 'https://www.bassarchitect.com', '{"twitter":"@bass_architect", "instagram":"@bass_architect", "website":"https://www.bassarchitect.com"}', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Development regular users with fixed IDs for testing
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name, email, email_verified, profile_url, created_at
) VALUES
  ('00000000-0000-0000-0000-000000000004', '0x0000000000000000000000000000000000000000000000000000000000000004', 'music_lover42', 'Music Lover', 'musiclover@prettygood.music', FALSE, NULL, NOW()),
  ('00000000-0000-0000-0000-000000000005', '0x0000000000000000000000000000000000000000000000000000000000000005', 'beat_enthusiast', 'Beat Enthusiast', 'beat@prettygood.music', TRUE, 'https://example.com/images/beat-enthusiast.jpg', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create user settings for all users
INSERT INTO prettygood.user_settings (
  user_id, theme, audio_quality, volume_level, enable_equalizer, enable_gapless_playback
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'dark', 'high', 80, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000002', 'dark', 'high', 75, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000003', 'light', 'high', 70, FALSE, TRUE),
  ('00000000-0000-0000-0000-000000000004', 'dark', 'medium', 65, FALSE, TRUE),
  ('00000000-0000-0000-0000-000000000005', 'auto', 'medium', 60, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000006', 'dark', 'high', 85, TRUE, TRUE),
  ('00000000-0000-0000-0000-000000000007', 'light', 'high', 75, FALSE, TRUE),
  ('00000000-0000-0000-0000-000000000008', 'dark', 'high', 90, TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- Insert authentication data for easy testing
-- The nonce is set to a known value for development testing
-- All passwords are set to 'Password123!' for development testing
INSERT INTO prettygood_private.user_auth (
  user_id, nonce, nonce_created_at, password_hash
) VALUES
  ('00000000-0000-0000-0000-000000000001', 'development_nonce_admin', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000002', 'development_nonce_electric', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000003', 'development_nonce_vintage', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000004', 'development_nonce_musiclover', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000005', 'development_nonce_enthusiast', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000006', 'development_nonce_sonic', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000007', 'development_nonce_melodic', NOW(), crypt('Password123!', gen_salt('bf'))),
  ('00000000-0000-0000-0000-000000000008', 'development_nonce_bass', NOW(), crypt('Password123!', gen_salt('bf')))
ON CONFLICT (user_id) DO NOTHING;

-- Create a sample verification token for testing the verification flow
INSERT INTO prettygood_private.email_verification_tokens (
  user_id, token, created_at, expires_at
) VALUES (
  '00000000-0000-0000-0000-000000000004',
  'test-verification-token-music-lover',
  NOW(),
  NOW() + INTERVAL '24 hours'
) ON CONFLICT DO NOTHING;

-- Create a sample reset token for testing the password reset flow
UPDATE prettygood_private.user_auth
SET 
  reset_token = 'test-reset-token-beat-enthusiast',
  reset_token_expires_at = NOW() + INTERVAL '1 hour'
WHERE user_id = '00000000-0000-0000-0000-000000000005';

-- Make the admin user a superuser
-- Note: In a real system, you'd want to have proper role-based permissions
-- This is just for development/testing purposes
DO $$
DECLARE
    role_exists BOOLEAN;
BEGIN
    -- Check if admin role exists
    SELECT EXISTS(SELECT 1 FROM pg_roles WHERE rolname = 'admin') INTO role_exists;
    
    -- Create admin role if it doesn't exist
    IF NOT role_exists THEN
        CREATE ROLE admin NOLOGIN;
        -- Grant authenticated role to admin
        GRANT authenticated TO admin;
    END IF;
END $$;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Development users created with the following credentials:';
  RAISE NOTICE '- Admin: wallet_address=0x0000...0001, username=admin, email=admin@prettygood.music, password=Password123!';
  RAISE NOTICE '- Electric Symphony: wallet_address=0x0000...0002, username=electric_symphony, email=electric@prettygood.music, password=Password123!';
  RAISE NOTICE '- Vintage Echoes: wallet_address=0x0000...0003, username=vintage_echoes, email=vintage@prettygood.music, password=Password123!';
  RAISE NOTICE '- Music Lover: wallet_address=0x0000...0004, username=music_lover42, email=musiclover@prettygood.music, password=Password123! (email not verified)';
  RAISE NOTICE '- Beat Enthusiast: wallet_address=0x0000...0005, username=beat_enthusiast, email=beat@prettygood.music, password=Password123! (has reset token)';
  RAISE NOTICE '- Sonic Wanderer: wallet_address=0x0000...0006, username=sonic_wanderer, email=sonic@prettygood.music, password=Password123!';
  RAISE NOTICE '- Melodic Journey: wallet_address=0x0000...0007, username=melodic_journey, email=melodic@prettygood.music, password=Password123!';
  RAISE NOTICE '- Bass Architect: wallet_address=0x0000...0008, username=bass_architect, email=bass@prettygood.music, password=Password123!';
  RAISE NOTICE '';
  RAISE NOTICE 'Test verification token: test-verification-token-music-lover';
  RAISE NOTICE 'Test password reset token: test-reset-token-beat-enthusiast';
END $$;
