-- Test file: columns.sql
-- Description: Tests for column structure of key tables

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(40);

-- Test core columns for users table
SELECT has_column('prettygood', 'users', 'id', 'users table should have id column');
SELECT has_column('prettygood', 'users', 'wallet_address', 'users table should have wallet_address column');
SELECT has_column('prettygood', 'users', 'username', 'users table should have username column');
SELECT has_column('prettygood', 'users', 'created_at', 'users table should have created_at column');
SELECT has_column('prettygood', 'users', 'updated_at', 'users table should have updated_at column');

SELECT col_is_pk('prettygood', 'users', 'id', 'id column should be the primary key');
SELECT col_is_unique('prettygood', 'users', 'wallet_address', 'wallet_address column should be unique');
SELECT col_is_unique('prettygood', 'users', 'username', 'username column should be unique');
SELECT col_type_is('prettygood', 'users', 'id', 'uuid', 'id column should be type uuid');
SELECT col_type_is('prettygood', 'users', 'wallet_address', 'text', 'wallet_address column should be type text');

-- Test core columns for artists table
SELECT has_column('prettygood', 'artists', 'id', 'artists table should have id column');
SELECT has_column('prettygood', 'artists', 'artist_name', 'artists table should have artist_name column');
SELECT has_column('prettygood', 'artists', 'bio', 'artists table should have bio column');
SELECT has_column('prettygood', 'artists', 'genre', 'artists table should have genre column');
SELECT has_column('prettygood', 'artists', 'verified', 'artists table should have verified column');

SELECT col_is_pk('prettygood', 'artists', 'id', 'id column should be the primary key');
SELECT col_is_fk('prettygood', 'artists', 'id', 'id column should be a foreign key to users');
SELECT col_type_is('prettygood', 'artists', 'id', 'uuid', 'id column should be type uuid');
SELECT col_type_is('prettygood', 'artists', 'artist_name', 'text', 'artist_name column should be type text');
SELECT col_type_is('prettygood', 'artists', 'genre', 'text[]', 'genre column should be type text array');

-- Test core columns for tracks table
SELECT has_column('prettygood', 'tracks', 'id', 'tracks table should have id column');
SELECT has_column('prettygood', 'tracks', 'title', 'tracks table should have title column');
SELECT has_column('prettygood', 'tracks', 'artist_id', 'tracks table should have artist_id column');
SELECT has_column('prettygood', 'tracks', 'album_id', 'tracks table should have album_id column');
SELECT has_column('prettygood', 'tracks', 'duration', 'tracks table should have duration column');
SELECT has_column('prettygood', 'tracks', 'audio_url', 'tracks table should have audio_url column');

SELECT col_is_pk('prettygood', 'tracks', 'id', 'id column should be the primary key');
SELECT col_is_fk('prettygood', 'tracks', 'artist_id', 'artist_id column should be a foreign key');
SELECT col_is_fk('prettygood', 'tracks', 'album_id', 'album_id column should be a foreign key');
SELECT col_type_is('prettygood', 'tracks', 'id', 'uuid', 'id column should be type uuid');
SELECT col_type_is('prettygood', 'tracks', 'title', 'text', 'title column should be type text');
SELECT col_type_is('prettygood', 'tracks', 'duration', 'integer', 'duration column should be type integer');

-- Test core columns for playlists table
SELECT has_column('prettygood', 'playlists', 'id', 'playlists table should have id column');
SELECT has_column('prettygood', 'playlists', 'name', 'playlists table should have name column');
SELECT has_column('prettygood', 'playlists', 'user_id', 'playlists table should have user_id column');
SELECT has_column('prettygood', 'playlists', 'is_public', 'playlists table should have is_public column');
SELECT has_column('prettygood', 'playlists', 'collaborative', 'playlists table should have collaborative column');

SELECT col_is_pk('prettygood', 'playlists', 'id', 'id column should be the primary key');
SELECT col_is_fk('prettygood', 'playlists', 'user_id', 'user_id column should be a foreign key');
SELECT col_has_default('prettygood', 'playlists', 'is_public', 'is_public column should have a default value');

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
