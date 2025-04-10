-- Migration: 019_add_email_verification.sql
-- Description: Adds email verification functionality to the authentication system

-- Add email verification status to users table
ALTER TABLE prettygood.users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Make email required (not nullable)
ALTER TABLE prettygood.users
ALTER COLUMN email SET NOT NULL;

-- Create email verification tokens table
CREATE TABLE IF NOT EXISTS prettygood_private.email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Add indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON prettygood_private.email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON prettygood_private.email_verification_tokens(token);

-- Add trigger to automatically clean up expired tokens
CREATE OR REPLACE FUNCTION prettygood_private.clean_expired_verification_tokens()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clean_expired_verification_tokens
AFTER INSERT ON prettygood_private.email_verification_tokens
EXECUTE FUNCTION prettygood_private.clean_expired_verification_tokens();

-- Create function to generate email verification token
CREATE OR REPLACE FUNCTION prettygood.create_email_verification_token(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  new_token TEXT;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate a secure token
  SELECT encode(gen_random_bytes(24), 'hex') INTO new_token;
  
  -- Delete any existing tokens for this user
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE user_id = create_email_verification_token.user_id;
  
  -- Insert new token
  INSERT INTO prettygood_private.email_verification_tokens (
    user_id,
    token
  ) VALUES (
    create_email_verification_token.user_id,
    new_token
  );
  
  RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify email
CREATE OR REPLACE FUNCTION prettygood.verify_email(verification_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  is_expired BOOLEAN;
BEGIN
  -- Get user_id from token and check if it's expired
  SELECT 
    t.user_id,
    t.expires_at < NOW() INTO user_id, is_expired
  FROM prettygood_private.email_verification_tokens t
  WHERE t.token = verification_token;
  
  -- Check if token exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid verification token';
  END IF;
  
  -- Check if token is expired
  IF is_expired THEN
    RAISE EXCEPTION 'Verification token has expired. Please request a new one.';
  END IF;
  
  -- Update user's email_verified status
  UPDATE prettygood.users
  SET email_verified = TRUE
  WHERE id = user_id;
  
  -- Delete the used token
  DELETE FROM prettygood_private.email_verification_tokens
  WHERE token = verification_token;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update register function to create verification token
CREATE OR REPLACE FUNCTION prettygood.register_user(
  username TEXT,
  email TEXT,
  password TEXT,
  display_name TEXT DEFAULT NULL,
  wallet_address TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  verification_token TEXT;
BEGIN
  -- Validate inputs
  IF username IS NULL OR LENGTH(TRIM(username)) < 3 THEN
    RAISE EXCEPTION 'Username must be at least 3 characters long';
  END IF;

  IF email IS NULL OR email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF password IS NULL OR LENGTH(password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Check if username or email already exists
  IF EXISTS (SELECT 1 FROM prettygood.users WHERE username = register_user.username) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  IF EXISTS (SELECT 1 FROM prettygood.users WHERE email = register_user.email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Insert new user
  INSERT INTO prettygood.users (
    username,
    email,
    display_name,
    wallet_address,
    email_verified
  ) 
  VALUES (
    register_user.username,
    register_user.email,
    COALESCE(register_user.display_name, register_user.username),
    register_user.wallet_address,
    FALSE
  )
  RETURNING id INTO new_user_id;

  -- Create auth entry with hashed password
  INSERT INTO prettygood_private.user_auth (
    user_id,
    password_hash,
    nonce_created_at
  ) 
  VALUES (
    new_user_id,
    crypt(register_user.password, gen_salt('bf')), -- Use Blowfish algorithm for hashing
    NOW()
  );
  
  -- Generate email verification token
  verification_token := prettygood.create_email_verification_token(new_user_id);
  
  -- Return user id and verification token
  RETURN json_build_object(
    'user_id', new_user_id,
    'verification_token', verification_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modify JWT function to include email_verified claim
CREATE OR REPLACE FUNCTION auth.generate_jwt(
  user_id UUID,
  role TEXT DEFAULT 'user',
  exp INTEGER DEFAULT 3600 -- 1 hour expiration by default
) RETURNS TEXT AS $$
DECLARE
  secret TEXT;
  algorithm TEXT := 'HS256';
  header JSON;
  payload JSON;
  signature TEXT;
  is_email_verified BOOLEAN;
BEGIN
  -- Get the secret from the secrets table
  SELECT jwt_secret INTO secret FROM auth.secrets WHERE id = 1;
  
  -- Get email verification status
  SELECT email_verified INTO is_email_verified FROM prettygood.users WHERE id = user_id;
  
  -- Create the JWT header
  header := json_build_object(
    'alg', algorithm,
    'typ', 'JWT'
  );
  
  -- Create the JWT payload
  payload := json_build_object(
    'role', role,
    'user_id', user_id,
    'email_verified', COALESCE(is_email_verified, FALSE),
    'exp', extract(epoch from now())::integer + exp,
    'iat', extract(epoch from now())::integer
  );
  
  -- Return the composed JWT token
  RETURN 
    rtrim(replace(encode(header::text::bytea, 'base64'), '=', ''), chr(10)) || '.' ||
    rtrim(replace(encode(payload::text::bytea, 'base64'), '=', ''), chr(10)) || '.' ||
    rtrim(replace(encode(hmac(payload::text, secret, algorithm), 'base64'), '=', ''), chr(10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE prettygood_private.email_verification_tokens IS 'Stores tokens for email verification';
COMMENT ON COLUMN prettygood.users.email_verified IS 'Indicates whether user''s email has been verified';
COMMENT ON FUNCTION prettygood.create_email_verification_token IS 'Creates a new email verification token for a user';
COMMENT ON FUNCTION prettygood.verify_email IS 'Verifies a user''s email using the provided token';
