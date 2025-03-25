-- Seed file: 008_search_history.sql
-- Description: Creates search history for users

-- Add search history
INSERT INTO prettygood.search_history (user_id, query, searched_at)
VALUES 
  -- Music Lover search history
  (
    '00000000-0000-0000-0000-000000000004',
    'electronic music',
    NOW() - INTERVAL '5 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    'ambient',
    NOW() - INTERVAL '4 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    'melodic journey',
    NOW() - INTERVAL '4 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    'bass architect',
    NOW() - INTERVAL '3 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    'deep bass',
    NOW() - INTERVAL '3 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000004',
    'electronic symphony',
    NOW() - INTERVAL '2 days'
  ),
  
  -- Beat Enthusiast search history
  (
    '00000000-0000-0000-0000-000000000005',
    'lo-fi',
    NOW() - INTERVAL '6 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    'vintage echoes',
    NOW() - INTERVAL '6 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    'experimental',
    NOW() - INTERVAL '5 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    'sonic wanderer',
    NOW() - INTERVAL '5 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    'ambient music',
    NOW() - INTERVAL '2 days'
  ),
  
  (
    '00000000-0000-0000-0000-000000000005',
    'melodic sunset',
    NOW() - INTERVAL '1 day'
  );

-- Print a message
DO $$
BEGIN
  RAISE NOTICE 'Search history created successfully';
  RAISE NOTICE '- 6 search queries for Music Lover';
  RAISE NOTICE '- 6 search queries for Beat Enthusiast';
END $$;
