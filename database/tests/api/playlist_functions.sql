-- Test file: playlist_functions.sql
-- Description: Tests for playlist-related API functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(6);

-- Setup test fixtures
SET client_min_messages TO warning;

-- Insert test user for our tests
INSERT INTO prettygood.users (
  id, wallet_address, username, display_name
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  '0x9999999999999999999999999999999999999999999999999999999999999999',
  'test_user',
  'Test User'
);

-- Mock current_user_id function to return our test user
CREATE OR REPLACE FUNCTION prettygood_private.current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN '99999999-9999-9999-9999-999999999999'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Test create_playlist function
SELECT lives_ok(
  $$SELECT prettygood.create_playlist('Test Playlist', 'A test playlist', TRUE, FALSE)$$,
  'create_playlist function should execute without errors'
);

-- Get the generated playlist ID
WITH playlist_data AS (
  SELECT id FROM prettygood.playlists
  WHERE name = 'Test Playlist' AND user_id = '99999999-9999-9999-9999-999999999999'
)
SELECT isnt_empty(
  $$SELECT id FROM playlist_data$$,
  'create_playlist should create a playlist in the database'
);

-- Insert a test track for testing add_track_to_playlist
INSERT INTO prettygood.artists (
  id, artist_name
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  'Test Artist'
);

INSERT INTO prettygood.tracks (
  id, title, artist_id, duration, audio_url
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  'Test Track',
  '99999999-9999-9999-9999-999999999999',
  180,
  'https://example.com/test.mp3'
);

-- Test add_track_to_playlist function
WITH playlist_data AS (
  SELECT id FROM prettygood.playlists
  WHERE name = 'Test Playlist' AND user_id = '99999999-9999-9999-9999-999999999999'
  LIMIT 1
)
SELECT lives_ok(
  $$SELECT prettygood.add_track_to_playlist(
    (SELECT id FROM playlist_data),
    '88888888-8888-8888-8888-888888888888'
  )$$,
  'add_track_to_playlist function should execute without errors'
);

-- Verify track was added to playlist
WITH playlist_data AS (
  SELECT id FROM prettygood.playlists
  WHERE name = 'Test Playlist' AND user_id = '99999999-9999-9999-9999-999999999999'
  LIMIT 1
)
SELECT isnt_empty(
  $$SELECT * FROM prettygood.playlist_tracks
    WHERE playlist_id = (SELECT id FROM playlist_data)
    AND track_id = '88888888-8888-8888-8888-888888888888'$$,
  'add_track_to_playlist should add the track to the playlist'
);

-- Test position value
WITH playlist_data AS (
  SELECT id FROM prettygood.playlists
  WHERE name = 'Test Playlist' AND user_id = '99999999-9999-9999-9999-999999999999'
  LIMIT 1
)
SELECT is(
  (SELECT position FROM prettygood.playlist_tracks
   WHERE playlist_id = (SELECT id FROM playlist_data)
   AND track_id = '88888888-8888-8888-8888-888888888888'),
  1,
  'First track added should have position 1'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
