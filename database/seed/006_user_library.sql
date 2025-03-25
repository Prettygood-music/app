-- Seed file: 006_user_library.sql
-- Description: Adds tracks, albums and artists to user libraries

-- Add library items for users (saved tracks)
INSERT INTO prettygood.user_library_tracks (user_id, track_id)
VALUES 
  -- Music Lover library
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000002'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000007'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000008'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000009'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000010'
  ),
  
  -- Beat Enthusiast library
  (
    '00000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000003'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000004'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000005'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000006'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000008'
  ) 
ON CONFLICT (user_id, track_id) DO NOTHING;

-- Add saved albums to user libraries
INSERT INTO prettygood.user_library_albums (user_id, album_id)
VALUES 
  -- Music Lover library
  (
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000004'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000005'
  ),
  
  -- Beat Enthusiast library
  (
    '00000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000002'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000003'
  ) 
ON CONFLICT (user_id, album_id) DO NOTHING;

-- Add saved artists to user libraries
INSERT INTO prettygood.user_library_artists (user_id, artist_id)
VALUES 
  -- Music Lover library
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000007'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000008'
  ),
  
  -- Beat Enthusiast library
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000003'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006'
  ) 
ON CONFLICT (user_id, artist_id) DO NOTHING;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'User libraries created successfully';
  RAISE NOTICE '- 6 tracks added to Music Lover library';
  RAISE NOTICE '- 5 tracks added to Beat Enthusiast library';
  RAISE NOTICE '- 3 albums added to Music Lover library';
  RAISE NOTICE '- 2 albums added to Beat Enthusiast library';
  RAISE NOTICE '- 3 artists added to Music Lover library';
  RAISE NOTICE '- 2 artists added to Beat Enthusiast library';
END $$;
