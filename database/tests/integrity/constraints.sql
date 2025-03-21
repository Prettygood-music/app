-- Test file: constraints.sql
-- Description: Tests for data integrity constraints

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(12);

-- Setup test fixtures
SET client_min_messages TO warning;

-- Test foreign key constraints
SELECT col_is_fk('prettygood', 'artists', 'id', 
    'artists.id should be a foreign key to users.id');
    
SELECT col_is_fk('prettygood', 'albums', 'artist_id', 
    'albums.artist_id should be a foreign key to artists.id');
    
SELECT col_is_fk('prettygood', 'tracks', 'artist_id', 
    'tracks.artist_id should be a foreign key to artists.id');
    
SELECT col_is_fk('prettygood', 'tracks', 'album_id', 
    'tracks.album_id should be a foreign key to albums.id');
    
SELECT col_is_fk('prettygood', 'playlists', 'user_id', 
    'playlists.user_id should be a foreign key to users.id');
    
SELECT col_is_fk('prettygood', 'playlist_tracks', 'playlist_id', 
    'playlist_tracks.playlist_id should be a foreign key to playlists.id');
    
SELECT col_is_fk('prettygood', 'playlist_tracks', 'track_id', 
    'playlist_tracks.track_id should be a foreign key to tracks.id');
    
SELECT col_is_fk('prettygood', 'user_settings', 'user_id', 
    'user_settings.user_id should be a foreign key to users.id');

-- Test unique constraints
SELECT col_is_unique('prettygood', 'users', 'wallet_address', 
    'users.wallet_address should be unique');
    
SELECT col_is_unique('prettygood', 'users', 'username', 
    'users.username should be unique');
    
-- Test check constraints
SELECT col_has_check('prettygood', 'tracks', 'duration', 
    'tracks.duration should have a check constraint');
    
SELECT col_has_check('prettygood', 'albums', 'type', 
    'albums.type should have a check constraint');

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
