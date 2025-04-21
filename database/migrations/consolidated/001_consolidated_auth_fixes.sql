-- Migration: 001_consolidated_auth_fixes.sql
-- Description: Consolidates fixes from migrations 025, 026, 027, 029, 033, and 036
-- This migration replaces the following original migrations:
-- - 025_fix_register_user_ambiguous_column.sql
-- - 026_fix_ambiguous_columns.sql
-- - 027_fix_authenticate_user_function.sql
-- - 029_fix_token_refresh.sql
-- - 033_fix_user_role_field.sql
-- - 036_clean_token_generation.sql

-- Set search path to access schemas
SET search_path TO prettygood, prettygood_private, public, auth;

-- Ensure pgcrypto extension is installed (required for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, ensure users table has role field if not already present
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'prettygood' 
                AND table_name = 'users'
                AND column_name = 'role') THEN
        ALTER TABLE prettygood.users ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Fix: Add proper email_verified field if missing
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'prettygood' 
                AND table_name = 'users'
                AND column_name = 'email_verified') THEN
        ALTER TABLE prettygood.users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Function to securely get JWT secret
CREATE OR REPLACE FUNCTION auth.get_jwt_secret() RETURNS TEXT AS $$
DECLARE _secret TEXT;
BEGIN
    -- Try to get the secret from environment variable
    BEGIN
        _secret := CURRENT_SETTING('app.jwt_secret', true);
        
        -- If we get here, we got a value from the app settings
        IF _secret IS NULL OR _secret = '' THEN
            -- Fall back to secrets table
            IF EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'auth'
                AND table_name = 'secrets'
                AND column_name = 'jwt_secret'
            ) THEN
                SELECT jwt_secret INTO _secret
                FROM auth.secrets
                WHERE id = 1;
            END IF;

            -- If still null, use a default (not recommended for production)
            IF _secret IS NULL THEN
                RAISE WARNING 'No JWT secret found in environment variable or secrets table. Using fallback secret.';
                _secret := 'temporary_fallback_secret_please_set_environment_variable';
            END IF;
        END IF;

    EXCEPTION
    WHEN OTHERS THEN
        -- If we can't get the environment variable, fall back to secrets table
        IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'auth'
            AND table_name = 'secrets'
            AND column_name = 'jwt_secret'
        ) THEN
            SELECT jwt_secret INTO _secret
            FROM auth.secrets
            WHERE id = 1;
        END IF;

        -- If still null, use a default (not recommended for production)
        IF _secret IS NULL THEN
            RAISE WARNING 'No JWT secret found in environment variable or secrets table. Using fallback secret.';
            _secret := 'temporary_fallback_secret_please_set_environment_variable';
        END IF;
    END;

    RETURN _secret;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated JWT generation with proper base64url encoding and signature handling
CREATE OR REPLACE FUNCTION auth.generate_jwt(
    user_id UUID,
    role TEXT DEFAULT 'user',
    exp INTEGER DEFAULT 3600 -- 1 hour expiration by default
) RETURNS TEXT AS $$
DECLARE
    _secret TEXT := auth.get_jwt_secret();
    _algorithm TEXT := 'sha256';  -- Using SHA256 which is secure and available
    _header_json TEXT;
    _payload_json TEXT;
    _header_encoded TEXT;
    _payload_encoded TEXT;
    _signature TEXT;
    _is_email_verified BOOLEAN;
BEGIN
    -- Get email verification status
    SELECT email_verified INTO _is_email_verified
    FROM prettygood.users
    WHERE id = user_id;

    -- Create the JWT header and payload as JSON strings
    _header_json := '{"alg":"HS256","typ":"JWT"}';
    
    _payload_json := json_build_object(
        'sub', user_id,
        'role', role,
        'username', (SELECT username FROM prettygood.users WHERE id = user_id),
        'email', (SELECT email FROM prettygood.users WHERE id = user_id),
        'email_verified', COALESCE(_is_email_verified, FALSE),
        'wallet_address', (SELECT wallet_address FROM prettygood.users WHERE id = user_id),
        'exp', extract(epoch from now())::integer + exp,
        'iat', extract(epoch from now())::integer
    )::text;

    -- Base64url encode the header and payload (proper URL-safe encoding)
    _header_encoded := replace(replace(encode(_header_json::bytea, 'base64'), '+', '-'), '/', '_');
    _header_encoded := rtrim(_header_encoded, '=');
    
    _payload_encoded := replace(replace(encode(_payload_json::bytea, 'base64'), '+', '-'), '/', '_');
    _payload_encoded := rtrim(_payload_encoded, '=');

    -- Create the signature using HMAC with SHA256 with proper base64url encoding
    _signature := hmac(_header_encoded || '.' || _payload_encoded, _secret, _algorithm);
    _signature := replace(replace(encode(_signature, 'base64'), '+', '-'), '/', '_');
    _signature := rtrim(_signature, '=');

    -- Return the complete JWT
    RETURN _header_encoded || '.' || _payload_encoded || '.' || _signature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix account lockout check function
