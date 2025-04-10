-- Migration: Add token refresh functionality
-- Description: Adds a function to refresh JWT tokens

-- Use private schema for authentication functions
SET search_path TO prettygood_private, prettygood, public;

-- Create function to refresh a JWT token
DROP FUNCTION IF EXISTS prettygood.refresh_token();

CREATE OR REPLACE FUNCTION prettygood.refresh_token(current_token TEXT)
RETURNS TEXT AS $$
DECLARE
  _user_id UUID;
  _username TEXT;
  _email TEXT;
  _role TEXT;
  _email_verified BOOLEAN;
  _wallet_address TEXT;
  _token TEXT;
BEGIN
  -- Try to validate the token and extract the user ID
  BEGIN
    -- Extract user_id from current token
    _user_id := (SELECT sub FROM verify_jwt(current_token, 'your-jwt-secret'));
    
    -- If no user_id found, token is invalid
    IF _user_id IS NULL THEN
      RAISE EXCEPTION 'Invalid token';
    END IF;
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Invalid token';
  END;
  
  -- Get user information
  SELECT 
    u.username,
    u.email,
    u.role,
    u.email_verified,
    u.wallet_address
  INTO
    _username,
    _email,
    _role,
    _email_verified,
    _wallet_address
  FROM
    prettygood.users u
  WHERE
    u.id = _user_id;
    
  -- If user not found, token is invalid
  IF _username IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Generate a new JWT token with same claims but new expiration
  _token := sign_jwt(
    json_build_object(
      'sub', _user_id,
      'username', _username,
      'email', _email,
      'role', _role,
      'email_verified', _email_verified,
      'wallet_address', _wallet_address,
      'exp', extract(epoch from (now() + interval '24 hours')),
      'iat', extract(epoch from now())
    ),
    'your-jwt-secret'
  );
  
  -- Update last_sign_in timestamp
  UPDATE prettygood_private.user_auth
  SET last_sign_in = NOW()
  WHERE user_id = _user_id;
  
  RETURN _token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to postgres user
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO postgres;

-- Grant execute permission to authenticated role for API access
-- Removed the web_anon role which doesn't exist
-- You may need to grant to 'anon', 'authenticated', or another role that your system uses

-- Add comment with function documentation
COMMENT ON FUNCTION refresh_token(TEXT) IS 
'Refreshes a JWT token with a new expiration time if the current token is valid.
 Returns a new valid token or raises an exception if the current token is invalid.';
