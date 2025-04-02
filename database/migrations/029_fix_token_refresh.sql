-- Migration: 029_fix_token_refresh.sql
-- Description: Fixes the token refresh function to be compatible with the updated JWT handling

-- Use private schema for authentication functions
SET search_path TO prettygood_private, prettygood, public;

-- Drop the existing function
DROP FUNCTION IF EXISTS prettygood.refresh_token(TEXT);

-- Create or replace the refresh_token function to use updated JWT methods
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
  _payload JSON;
BEGIN
  -- Try to validate the token and extract the user ID
  BEGIN
    -- Extract user data from current token using the updated auth.verify_jwt function
    -- This uses the correct secret via auth.get_jwt_secret()
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
  -- using the auth.generate_jwt function which uses the correct secret and algorithm
  _token := auth.generate_jwt(
    _user_id,
    _role,
    86400  -- 24 hours expiration
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
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO artist;

-- Add comment with function documentation
COMMENT ON FUNCTION refresh_token(TEXT) IS 
'Refreshes a JWT token with a new expiration time if the current token is valid.
 Returns a new valid token or raises an exception if the current token is invalid.
 Uses auth.verify_jwt and auth.generate_jwt for consistent JWT handling.';
