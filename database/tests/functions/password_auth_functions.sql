-- Test file: password_auth_functions.sql
-- Description: Tests for password authentication functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(15);

-- Test for auth functions existence
SELECT has_function(
    'prettygood', 'register_user', ARRAY['text', 'text', 'text', 'text', 'text'],
    'register_user function should exist with correct parameters'
);

SELECT has_function(
    'prettygood', 'authenticate_user', ARRAY['text', 'text'],
    'authenticate_user function should exist'
);

SELECT has_function(
    'prettygood', 'verify_email', ARRAY['text'],
    'verify_email function should exist'
);

SELECT has_function(
    'prettygood', 'create_email_verification_token', ARRAY['uuid'],
    'create_email_verification_token function should exist'
);

SELECT has_function(
    'prettygood', 'request_password_reset', ARRAY['text'],
    'request_password_reset function should exist'
);

SELECT has_function(
    'prettygood', 'reset_password', ARRAY['text', 'text'],
    'reset_password function should exist'
);

SELECT has_function(
    'prettygood_private', 'check_account_lockout', ARRAY['uuid'],
    'check_account_lockout function should exist'
);

SELECT has_function(
    'prettygood_private', 'record_failed_login', ARRAY['uuid'],
    'record_failed_login function should exist'
);

-- Test function return types
SELECT function_returns(
    'prettygood', 'register_user', ARRAY['text', 'text', 'text', 'text', 'text'], 'json',
    'register_user function should return json'
);

SELECT function_returns(
    'prettygood', 'authenticate_user', ARRAY['text', 'text'], 'text',
    'authenticate_user function should return text (JWT token)'
);

SELECT function_returns(
    'prettygood', 'verify_email', ARRAY['text'], 'boolean',
    'verify_email function should return boolean'
);

SELECT function_returns(
    'prettygood', 'request_password_reset', ARRAY['text'], 'text',
    'request_password_reset function should return text (reset token)'
);

SELECT function_returns(
    'prettygood', 'reset_password', ARRAY['text', 'text'], 'boolean',
    'reset_password function should return boolean'
);

SELECT function_returns(
    'prettygood_private', 'check_account_lockout', ARRAY['uuid'], 'boolean',
    'check_account_lockout function should return boolean'
);

SELECT function_returns(
    'prettygood_private', 'record_failed_login', ARRAY['uuid'], 'void',
    'record_failed_login function should return void'
);

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
