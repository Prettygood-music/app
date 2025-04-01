-- Migration: 026_fix_ambiguous_columns.sql
-- Description: Fixes ambiguous column references in multiple functions

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix request_password_reset function
DROP FUNCTION IF EXISTS prettygood.request_password_reset(text);

CREATE OR REPLACE FUNCTION prettygood.request_password_reset(_email TEXT)
RETURNS TEXT AS $$
DECLARE
  _user_id UUID;
  _reset_token TEXT;
BEGIN
  -- Find user by email
  SELECT id INTO _user_id
  FROM prettygood.users
  WHERE email = _email;
  
  -- Generate a reset token even if user not found (security best practice)
  -- This prevents enumeration attacks
  _reset_token := encode(gen_random_bytes(24), 'hex');
  
  -- If user exists, store the reset token
  IF _user_id IS NOT NULL THEN
    UPDATE prettygood_private.user_auth
    SET 
      reset_token = _reset_token,
      reset_token_expires_at = NOW() + INTERVAL '1 hour'
    WHERE user_id = _user_id;
  END IF;
  
  -- Return token regardless of whether user was found
  RETURN _reset_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix reset_password function
DROP FUNCTION IF EXISTS prettygood.reset_password(text, text);

CREATE OR REPLACE FUNCTION prettygood.reset_password(_reset_token TEXT, _new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  _user_id UUID;
  _token_expiration TIMESTAMPTZ;
BEGIN
  -- Check password strength
  IF _new_password IS NULL OR LENGTH(_new_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Find user with this reset token
  SELECT a.user_id, a.reset_token_expires_at INTO _user_id, _token_expiration
  FROM prettygood_private.user_auth a
  WHERE a.reset_token = _reset_token;
  
  -- Check if token exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired reset token';
  END IF;
  
  -- Check if token is expired
  IF _token_expiration < NOW() THEN
    RAISE EXCEPTION 'Reset token has expired. Please request a new one.';
  END IF;
  
  -- Update password and clear reset token
  UPDATE prettygood_private.user_auth
  SET 
    password_hash = crypt(_new_password, gen_salt('bf')),
    reset_token = NULL,
    reset_token_expires_at = NULL,
    failed_login_attempts = 0,
    last_failed_attempt = NULL,
    locked_until = NULL
  WHERE user_id = _user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix authenticate_user function
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
  -- Get the user_id and password hash
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
  UPDATE prettygood_private.user_auth
  SET 
    failed_login_attempts = 0,
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE user_id = _user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(_user_id, _user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix verify_email function
DROP FUNCTION IF EXISTS prettygood.verify_email(text);

CREATE OR REPLACE FUNCTION prettygood.verify_email(_verification_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  _user_id UUID;
  _is_expired BOOLEAN;
BEGIN
  -- Get user_id from token and check if it's expired
  SELECT 
    t.user_id,
    t.expires_at < NOW() INTO _user_id, _is_expired
  FROM prettygood_private.email_verification_tokens t
  WHERE t.token = _verification_token;
  
  -- Check if token exists
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid verification token';
  END IF;
  
  -- Check if token is expired
  IF _is_expired THEN
    RAISE EXCEPTION 'Verification token has expired. Please request a new one.';
  END IF;
  
  -- Update user's email_verified status
  UPDATE prettygood.users
  SET email_verified = TRUE
  WHERE id = _user_id;
  
  -- Delete the used token
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE token = _verification_token;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix create_email_verification_token function
DROP FUNCTION IF EXISTS prettygood.create_email_verification_token(uuid);

CREATE OR REPLACE FUNCTION prettygood.create_email_verification_token(_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  _new_token TEXT;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate a secure token
  SELECT encode(gen_random_bytes(24), 'hex') INTO _new_token;
  
  -- Delete any existing tokens for this user
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE user_id = _user_id;
  
  -- Insert new token
  INSERT INTO prettygood_private.email_verification_tokens (
    user_id,
    token
  ) VALUES (
    _user_id,
    _new_token
  );
  
  RETURN _new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Restore comments
COMMENT ON FUNCTION prettygood.request_password_reset IS 'Generates a password reset token for a given email address';
COMMENT ON FUNCTION prettygood.reset_password IS 'Resets a user''s password using the provided token';
COMMENT ON FUNCTION prettygood.authenticate_user IS 'Authenticates a user with email/username and password, returns JWT on success';
COMMENT ON FUNCTION prettygood.verify_email IS 'Verifies a user''s email using the provided token';
COMMENT ON FUNCTION prettygood.create_email_verification_token IS 'Creates a new email verification token for a user';
