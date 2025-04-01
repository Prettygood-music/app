-- Migration: 027_fix_authenticate_user_function.sql
-- Description: Fixes all ambiguous column references in authentication functions

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix check_account_lockout function
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

-- Fix record_failed_login function
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
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = _user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO _user_role;
  
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

-- Restore comments
COMMENT ON FUNCTION prettygood_private.check_account_lockout IS 'Checks if an account is locked and handles automatic unlocking';
COMMENT ON FUNCTION prettygood_private.record_failed_login IS 'Records a failed login attempt and handles account lockout if needed';
COMMENT ON FUNCTION prettygood.authenticate_user IS 'Authenticates a user with email/username and password, returns JWT on success';
