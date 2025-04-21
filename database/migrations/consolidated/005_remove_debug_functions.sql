-- Migration: 005_remove_debug_functions.sql
-- Description: Removes debug functions and utilities that should not be present in production
-- This migration replaces:
-- - 030_add_jwt_debug_functions.sql
-- - 031_debug_refresh_token.sql
-- - 034_detailed_token_tracing.sql
-- and cleans up other debug functions

-- Set search path
SET search_path TO prettygood, prettygood_private, public, auth;

-- Drop debug functions if they exist
DROP FUNCTION IF EXISTS auth.debug_jwt(text, text);
DROP FUNCTION IF EXISTS auth.decode_jwt_payload(text);
DROP FUNCTION IF EXISTS auth.trace_token_validation(text);
DROP FUNCTION IF EXISTS auth.trace_token_generation(uuid, text, integer);
DROP FUNCTION IF EXISTS prettygood.debug_refresh_token(text);
DROP FUNCTION IF EXISTS prettygood.debug_current_token();
DROP FUNCTION IF EXISTS auth.debug_hmac(text, text, text);
DROP FUNCTION IF EXISTS auth.debug_jwt_parts(text);
DROP FUNCTION IF EXISTS auth.debug_base64url(text);
DROP FUNCTION IF EXISTS auth.debug_current_settings();

-- Add proper logging to critical auth functions without exposing sensitive data
-- Replace debug functions with proper, secure logging if needed

-- Function to handle login failures with appropriate logging
CREATE OR REPLACE FUNCTION prettygood_private.log_auth_event(
    event_type TEXT,
    user_id UUID DEFAULT NULL, 
    details JSONB DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    sanitized_details JSONB;
BEGIN
    -- Remove sensitive data from logging
    IF details IS NOT NULL THEN
        sanitized_details := jsonb_strip_nulls(details - 'password' - 'token' - 'signature');
    ELSE
        sanitized_details := '{}'::jsonb;
    END IF;
    
    -- Insert log into auth_log table
    INSERT INTO prettygood_private.auth_log (
        event_type,
        user_id,
        ip_address,
        user_agent,
        details
    ) VALUES (
        event_type,
        user_id,
        current_setting('request.headers', TRUE)::json->>'x-forwarded-for',
        current_setting('request.headers', TRUE)::json->>'user-agent',
        sanitized_details
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create auth log table if it doesn't exist
CREATE TABLE IF NOT EXISTS prettygood_private.auth_log (
    id BIGSERIAL PRIMARY KEY,
    event_time TIMESTAMPTZ DEFAULT NOW(),
    event_type TEXT NOT NULL,
    user_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB
);

-- Create index on auth log for better query performance
CREATE INDEX IF NOT EXISTS idx_auth_log_user_id ON prettygood_private.auth_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_log_event_type ON prettygood_private.auth_log(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_log_event_time ON prettygood_private.auth_log(event_time);

-- Update the authenticate_user function to use the logging system
CREATE OR REPLACE FUNCTION prettygood.authenticate_user(
    _email_or_username TEXT,
    _password TEXT
) RETURNS TEXT AS $$
DECLARE
    _user_id UUID;
    _stored_password_hash TEXT;
    _user_role TEXT;
    _is_locked BOOLEAN;
    _token TEXT;
BEGIN
    -- Get the user_id and password hash
    SELECT u.id, a.password_hash INTO _user_id, _stored_password_hash
    FROM prettygood.users u
    JOIN prettygood_private.user_auth a ON u.id = a.user_id
    WHERE (u.email = _email_or_username OR u.username = _email_or_username);
    
    -- Check if user exists
    IF _user_id IS NULL THEN
        -- Log failed login attempt (user not found)
        PERFORM prettygood_private.log_auth_event(
            'login_failed',
            NULL,
            jsonb_build_object(
                'reason', 'user_not_found',
                'identifier', _email_or_username
            )
        );
        RAISE EXCEPTION 'Invalid email/username or password';
    END IF;
    
    -- Check if account is locked
    _is_locked := prettygood_private.check_account_lockout(_user_id);
    IF _is_locked THEN
        -- Log failed login attempt (account locked)
        PERFORM prettygood_private.log_auth_event(
            'login_failed',
            _user_id,
            jsonb_build_object(
                'reason', 'account_locked'
            )
        );
        RAISE EXCEPTION 'Account is temporarily locked due to too many failed login attempts. Please try again later.';
    END IF;
    
    -- Verify password
    IF _stored_password_hash IS NULL OR _stored_password_hash != crypt(_password, _stored_password_hash) THEN
        -- Record failed login attempt
        PERFORM prettygood_private.record_failed_login(_user_id);
        
        -- Log failed login attempt (wrong password)
        PERFORM prettygood_private.log_auth_event(
            'login_failed',
            _user_id,
            jsonb_build_object(
                'reason', 'invalid_password'
            )
        );
        RAISE EXCEPTION 'Invalid email/username or password';
    END IF;
    
    -- Get user role
    SELECT role INTO _user_role FROM prettygood.users WHERE id = _user_id;
    
    -- Reset failed login attempts and update last sign in time
    UPDATE prettygood_private.user_auth
    SET 
        failed_login_attempts = 0,
        last_sign_in = NOW(),
        last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
    WHERE user_id = _user_id;
    
    -- Generate JWT token
    _token := auth.generate_jwt(_user_id, _user_role, 86400); -- 24 hour token
    
    -- Log successful login
    PERFORM prettygood_private.log_auth_event(
        'login_success',
        _user_id,
        jsonb_build_object(
            'role', _user_role
        )
    );
    
    RETURN _token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION prettygood_private.log_auth_event IS 'Securely logs authentication events for audit purposes without exposing sensitive data';
