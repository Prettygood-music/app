-- Migration: 033_fix_user_role_field.sql
-- Description: Fixes the JWT functions to handle the correct users table structure

-- Set search path
SET search_path TO prettygood_private, prettygood, public;

-- Update the generate_jwt function to work with the current database structure
CREATE OR REPLACE FUNCTION auth.generate_jwt(
  user_id UUID,
  role TEXT DEFAULT 'user',
  exp INTEGER DEFAULT 3600 -- 1 hour expiration by default
) RETURNS TEXT AS $$
DECLARE 
  _secret TEXT := auth.get_jwt_secret();
  _algorithm TEXT := 'sha256';
  _header_json TEXT;
  _payload_json TEXT;
  _header_encoded TEXT;
  _payload_encoded TEXT;
  _signature TEXT;
  _is_email_verified BOOLEAN;
BEGIN
  -- Try to get email verification status if the column exists
  BEGIN
    SELECT email_verified INTO _is_email_verified
    FROM prettygood.users
    WHERE id = user_id;
  EXCEPTION WHEN undefined_column THEN
    _is_email_verified := FALSE;
  END;
  
  -- Create the JWT header and payload as JSON strings
  _header_json := '{"alg":"HS256","typ":"JWT"}';
  
  -- Build the payload based on available fields
  BEGIN
    _payload_json := json_build_object(
      'sub', user_id,
      'role', role, -- This is passed as a parameter, not from the database
      'username', (SELECT username FROM prettygood.users WHERE id = user_id),
      'email', (SELECT email FROM prettygood.users WHERE id = user_id),
      'email_verified', COALESCE(_is_email_verified, FALSE),
      'wallet_address', (SELECT wallet_address FROM prettygood.users WHERE id = user_id),
      'exp', extract(epoch from now())::integer + exp,
      'iat', extract(epoch from now())::integer
    )::text;
  EXCEPTION WHEN others THEN
    -- Fallback to basic claims if any field isn't available
    _payload_json := json_build_object(
      'sub', user_id,
      'role', role,
      'exp', extract(epoch from now())::integer + exp,
      'iat', extract(epoch from now())::integer
    )::text;
  END;
  
  -- Base64url encode the header and payload
  _header_encoded := replace(
    replace(
      replace(
        rtrim(encode(_header_json::bytea, 'base64'), chr(10)),
        '/', '_'
      ),
      '+', '-'
    ),
    '=', ''
  );
  
  _payload_encoded := replace(
    replace(
      replace(
        rtrim(encode(_payload_json::bytea, 'base64'), chr(10)),
        '/', '_'
      ),
      '+', '-'
    ),
    '=', ''
  );
  
  -- Create the signature using HMAC with SHA256 and base64url encoding
  _signature := replace(
    replace(
      replace(
        rtrim(
          encode(
            hmac(
              _header_encoded || '.' || _payload_encoded,
              _secret,
              _algorithm
            ),
            'base64'
          ),
          chr(10)
        ),
        '/', '_'
      ),
      '+', '-'
    ),
    '=', ''
  );
  
  -- Return the complete JWT
  RETURN _header_encoded || '.' || _payload_encoded || '.' || _signature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the refresh_token function to handle the database structure
CREATE OR REPLACE FUNCTION prettygood.refresh_token(current_token TEXT)
RETURNS TEXT AS $$
DECLARE
  _user_id UUID;
  _role TEXT;
  _token TEXT;
  _payload JSON;
  _is_artist BOOLEAN;
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
      RAISE EXCEPTION 'Invalid token';
  END;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.users WHERE id = _user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists WHERE id = _user_id
  ) INTO _is_artist;
  
  _role := CASE WHEN _is_artist THEN 'artist' ELSE 'user' END;
  
  -- Generate a new JWT token with same claims but new expiration
  _token := auth.generate_jwt(
    _user_id,
    _role,
    86400  -- 24 hours expiration
  );
  
  -- Update last_sign_in timestamp
  BEGIN
    UPDATE prettygood_private.user_auth
    SET last_sign_in = NOW()
    WHERE user_id = _user_id;
  EXCEPTION WHEN OTHERS THEN
    -- Ignore errors on update, not critical for token refresh
    NULL;
  END;
  
  RETURN _token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comments
COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a JWT token for a user with the specified role and expiration. Fixed to handle database structure changes.';
COMMENT ON FUNCTION prettygood.refresh_token IS 'Refreshes a JWT token with a new expiration time if the current token is valid. Uses role determination based on artists table.';
