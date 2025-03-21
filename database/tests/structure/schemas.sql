-- Test file: schemas.sql
-- Description: Tests for schema structure

-- Start transaction
BEGIN;

-- Load pgTAP
SELECT plan(7);

-- Test for schemas
SELECT has_schema('prettygood', 'Schema prettygood should exist');
SELECT has_schema('prettygood_private', 'Schema prettygood_private should exist');
SELECT has_schema('auth', 'Schema auth should exist');

-- Test for schema permissions
SELECT schema_privs_are(
    'api_user', 'prettygood', ARRAY['USAGE'],
    'api_user should have USAGE permission on prettygood schema'
);

SELECT schema_privs_are(
    'api_user', 'prettygood_private', ARRAY['USAGE'],
    'api_user should have USAGE permission on prettygood_private schema'
);

SELECT schema_privs_are(
    'anon', 'prettygood', ARRAY['USAGE'],
    'anon should have USAGE permission on prettygood schema'
);

SELECT schema_privs_are(
    'authenticated', 'prettygood', ARRAY['USAGE'],
    'authenticated should have USAGE permission on prettygood schema'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
