-- Test file: tables.sql
-- Description: Tests for core table structure

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(20);

-- Test for core tables
SELECT has_table('prettygood', 'users', 'Table users should exist');
SELECT has_table('prettygood', 'artists', 'Table artists should exist');
SELECT has_table('prettygood', 'albums', 'Table albums should exist');
SELECT has_table('prettygood', 'tracks', 'Table tracks should exist');
SELECT has_table('prettygood', 'playlists', 'Table playlists should exist');
SELECT has_table('prettygood', 'playlist_tracks', 'Table playlist_tracks should exist');
SELECT has_table('prettygood', 'payments', 'Table payments should exist');
SELECT has_table('prettygood', 'user_settings', 'Table user_settings should exist');

-- Test for private tables
SELECT has_table('prettygood_private', 'user_auth', 'Table user_auth should exist');
SELECT has_table('prettygood_private', 'payment_status_history', 'Table payment_status_history should exist');
SELECT has_table('prettygood_private', 'migrations', 'Table migrations should exist');

-- Test for primary keys
SELECT has_pk('prettygood', 'users', 'Table users should have a primary key');
SELECT has_pk('prettygood', 'artists', 'Table artists should have a primary key');
SELECT has_pk('prettygood', 'albums', 'Table albums should have a primary key');
SELECT has_pk('prettygood', 'tracks', 'Table tracks should have a primary key');
SELECT has_pk('prettygood', 'playlists', 'Table playlists should have a primary key');
SELECT has_pk('prettygood', 'playlist_tracks', 'Table playlist_tracks should have a primary key');
SELECT has_pk('prettygood', 'payments', 'Table payments should have a primary key');
SELECT has_pk('prettygood', 'user_settings', 'Table user_settings should have a primary key');
SELECT has_pk('prettygood_private', 'user_auth', 'Table user_auth should have a primary key');

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
