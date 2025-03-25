-- Master seed file: 000_run_all.sql
-- Description: Runs all seed files in the correct order

-- Display start message
DO $$
BEGIN
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Starting seed data import for prettygood.music...';
  RAISE NOTICE '=================================================';
END $$;

-- Include all seed files in proper order
\i 'seed/001_development_users.sql'
\i 'seed/002_test_content.sql'
\i 'seed/003_playlists.sql'
\i 'seed/004_likes_follows.sql'
\i 'seed/005_play_history.sql'
\i 'seed/006_user_library.sql'
\i 'seed/007_payments.sql'
\i 'seed/008_search_history.sql'

-- Display completion message
DO $$
BEGIN
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'Seed data import completed successfully!';
  RAISE NOTICE '=================================================';
  RAISE NOTICE 'The database now contains:';
  RAISE NOTICE '- Development users (both regular users and artists)';
  RAISE NOTICE '- Test albums and tracks with real-world metadata';
  RAISE NOTICE '- Playlists with tracks';
  RAISE NOTICE '- Likes and follows relationships';
  RAISE NOTICE '- Play history records';
  RAISE NOTICE '- User library entries (saved tracks, albums, artists)';
  RAISE NOTICE '- Payment/tip history';
  RAISE NOTICE '- Search history';
  RAISE NOTICE '=================================================';
END $$;
