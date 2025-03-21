-- Test file: api_functions.sql
-- Description: Tests for API functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(16);

-- Test for content management functions
SELECT has_function(
    'prettygood', 'add_track_to_playlist', ARRAY['uuid', 'uuid'],
    'add_track_to_playlist function should exist'
);

SELECT has_function(
    'prettygood', 'create_playlist', ARRAY['text', 'text', 'boolean', 'boolean'],
    'create_playlist function should exist'
);

SELECT has_function(
    'prettygood', 'record_play', ARRAY['uuid', 'integer', 'boolean', 'text', 'uuid'],
    'record_play function should exist'
);

-- Test for user library functions
SELECT has_function(
    'prettygood', 'add_track_to_library', ARRAY['uuid'],
    'add_track_to_library function should exist'
);

SELECT has_function(
    'prettygood', 'add_album_to_library', ARRAY['uuid'],
    'add_album_to_library function should exist'
);

SELECT has_function(
    'prettygood', 'add_artist_to_library', ARRAY['uuid'],
    'add_artist_to_library function should exist'
);

-- Test for search and recommendation functions
SELECT has_function(
    'prettygood', 'record_search', ARRAY['text'],
    'record_search function should exist'
);

SELECT has_function(
    'prettygood', 'get_recommendations', ARRAY['integer'],
    'get_recommendations function should exist'
);

-- Test for payment functions
SELECT has_function(
    'prettygood', 'tip_artist', ARRAY['uuid', 'numeric', 'text', 'uuid', 'uuid', 'text'],
    'tip_artist function should exist'
);

SELECT has_function(
    'prettygood', 'get_artist_payment_stats', ARRAY['uuid'],
    'get_artist_payment_stats function should exist'
);

-- Test function return types
SELECT function_returns(
    'prettygood', 'create_playlist', ARRAY['text', 'text', 'boolean', 'boolean'], 'prettygood.playlists',
    'create_playlist function should return playlists type'
);

SELECT function_returns(
    'prettygood', 'add_track_to_library', ARRAY['uuid'], 'boolean',
    'add_track_to_library function should return boolean'
);

SELECT function_returns(
    'prettygood', 'add_album_to_library', ARRAY['uuid'], 'boolean',
    'add_album_to_library function should return boolean'
);

SELECT function_returns(
    'prettygood', 'add_artist_to_library', ARRAY['uuid'], 'boolean',
    'add_artist_to_library function should return boolean'
);

SELECT function_returns(
    'prettygood', 'tip_artist', ARRAY['uuid', 'numeric', 'text', 'uuid', 'uuid', 'text'], 'prettygood.payments',
    'tip_artist function should return payments type'
);

SELECT function_returns(
    'prettygood', 'get_recommendations', ARRAY['integer'], 'SETOF prettygood.tracks',
    'get_recommendations function should return a set of tracks'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