DROP FUNCTION IF EXISTS prettygood_private.check_account_lockout(uuid);

CREATE OR REPLACE FUNCTION prettygood_private.check_account_lockout(_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    _is_locked BOOLEAN;
    _lockout_until TIMESTAMPTZ;
    _reset_after INTERVAL := INTERVAL '30 minutes';
BEGIN
    -- Get lock status for user
    SELECT 
        COALESCE(locked_until > NOW(), FALSE),
        locked_until
    INTO _is_locked, _lockout_until
    FROM prettygood_private.user_auth a
    WHERE a.user_id = _user_id;
    
    -- If account is locked, return locked status
    IF _is_locked THEN
        RETURN TRUE;
    END IF;
    
    -- Check if we should reset failed attempts (after 30 minutes of no failures)
    UPDATE prettygood_private.user_auth a
    SET failed_login_attempts = 0
    WHERE 
        a.user_id = _user_id AND
        a.last_failed_attempt < NOW() - _reset_after;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Fix record failed login function
DROP FUNCTION IF EXISTS prettygood_private.record_failed_login(uuid);

CREATE OR REPLACE FUNCTION prettygood_private.record_failed_login(_user_id UUID)
RETURNS VOID AS $$
DECLARE
    _current_attempts INTEGER;
    _max_attempts CONSTANT INTEGER := 5;
    _lockout_duration INTERVAL := INTERVAL '15 minutes';
BEGIN
    -- Update failed attempts count
    UPDATE prettygood_private.user_auth a
    SET 
        failed_login_attempts = a.failed_login_attempts + 1,
        last_failed_attempt = NOW()
    WHERE a.user_id = _user_id
    RETURNING a.failed_login_attempts INTO _current_attempts;
    
    -- If max attempts reached, lock the account
    IF _current_attempts >= _max_attempts THEN
        UPDATE prettygood_private.user_auth a
        SET locked_until = NOW() + _lockout_duration
        WHERE a.user_id = _user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fix authenticate_user function with explicit table aliases
DROP FUNCTION IF EXISTS prettygood.authenticate_user(text, text);

CREATE OR REPLACE FUNCTION prettygood.authenticate_user(
    _email_or_username TEXT,
    _password TEXT
) RETURNS TEXT AS $$
DECLARE
    _user_id UUID;
    _stored_password_hash TEXT;
    _user_role TEXT;
    _is_locked BOOLEAN;
BEGIN
    -- Get the user_id and password hash with explicit table aliases for all columns
    SELECT u.id, a.password_hash INTO _user_id, _stored_password_hash
    FROM prettygood.users u
    JOIN prettygood_private.user_auth a ON u.id = a.user_id
    WHERE (u.email = _email_or_username OR u.username = _email_or_username);
    
    -- Check if user exists
    IF _user_id IS NULL THEN
        RAISE EXCEPTION 'Invalid email/username or password';
    END IF;
    
    -- Check if account is locked
    _is_locked := prettygood_private.check_account_lockout(_user_id);
    IF _is_locked THEN
        RAISE EXCEPTION 'Account is temporarily locked due to too many failed login attempts. Please try again later.';
    END IF;
    
    -- Verify password
    IF _stored_password_hash IS NULL OR _stored_password_hash != crypt(_password, _stored_password_hash) THEN
        -- Record failed login attempt
        PERFORM prettygood_private.record_failed_login(_user_id);
        RAISE EXCEPTION 'Invalid email/username or password';
    END IF;
    
    -- Get user role directly from the users table
    SELECT role INTO _user_role FROM prettygood.users WHERE id = _user_id;
    
    -- If user is an artist, ensure role is set to 'artist'
    IF EXISTS (SELECT 1 FROM prettygood.artists WHERE id = _user_id) AND _user_role != 'artist' THEN
        UPDATE prettygood.users SET role = 'artist' WHERE id = _user_id;
        _user_role := 'artist';
    END IF;
    
    -- Reset failed login attempts and update last sign in time
    UPDATE prettygood_private.user_auth a
    SET 
        failed_login_attempts = 0,
        last_sign_in = NOW(),
        last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
    WHERE a.user_id = _user_id;
    
    -- Generate JWT token
    RETURN auth.generate_jwt(_user_id, _user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix register_user function with explicit parameter names
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text, text, text);
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text, text);
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text);

