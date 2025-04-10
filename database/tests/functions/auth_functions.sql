-- Test file: auth_functions.sql
-- Description: Tests for authentication functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(9);

-- Test for auth functions existence
SELECT has_function(
    'prettygood', 'register_user', ARRAY['text', 'text', 'text'],
    'register_user function should exist'
);

SELECT has_function(
    'prettygood', 'generate_nonce', ARRAY['text'],
    'generate_nonce function should exist'
);

SELECT has_function(
    'prettygood', 'verify_signature', ARRAY['text', 'text'],
    'verify_signature function should exist'
);

SELECT has_function(
    'prettygood', 'authenticate_wallet', ARRAY['text', 'text'],
    'authenticate_wallet function should exist'
);

SELECT has_function(
    'prettygood', 'refresh_token', ARRAY[],
    'refresh_token function should exist'
);

SELECT has_function(
    'auth', 'generate_jwt', ARRAY['uuid', 'text', 'integer'],
    'generate_jwt function should exist'
);

SELECT has_function(
    'auth', 'verify_wallet_signature', ARRAY['text', 'text', 'text'],
    'verify_wallet_signature function should exist'
);

SELECT function_returns(
    'prettygood', 'register_user', ARRAY['text', 'text', 'text'], 'prettygood.users',
    'register_user function should return users type'
);

SELECT function_returns(
    'prettygood', 'authenticate_wallet', ARRAY['text', 'text'], 'text',
    'authenticate_wallet function should return text (JWT token)'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
