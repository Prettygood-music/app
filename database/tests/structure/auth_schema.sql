-- Test file: auth_schema.sql
-- Description: Tests for authentication schema and related tables

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(35);

-- Test for auth-related tables
SELECT has_table('prettygood_private', 'user_auth', 'Table user_auth should exist');
SELECT has_table('prettygood_private', 'email_verification_tokens', 'Table email_verification_tokens should exist');

-- Test primary keys
SELECT has_pk('prettygood_private', 'user_auth', 'Table user_auth should have a primary key');
SELECT has_pk('prettygood_private', 'email_verification_tokens', 'Table email_verification_tokens should have a primary key');

-- Test core columns for user_auth table
SELECT has_column('prettygood_private', 'user_auth', 'user_id', 'user_auth table should have user_id column');
SELECT has_column('prettygood_private', 'user_auth', 'password_hash', 'user_auth table should have password_hash column');
SELECT has_column('prettygood_private', 'user_auth', 'password_salt', 'user_auth table should have password_salt column');
SELECT has_column('prettygood_private', 'user_auth', 'nonce', 'user_auth table should have nonce column');
SELECT has_column('prettygood_private', 'user_auth', 'nonce_created_at', 'user_auth table should have nonce_created_at column');
SELECT has_column('prettygood_private', 'user_auth', 'last_sign_in', 'user_auth table should have last_sign_in column');
SELECT has_column('prettygood_private', 'user_auth', 'last_sign_in_ip', 'user_auth table should have last_sign_in_ip column');
SELECT has_column('prettygood_private', 'user_auth', 'reset_token', 'user_auth table should have reset_token column');
SELECT has_column('prettygood_private', 'user_auth', 'reset_token_expires_at', 'user_auth table should have reset_token_expires_at column');
SELECT has_column('prettygood_private', 'user_auth', 'failed_login_attempts', 'user_auth table should have failed_login_attempts column');
SELECT has_column('prettygood_private', 'user_auth', 'last_failed_attempt', 'user_auth table should have last_failed_attempt column');
SELECT has_column('prettygood_private', 'user_auth', 'locked_until', 'user_auth table should have locked_until column');

-- Test column types and constraints for user_auth
SELECT col_is_pk('prettygood_private', 'user_auth', 'user_id', 'user_id column should be the primary key');
SELECT col_is_fk('prettygood_private', 'user_auth', 'user_id', 'user_id column should be a foreign key');
SELECT col_type_is('prettygood_private', 'user_auth', 'user_id', 'uuid', 'user_id column should be type uuid');
SELECT col_type_is('prettygood_private', 'user_auth', 'password_hash', 'text', 'password_hash column should be type text');
SELECT col_type_is('prettygood_private', 'user_auth', 'password_salt', 'text', 'password_salt column should be type text');
SELECT col_type_is('prettygood_private', 'user_auth', 'reset_token', 'text', 'reset_token column should be type text');
SELECT col_type_is('prettygood_private', 'user_auth', 'reset_token_expires_at', 'timestamp with time zone', 'reset_token_expires_at column should be type timestamptz');
SELECT col_type_is('prettygood_private', 'user_auth', 'failed_login_attempts', 'integer', 'failed_login_attempts column should be type integer');
SELECT col_has_default('prettygood_private', 'user_auth', 'failed_login_attempts', 'failed_login_attempts column should have a default value');

-- Test core columns for email_verification_tokens table
SELECT has_column('prettygood_private', 'email_verification_tokens', 'id', 'email_verification_tokens table should have id column');
SELECT has_column('prettygood_private', 'email_verification_tokens', 'user_id', 'email_verification_tokens table should have user_id column');
SELECT has_column('prettygood_private', 'email_verification_tokens', 'token', 'email_verification_tokens table should have token column');
SELECT has_column('prettygood_private', 'email_verification_tokens', 'created_at', 'email_verification_tokens table should have created_at column');
SELECT has_column('prettygood_private', 'email_verification_tokens', 'expires_at', 'email_verification_tokens table should have expires_at column');

-- Test column types and constraints for email_verification_tokens
SELECT col_is_pk('prettygood_private', 'email_verification_tokens', 'id', 'id column should be the primary key');
SELECT col_is_fk('prettygood_private', 'email_verification_tokens', 'user_id', 'user_id column should be a foreign key');
SELECT col_type_is('prettygood_private', 'email_verification_tokens', 'id', 'uuid', 'id column should be type uuid');
SELECT col_type_is('prettygood_private', 'email_verification_tokens', 'user_id', 'uuid', 'user_id column should be type uuid');
SELECT col_type_is('prettygood_private', 'email_verification_tokens', 'token', 'text', 'token column should be type text');
SELECT col_is_unique('prettygood_private', 'email_verification_tokens', 'token', 'token column should be unique');
SELECT col_has_default('prettygood_private', 'email_verification_tokens', 'expires_at', 'expires_at column should have a default value');

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
