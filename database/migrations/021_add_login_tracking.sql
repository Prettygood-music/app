-- Migration: 021_add_login_tracking.sql
-- Description: Adds login tracking and account lockout functionality

-- Add login tracking fields to user_auth table
ALTER TABLE prettygood_private.user_auth
ADD COLUMN failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN last_failed_attempt TIMESTAMPTZ,
ADD COLUMN locked_until TIMESTAMPTZ;

-- Create function to check and handle account lockout
CREATE OR REPLACE FUNCTION prettygood_private.check_account_lockout(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_locked BOOLEAN;
  lockout_until TIMESTAMPTZ;
  reset_after INTERVAL := INTERVAL '30 minutes';
BEGIN
  -- Get lock status for user
  SELECT 
    COALESCE(locked_until > NOW(), FALSE),
    locked_until
  INTO is_locked, lockout_until
  FROM prettygood_private.user_auth
  WHERE user_id = check_account_lockout.user_id;
  
  -- If account is locked, return locked status
  IF is_locked THEN
    RETURN TRUE;
  END IF;
  
  -- Check if we should reset failed attempts (after 30 minutes of no failures)
  UPDATE prettygood_private.user_auth
  SET failed_login_attempts = 0
  WHERE 
    user_id = check_account_lockout.user_id AND
    last_failed_attempt < NOW() - reset_after;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment failed login attempts
CREATE OR REPLACE FUNCTION prettygood_private.record_failed_login(user_id UUID)
RETURNS VOID AS $$
DECLARE
  current_attempts INTEGER;
  max_attempts CONSTANT INTEGER := 5;
  lockout_duration INTERVAL := INTERVAL '15 minutes';
BEGIN
  -- Update failed attempts count
  UPDATE prettygood_private.user_auth
  SET 
    failed_login_attempts = failed_login_attempts + 1,
    last_failed_attempt = NOW()
  WHERE user_id = record_failed_login.user_id
  RETURNING failed_login_attempts INTO current_attempts;
  
  -- If max attempts reached, lock the account
  IF current_attempts >= max_attempts THEN
    UPDATE prettygood_private.user_auth
    SET locked_until = NOW() + lockout_duration
    WHERE user_id = record_failed_login.user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Modify the authenticate_user function to handle lockouts
CREATE OR REPLACE FUNCTION prettygood.authenticate_user(
  email_or_username TEXT,
  password TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  stored_password_hash TEXT;
  user_role TEXT;
  is_locked BOOLEAN;
BEGIN
  -- Get the user_id and password hash
  SELECT u.id, a.password_hash INTO user_id, stored_password_hash
  FROM prettygood.users u
  JOIN prettygood_private.user_auth a ON u.id = a.user_id
  WHERE (u.email = authenticate_user.email_or_username OR u.username = authenticate_user.email_or_username);
  
  -- Check if user exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Check if account is locked
  is_locked := prettygood_private.check_account_lockout(user_id);
  IF is_locked THEN
    RAISE EXCEPTION 'Account is temporarily locked due to too many failed login attempts. Please try again later.';
  END IF;
  
  -- Verify password
  IF stored_password_hash IS NULL OR stored_password_hash != crypt(authenticate_user.password, stored_password_hash) THEN
    -- Record failed login attempt
    PERFORM prettygood_private.record_failed_login(user_id);
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO user_role;
  
  -- Reset failed login attempts and update last sign in time
  UPDATE prettygood_private.user_auth
  SET 
    failed_login_attempts = 0,
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE user_id = user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(user_id, user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN prettygood_private.user_auth.failed_login_attempts IS 'Number of consecutive failed login attempts';
COMMENT ON COLUMN prettygood_private.user_auth.last_failed_attempt IS 'Timestamp of the last failed login attempt';
COMMENT ON COLUMN prettygood_private.user_auth.locked_until IS 'Timestamp until which the account is locked due to too many failed attempts';
COMMENT ON FUNCTION prettygood_private.check_account_lockout IS 'Checks if an account is locked and handles automatic unlocking';
COMMENT ON FUNCTION prettygood_private.record_failed_login IS 'Records a failed login attempt and handles account lockout if needed';
