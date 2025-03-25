-- Seed file: 004_likes_follows.sql
-- Description: Sets up likes and follows relationships between users, tracks, albums, and artists

-- User likes tracks
INSERT INTO prettygood.track_likes (track_id, user_id)
VALUES 
  -- Music Lover likes
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  (
    '20000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  (
    '20000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  -- Beat Enthusiast likes
  (
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005'
  ),
  
  (
    '20000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
  ),
  
  (
    '20000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000005'
  ) 
ON CONFLICT (track_id, user_id) DO NOTHING;

-- User likes albums
INSERT INTO prettygood.album_likes (album_id, user_id)
VALUES 
  -- Music Lover likes
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  -- Beat Enthusiast likes
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000005'
  ),
  
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005'
  ) 
ON CONFLICT (album_id, user_id) DO NOTHING;

-- Users follow artists
INSERT INTO prettygood.artist_followers (artist_id, user_id)
VALUES 
  -- Music Lover follows
  (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000004'
  ),
  
  -- Beat Enthusiast follows
  (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000005'
  ),
  
  (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000005'
  ) 
ON CONFLICT (artist_id, user_id) DO NOTHING;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Likes and follows created successfully';
  RAISE NOTICE '- 6 Track likes added';
  RAISE NOTICE '- 4 Album likes added';
  RAISE NOTICE '- 5 Artist follows added';
END $$;