CREATE OR REPLACE FUNCTION prettygood.register_user(
    _username TEXT,
    _email TEXT,
    _password TEXT,
    _display_name TEXT DEFAULT NULL,
    _wallet_address TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    _user_id UUID;
    _verification_token TEXT;
BEGIN
    -- Validate inputs
    IF _username IS NULL OR LENGTH(TRIM(_username)) < 3 THEN
        RAISE EXCEPTION 'Username must be at least 3 characters long';
    END IF;

    IF _email IS NULL OR _email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    IF _password IS NULL OR LENGTH(_password) < 8 THEN
        RAISE EXCEPTION 'Password must be at least 8 characters long';
    END IF;

    -- Check if username or email already exists
    IF EXISTS (SELECT 1 FROM prettygood.users WHERE username = _username) THEN
        RAISE EXCEPTION 'Username already exists';
    END IF;

    IF EXISTS (SELECT 1 FROM prettygood.users WHERE email = _email) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;

    -- Insert new user
    INSERT INTO prettygood.users (
        username,
        email,
        display_name,
        wallet_address,
        email_verified,
        role
    ) 
    VALUES (
        _username,
        _email,
        COALESCE(_display_name, _username),
        _wallet_address,
        FALSE,
        'user'
    )
    RETURNING id INTO _user_id;

    -- Create auth entry with hashed password
    INSERT INTO prettygood_private.user_auth (
        user_id,
        password_hash,
        nonce_created_at
    ) 
    VALUES (
        _user_id,
        crypt(_password, gen_salt('bf')), -- Use Blowfish algorithm for hashing
        NOW()
    );
    
    -- Generate email verification token
    _verification_token := prettygood.create_email_verification_token(_user_id);
    
    -- Return user id and verification token
    RETURN json_build_object(
        'user_id', _user_id,
        'verification_token', _verification_token
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix token refresh function
DROP FUNCTION IF EXISTS prettygood.refresh_token(TEXT);

CREATE OR REPLACE FUNCTION prettygood.refresh_token(current_token TEXT)
RETURNS TEXT AS $$
DECLARE
    _user_id UUID;
    _role TEXT;
    _payload JSON;
BEGIN
    -- Try to validate the token and extract the user ID
    BEGIN
        -- Extract user data from current token using the updated auth.verify_jwt function
        _payload := auth.verify_jwt(current_token);
        
        -- Extract the user ID from the sub claim
        _user_id := (_payload->>'sub')::UUID;
        
        -- If no user_id found, token is invalid
        IF _user_id IS NULL THEN
            RAISE EXCEPTION 'Invalid token';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Invalid token';  -- Simplified error message for security
    END;
    
    -- Get user role
    SELECT role INTO _role FROM prettygood.users WHERE id = _user_id;
    
    -- If user not found, token is invalid
    IF _role IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Generate a new JWT token with same claims but new expiration
    -- using the auth.generate_jwt function which uses the correct secret and algorithm
    RETURN auth.generate_jwt(
        _user_id,
        _role,
        86400  -- 24 hours expiration
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify JWT function with proper base64url handling
DROP FUNCTION IF EXISTS auth.verify_jwt(text, text);

CREATE OR REPLACE FUNCTION auth.verify_jwt(token TEXT, secret TEXT DEFAULT NULL) 
RETURNS JSON AS $$
DECLARE
    _header_part TEXT;
    _payload_part TEXT;
    _signature_part TEXT;
    _payload BYTEA;
    _payload_json JSON;
    _algorithm TEXT := 'sha256';
    _actual_secret TEXT;
    _expected_signature TEXT;
BEGIN
    -- Get the secret if not provided
    IF secret IS NULL THEN 
        _actual_secret := auth.get_jwt_secret();
    ELSE 
        _actual_secret := secret;
    END IF;

    -- Split the token
    _header_part := split_part(token, '.', 1);
    _payload_part := split_part(token, '.', 2);
    _signature_part := split_part(token, '.', 3);

    -- Calculate expected signature with proper base64url handling
    _expected_signature := hmac(_header_part || '.' || _payload_part, _actual_secret, _algorithm);
    _expected_signature := replace(replace(encode(_expected_signature, 'base64'), '+', '-'), '/', '_');
    _expected_signature := rtrim(_expected_signature, '=');

    -- Verify signature
    IF _signature_part != _expected_signature THEN
        RAISE EXCEPTION 'Invalid signature';
    END IF;

    -- Add padding back for base64 decoding if needed
    CASE length(_payload_part) % 4
        WHEN 0 THEN -- No padding needed
        WHEN 2 THEN _payload_part := _payload_part || '==';
        WHEN 3 THEN _payload_part := _payload_part || '=';
        ELSE RAISE EXCEPTION 'Invalid base64 string length';
    END CASE;

    -- Replace URL-safe chars with standard base64 chars
    _payload_part := replace(replace(_payload_part, '-', '+'), '_', '/');

    -- Decode the payload
    _payload := decode(_payload_part, 'base64');

    -- Convert to JSON
    _payload_json := convert_from(_payload, 'UTF8')::JSON;

    -- Verify token has not expired
    IF _payload_json->>'exp' IS NOT NULL 
       AND (_payload_json->>'exp')::numeric < extract(epoch from now()) THEN
        RAISE EXCEPTION 'Token has expired';
    END IF;

    RETURN _payload_json;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update current_user_id function to properly handle JWTs
CREATE OR REPLACE FUNCTION prettygood_private.current_user_id() 
RETURNS UUID AS $$
    -- Extract user_id from JWT claims, handling both 'user_id' and 'sub' claim names
    SELECT 
        COALESCE(
            NULLIF(current_setting('request.jwt.claims', TRUE)::json->>'user_id', '')::UUID,
            NULLIF(current_setting('request.jwt.claims', TRUE)::json->>'sub', '')::UUID
        );
$$ LANGUAGE SQL STABLE;

-- Update is_authenticated function
CREATE OR REPLACE FUNCTION prettygood_private.is_authenticated() 
RETURNS BOOLEAN AS $$
    SELECT prettygood_private.current_user_id() IS NOT NULL;
$$ LANGUAGE SQL STABLE;

-- Update is_admin function to account for role field in users table
CREATE OR REPLACE FUNCTION prettygood_private.is_admin() 
RETURNS BOOLEAN AS $$
    SELECT (current_setting('request.jwt.claims', TRUE)::json->>'role') = 'admin';
$$ LANGUAGE SQL STABLE;

-- Update is_artist function to check both the artists table and role field
CREATE OR REPLACE FUNCTION prettygood_private.is_artist() 
RETURNS BOOLEAN AS $$
    SELECT 
        (current_setting('request.jwt.claims', TRUE)::json->>'role') = 'artist' OR
        EXISTS (
            SELECT 1 FROM prettygood.artists 
            WHERE id = prettygood_private.current_user_id()
        );
$$ LANGUAGE SQL STABLE;

-- Add comments for documentation
COMMENT ON FUNCTION auth.get_jwt_secret IS 'Gets the JWT secret from the app.jwt_secret environment variable or falls back to the secrets table.
To set the environment variable in PostgreSQL:
ALTER DATABASE your_database_name SET app.jwt_secret = ''your_secret_here'';
-- Or for the current session only:
SET app.jwt_secret = ''your_secret_here'';';

COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a JWT token for a user with the specified role and expiration using SHA256 for signatures';
COMMENT ON FUNCTION auth.verify_jwt IS 'Verifies a JWT token and returns the payload if valid';
COMMENT ON FUNCTION prettygood_private.check_account_lockout IS 'Checks if an account is locked and handles automatic unlocking';
COMMENT ON FUNCTION prettygood_private.record_failed_login IS 'Records a failed login attempt and handles account lockout if needed';
COMMENT ON FUNCTION prettygood.authenticate_user IS 'Authenticates a user with email/username and password, returns JWT on success';
COMMENT ON FUNCTION prettygood.register_user IS 'Registers a new user with email/password authentication and returns user ID and verification token';
COMMENT ON FUNCTION prettygood.refresh_token IS 'Refreshes a JWT token with a new expiration time if the current token is valid';
COMMENT ON FUNCTION prettygood_private.current_user_id IS 'Gets the user ID from the JWT claims';
COMMENT ON FUNCTION prettygood_private.is_authenticated IS 'Checks if the current request is authenticated';
COMMENT ON FUNCTION prettygood_private.is_admin IS 'Checks if the current user has the admin role';
COMMENT ON FUNCTION prettygood_private.is_artist IS 'Checks if the current user is an artist';
