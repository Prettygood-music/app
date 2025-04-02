-- Migration: 036_clean_token_generation.sql
-- Description: Updates JWT token generation to ensure clean tokens without newlines

-- Set search path
SET search_path TO prettygood_private, prettygood, public;

-- Update the generate_jwt function to ensure clean token output
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
  _result TEXT;
BEGIN
  -- Get email verification status
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
  
  -- Base64url encode the header and payload with explicit cleanup
  -- 1. Encode to base64
  -- 2. Remove all whitespace completely (spaces, tabs, newlines)
  -- 3. Replace URL-unsafe characters
  -- 4. Remove padding
  _header_encoded := regexp_replace(
    replace(
      replace(
        encode(_header_json::bytea, 'base64'),
        '/', '_'
      ),
      '+', '-'
    ),
    '[=\s]', '', 'g' -- Remove all whitespace and padding
  );
  
  _payload_encoded := regexp_replace(
    replace(
      replace(
        encode(_payload_json::bytea, 'base64'),
        '/', '_'
      ),
      '+', '-'
    ),
    '[=\s]', '', 'g' -- Remove all whitespace and padding
  );
  
  -- Create the signature using HMAC with SHA256 and clean base64url encoding
  _signature := regexp_replace(
    replace(
      replace(
        encode(
          hmac(
            _header_encoded || '.' || _payload_encoded,
            _secret,
            _algorithm
          ),
          'base64'
        ),
        '/', '_'
      ),
      '+', '-'
    ),
    '[=\s]', '', 'g' -- Remove all whitespace and padding
  );
  
  -- Combine the parts to create the final token
  _result := _header_encoded || '.' || _payload_encoded || '.' || _signature;
  
  -- Final safety check - ensure no whitespace exists in the token
  _result := regexp_replace(_result, '\s', '', 'g');
  
  RETURN _result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update comments
COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a clean JWT token with proper base64url encoding and no whitespace.';
