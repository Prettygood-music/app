-- Test file: rls_policies.sql
-- Description: Tests for Row Level Security policies

-- Start transaction
BEGIN;

-- Load pgTAP
SELECT plan(22);

-- Test for RLS enabled on key tables
SELECT row_security_active('prettygood.users'),
    'Row security should be active on users table';
    
SELECT row_security_active('prettygood.artists'),
    'Row security should be active on artists table';
    
SELECT row_security_active('prettygood.albums'),
    'Row security should be active on albums table';
    
SELECT row_security_active('prettygood.tracks'),
    'Row security should be active on tracks table';
    
SELECT row_security_active('prettygood.playlists'),
    'Row security should be active on playlists table';
    
SELECT row_security_active('prettygood.payments'),
    'Row security should be active on payments table';
    
SELECT row_security_active('prettygood.user_library_tracks'),
    'Row security should be active on user_library_tracks table';
    
SELECT row_security_active('prettygood.user_settings'),
    'Row security should be active on user_settings table';

-- Test for specific policies
SELECT has_table_privilege('anon', 'prettygood.users', 'SELECT'),
    'anon role should have SELECT privilege on users table';
    
SELECT has_table_privilege('authenticated', 'prettygood.users', 'SELECT'),
    'authenticated role should have SELECT privilege on users table';
    
SELECT has_table_privilege('authenticated', 'prettygood.users', 'UPDATE'),
    'authenticated role should have UPDATE privilege on users table';
    
SELECT NOT has_table_privilege('anon', 'prettygood.users', 'UPDATE'),
    'anon role should NOT have UPDATE privilege on users table';
    
SELECT has_table_privilege('anon', 'prettygood.tracks', 'SELECT'),
    'anon role should have SELECT privilege on tracks table';
    
SELECT NOT has_table_privilege('anon', 'prettygood.tracks', 'INSERT'),
    'anon role should NOT have INSERT privilege on tracks table';
    
SELECT has_table_privilege('authenticated', 'prettygood.track_likes', 'INSERT'),
    'authenticated role should have INSERT privilege on track_likes table';
    
SELECT has_table_privilege('anon', 'prettygood.track_likes', 'SELECT'),
    'anon role should have SELECT privilege on track_likes table';
    
SELECT NOT has_table_privilege('anon', 'prettygood.user_library_tracks', 'SELECT'),
    'anon role should NOT have SELECT privilege on user_library_tracks table';
    
SELECT has_table_privilege('authenticated', 'prettygood.user_library_tracks', 'SELECT'),
    'authenticated role should have SELECT privilege on user_library_tracks table';
    
-- Test RLS helper functions
SELECT has_function(
    'prettygood_private', 'current_user_id', ARRAY[],
    'current_user_id function should exist'
);

SELECT has_function(
    'prettygood_private', 'is_authenticated', ARRAY[],
    'is_authenticated function should exist'
);

SELECT has_function(
    'prettygood_private', 'is_admin', ARRAY[],
    'is_admin function should exist'
);

SELECT has_function(
    'prettygood_private', 'is_artist', ARRAY[],
    'is_artist function should exist'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
