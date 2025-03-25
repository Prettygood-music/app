-- Seed file: 003_playlists.sql
-- Description: Creates playlists and adds tracks to them

-- Create playlists
INSERT INTO prettygood.playlists (
    id,
    name,
    description,
    user_id,
    cover_url,
    is_public
  )
VALUES 
  (
    '30000000-0000-0000-0000-000000000001',
    'Electronic Vibes',
    'My favorite electronic tracks',
    '00000000-0000-0000-0000-000000000004',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&dpr=2&q=80',
    TRUE
  ),
  
  (
    '30000000-0000-0000-0000-000000000002',
    'Ambient Focus',
    'Perfect for work and concentration',
    '00000000-0000-0000-0000-000000000005',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&dpr=2&q=80',
    TRUE
  ),
  
  (
    '30000000-0000-0000-0000-000000000003',
    'Bass Explorations',
    'The deepest bass tracks around',
    '00000000-0000-0000-0000-000000000004',
    'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=300&dpr=2&q=80',
    FALSE
  ) 
ON CONFLICT (id) DO NOTHING;

-- Add tracks to playlists
INSERT INTO prettygood.playlist_tracks (
    playlist_id, 
    track_id, 
    added_by, 
    position
  )
VALUES 
  -- Tracks in Electronic Vibes
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    1
  ),
  
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    2
  ),
  
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000004',
    3
  ),
  
  -- Tracks in Ambient Focus
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000005',
    1
  ),
  
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000005',
    2
  ),
  
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000005',
    3
  ),
  
  -- Tracks in Bass Explorations
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000004',
    1
  ),
  
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000004',
    2
  ) 
ON CONFLICT (playlist_id, track_id) DO NOTHING;

-- Add collaborators to playlists
INSERT INTO prettygood.playlist_collaborators (
    playlist_id, 
    user_id, 
    added_by
  )
VALUES 
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
  ) 
ON CONFLICT (playlist_id, user_id) DO NOTHING;

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Playlists created successfully';
  RAISE NOTICE '- 3 Playlists created with tracks';
  RAISE NOTICE '- Added collaborator to "Ambient Focus" playlist';
END $$;
