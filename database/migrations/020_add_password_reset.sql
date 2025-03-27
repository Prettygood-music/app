-- Migration: 020_add_password_reset.sql
-- Description: Adds password reset functionality to the authentication system

-- Add password reset fields to user_auth table
ALTER TABLE prettygood_private.user_auth
ADD COLUMN reset_token TEXT,
ADD COLUMN reset_token_expires_at TIMESTAMPTZ;

-- Create index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_user_auth_reset_token ON prettygood_private.user_auth(reset_token);

-- Create trigger to clear expired reset tokens
CREATE OR REPLACE FUNCTION prettygood_private.clear_expired_reset_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Clear expired reset tokens
  IF NEW.reset_token IS NOT NULL AND NEW.reset_token_expires_at < NOW() THEN
    NEW.reset_token := NULL;
    NEW.reset_token_expires_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clear_expired_reset_tokens
BEFORE UPDATE ON prettygood_private.user_auth
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.clear_expired_reset_tokens();

-- Function to request a password reset
CREATE OR REPLACE FUNCTION prettygood.request_password_reset(email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  reset_token TEXT;
BEGIN
  -- Find user by email
  SELECT id INTO user_id
  FROM prettygood.users
  WHERE email = request_password_reset.email;
  
  -- Generate a reset token even if user not found (security best practice)
  -- This prevents enumeration attacks
  reset_token := encode(gen_random_bytes(24), 'hex');
  
  -- If user exists, store the reset token
  IF user_id IS NOT NULL THEN
    UPDATE prettygood_private.user_auth
    SET 
      reset_token = reset_token,
      reset_token_expires_at = NOW() + INTERVAL '1 hour'
    WHERE user_id = user_id;
  END IF;
  
  -- Return token regardless of whether user was found
  RETURN reset_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset password with token
CREATE OR REPLACE FUNCTION prettygood.reset_password(reset_token TEXT, new_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  token_expiration TIMESTAMPTZ;
BEGIN
  -- Check password strength
  IF new_password IS NULL OR LENGTH(new_password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Find user with this reset token
  SELECT a.user_id, a.reset_token_expires_at INTO user_id, token_expiration
  FROM prettygood_private.user_auth a
  WHERE a.reset_token = reset_password.reset_token;
  
  -- Check if token exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired reset token';
  END IF;
  
  -- Check if token is expired
  IF token_expiration < NOW() THEN
    RAISE EXCEPTION 'Reset token has expired. Please request a new one.';
  END IF;
  
  -- Update password and clear reset token
  UPDATE prettygood_private.user_auth
  SET 
    password_hash = crypt(new_password, gen_salt('bf')),
    reset_token = NULL,
    reset_token_expires_at = NULL
  WHERE user_id = user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN prettygood_private.user_auth.reset_token IS 'Token used for password reset, cleared after use';
COMMENT ON COLUMN prettygood_private.user_auth.reset_token_expires_at IS 'Expiration time for password reset token';
COMMENT ON FUNCTION prettygood.request_password_reset IS 'Generates a password reset token for a given email address';
COMMENT ON FUNCTION prettygood.reset_password IS 'Resets a user''s password using the provided token';
