-- Migration: 032_fix_jwt_signature_base64url.sql
-- Description: Fixes JWT signature verification by properly handling base64url encoding

-- Set search path
SET search_path TO prettygood_private, prettygood, public;

-- Update the verify_jwt function to correctly handle base64url encoding
CREATE OR REPLACE FUNCTION auth.verify_jwt(token TEXT, secret TEXT DEFAULT NULL) RETURNS JSON AS $$
DECLARE 
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _payload BYTEA;
  _payload_json JSON;
  _algorithm TEXT := 'sha256';
  _actual_secret TEXT;
  _calculated_signature TEXT;
BEGIN
  -- Get the secret if not provided
  IF secret IS NULL THEN 
    _actual_secret := auth.get_jwt_secret();
  ELSE 
    _actual_secret := secret;
  END IF;
  
  -- Split the token
  _header_part := split_part(token, '.', 1);
  _payload_part := split_part(token, '.', 2);
  _signature_part := split_part(token, '.', 3);
  
  -- Calculate signature with proper base64url encoding
  -- Note: This is the critical fix - previous implementation didn't properly handle base64url encoding
  _calculated_signature := rtrim(
    replace(
      replace(
        replace(
          encode(
            hmac(
              _header_part || '.' || _payload_part,
              _actual_secret,
              _algorithm
            ),
            'base64'
          ),
          '/',
          '_'
        ),
        '+',
        '-'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Verify signature with strict comparison
  IF _signature_part != _calculated_signature THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  -- Decode the payload - handle base64url padding correctly
  _payload := decode(
    _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
    'base64'
  );
  
  -- Convert to JSON
  _payload_json := convert_from(_payload, 'UTF8')::JSON;
  
  -- Verify token has not expired
  IF _payload_json->>'exp' IS NOT NULL
  AND (_payload_json->>'exp')::numeric < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  RETURN _payload_json;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the generate_jwt function to use consistent base64url encoding
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
  -- Get email verification status
  SELECT email_verified INTO _is_email_verified
  FROM prettygood.users
  WHERE id = user_id;
  
  -- Create the JWT header and payload as JSON strings
  _header_json := '{"alg":"HS256","typ":"JWT"}';
  _payload_json := json_build_object(
    'sub', user_id,
    'role', role,
    'username', (SELECT username FROM prettygood.users WHERE id = user_id),
    'email', (SELECT email FROM prettygood.users WHERE id = user_id),
    'email_verified', COALESCE(_is_email_verified, FALSE),
    'wallet_address', (SELECT wallet_address FROM prettygood.users WHERE id = user_id),
    'exp', extract(epoch from now())::integer + exp,
    'iat', extract(epoch from now())::integer
  )::text;
  
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

-- Update the refresh_token function to use consistent base64url encoding
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
COMMENT ON FUNCTION auth.verify_jwt IS 'Verifies a JWT token and returns the payload if valid. Fixed to correctly handle base64url encoding.';
COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a JWT token for a user with the specified role and expiration using SHA256 for signatures with proper base64url encoding.';
COMMENT ON FUNCTION prettygood.refresh_token IS 'Refreshes a JWT token with a new expiration time if the current token is valid. Uses the fixed JWT functions.';
