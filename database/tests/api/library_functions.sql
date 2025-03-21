-- Test file: library_functions.sql
-- Description: Tests for user library API functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(9);

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

-- Insert test artist
INSERT INTO prettygood.artists (
  id, artist_name
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  'Test Artist'
);

-- Insert test album
INSERT INTO prettygood.albums (
  id, title, artist_id, release_date, genre
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  'Test Album',
  '99999999-9999-9999-9999-999999999999',
  '2023-01-01',
  ARRAY['test']
);

-- Insert test tracks
INSERT INTO prettygood.tracks (
  id, title, artist_id, album_id, duration, audio_url
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  'Test Track 1',
  '99999999-9999-9999-9999-999999999999',
  '77777777-7777-7777-7777-777777777777',
  180,
  'https://example.com/test1.mp3'
),
(
  '88888888-8888-8888-8888-888888888889',
  'Test Track 2',
  '99999999-9999-9999-9999-999999999999',
  '77777777-7777-7777-7777-777777777777',
  210,
  'https://example.com/test2.mp3'
);

-- Mock current_user_id function to return our test user
CREATE OR REPLACE FUNCTION prettygood_private.current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN '99999999-9999-9999-9999-999999999999'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Test add_track_to_library function
SELECT lives_ok(
  $$SELECT prettygood.add_track_to_library('88888888-8888-8888-8888-888888888888')$$,
  'add_track_to_library function should execute without errors'
);

SELECT is(
  (SELECT prettygood.add_track_to_library('88888888-8888-8888-8888-888888888888')),
  TRUE,
  'add_track_to_library should return TRUE on success'
);

SELECT isnt_empty(
  $$SELECT * FROM prettygood.user_library_tracks
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
    AND track_id = '88888888-8888-8888-8888-888888888888'$$,
  'add_track_to_library should add the track to the user library'
);

-- Test add_artist_to_library function
SELECT lives_ok(
  $$SELECT prettygood.add_artist_to_library('99999999-9999-9999-9999-999999999999')$$,
  'add_artist_to_library function should execute without errors'
);

SELECT is(
  (SELECT prettygood.add_artist_to_library('99999999-9999-9999-9999-999999999999')),
  TRUE,
  'add_artist_to_library should return TRUE on success'
);

SELECT isnt_empty(
  $$SELECT * FROM prettygood.user_library_artists
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
    AND artist_id = '99999999-9999-9999-9999-999999999999'$$,
  'add_artist_to_library should add the artist to the user library'
);

-- Test add_album_to_library function
SELECT lives_ok(
  $$SELECT prettygood.add_album_to_library('77777777-7777-7777-7777-777777777777')$$,
  'add_album_to_library function should execute without errors'
);

SELECT isnt_empty(
  $$SELECT * FROM prettygood.user_library_albums
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
    AND album_id = '77777777-7777-7777-7777-777777777777'$$,
  'add_album_to_library should add the album to the user library'
);

-- Test that add_album_to_library also adds the album's tracks
SELECT isnt_empty(
  $$SELECT * FROM prettygood.user_library_tracks
    WHERE user_id = '99999999-9999-9999-9999-999999999999'
    AND track_id = '88888888-8888-8888-8888-888888888889'$$,
  'add_album_to_library should add the album tracks to the user library'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
