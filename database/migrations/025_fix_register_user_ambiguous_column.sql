-- Migration: 025_fix_register_user_ambiguous_column.sql
-- Description: Fixes all ambiguous column references in register_user function and ensures pgcrypto extension is installed

-- Ensure pgcrypto extension is installed (required for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- First, drop all existing versions of the register_user function
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text, text, text);
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text, text);
DROP FUNCTION IF EXISTS prettygood.register_user(text, text, text);

-- Update register function to use underscore prefix for all parameters to avoid ambiguity
CREATE OR REPLACE FUNCTION prettygood.register_user(
  _username TEXT,
  _email TEXT,
  _password TEXT,
  _display_name TEXT DEFAULT NULL,
  _wallet_address TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  _user_id UUID;  -- Changed variable name to _user_id to avoid ambiguity
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
    email_verified
  ) 
  VALUES (
    _username,
    _email,
    COALESCE(_display_name, _username),
    _wallet_address,
    FALSE
  )
  RETURNING id INTO _user_id;  -- Store in _user_id variable

  -- Create auth entry with hashed password
  INSERT INTO prettygood_private.user_auth (
    user_id,
    password_hash,
    nonce_created_at
  ) 
  VALUES (
    _user_id,  -- Use _user_id variable
    crypt(_password, gen_salt('bf')), -- Use Blowfish algorithm for hashing
    NOW()
  );
  
  -- Generate email verification token
  _verification_token := prettygood.create_email_verification_token(_user_id);  -- Use _user_id variable
  
  -- Return user id and verification token
  RETURN json_build_object(
    'user_id', _user_id,  -- Use _user_id variable
    'verification_token', _verification_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comment for documentation
COMMENT ON FUNCTION prettygood.register_user IS 'Registers a new user with email/password authentication and returns user ID and verification token';
