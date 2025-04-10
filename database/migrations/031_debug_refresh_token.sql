-- Migration: 031_debug_refresh_token.sql
-- Description: Adds a debug function for token refresh and improves refresh_token function

-- Set search path
SET search_path TO prettygood_private, prettygood, public;

-- Create debug function to trace token refresh issues
CREATE OR REPLACE FUNCTION prettygood.debug_refresh_token(current_token TEXT)
RETURNS JSONB AS $$
DECLARE
  _payload JSONB;
  _error_info TEXT;
  _token_parts JSONB;
  _token_header BYTEA;
  _token_payload BYTEA;
  _token_signature TEXT;
  _expected_signature TEXT;
  _user_info JSONB;
  _jwt_secret TEXT;
  _algorithm TEXT := 'sha256';
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
BEGIN
  -- Basic token structure validation
  IF current_token IS NULL OR current_token = '' THEN
    RETURN jsonb_build_object('error', 'Token is null or empty');
  END IF;
  
  -- Split token and analyze structure
  _header_part := split_part(current_token, '.', 1);
  _payload_part := split_part(current_token, '.', 2);
  _signature_part := split_part(current_token, '.', 3);
  
  IF _header_part IS NULL OR _payload_part IS NULL OR _signature_part IS NULL OR
     _header_part = '' OR _payload_part = '' OR _signature_part = '' THEN
    RETURN jsonb_build_object('error', 'Token does not have three parts (header.payload.signature)');
  END IF;
  
  -- Decode header and payload for analysis
  BEGIN
    _token_header := decode(
      _header_part || repeat('=', (4 - length(_header_part) % 4) % 4),
      'base64'
    );
    
    _token_payload := decode(
      _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
      'base64'
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Could not decode token parts',
      'detail', SQLERRM
    );
  END;
  
  -- Parse the payload
  BEGIN
    _payload := convert_from(_token_payload, 'UTF8')::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Could not parse token payload as JSON',
      'detail', SQLERRM,
      'payload_raw', convert_from(_token_payload, 'UTF8')
    );
  END;
  
  -- Get secret
  BEGIN
    _jwt_secret := auth.get_jwt_secret();
  EXCEPTION WHEN OTHERS THEN
    _error_info := SQLERRM;
    RETURN jsonb_build_object(
      'error', 'Could not get JWT secret',
      'detail', _error_info
    );
  END;
  
  -- Calculate expected signature for comparison
  BEGIN
    _expected_signature := rtrim(
      replace(
        replace(
          replace(
            encode(
              hmac(
                _header_part || '.' || _payload_part,
                _jwt_secret,
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
      )
    );
  EXCEPTION WHEN OTHERS THEN
    _error_info := SQLERRM;
    RETURN jsonb_build_object(
      'error', 'Could not calculate expected signature',
      'detail', _error_info
    );
  END;
  
  -- Check for signature mismatch
  IF _signature_part != _expected_signature THEN
    RETURN jsonb_build_object(
      'error', 'Signature verification failed',
      'token_signature', _signature_part,
      'expected_signature', _expected_signature,
      'signature_match', FALSE,
      'payload', _payload,
      'jwt_secret_length', length(_jwt_secret)
    );
  END;
  
  -- Check expiration
  IF (_payload->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RETURN jsonb_build_object(
      'error', 'Token has expired',
      'payload', _payload,
      'exp_date', to_timestamp((_payload->>'exp')::NUMERIC),
      'now', now(),
      'expired_seconds_ago', extract(epoch from now()) - (_payload->>'exp')::NUMERIC
    );
  END;
  
  -- Check for user in database
  BEGIN
    SELECT jsonb_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'role', u.role
    )
    INTO _user_info
    FROM prettygood.users u
    WHERE u.id = (_payload->>'sub')::UUID;
    
    IF _user_info IS NULL THEN
      RETURN jsonb_build_object(
        'error', 'User not found in database',
        'user_id', _payload->>'sub',
        'payload', _payload
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    _error_info := SQLERRM;
    RETURN jsonb_build_object(
      'error', 'Error checking user in database',
      'detail', _error_info,
      'user_id', _payload->>'sub'
    );
  END;
  
  -- If we get here, the token is valid
  RETURN jsonb_build_object(
    'status', 'Token is valid',
    'payload', _payload,
    'user', _user_info,
    'signature_match', TRUE,
    'exp_date', to_timestamp((_payload->>'exp')::NUMERIC),
    'now', now(),
    'seconds_until_expiry', (_payload->>'exp')::NUMERIC - extract(epoch from now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improve the refresh_token function for better error handling and debugging
DROP FUNCTION IF EXISTS prettygood.refresh_token(TEXT);

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
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _algorithm TEXT := 'sha256';
  _secret TEXT;
  _expected_signature TEXT;
BEGIN
  -- Validate input
  IF current_token IS NULL OR current_token = '' THEN
    RAISE EXCEPTION 'Token is null or empty';
  END IF;
  
  -- Get the JWT secret
  _secret := auth.get_jwt_secret();
  IF _secret IS NULL OR _secret = '' THEN
    RAISE EXCEPTION 'JWT secret is not configured';
  END IF;
  
  -- Split the token
  _header_part := split_part(current_token, '.', 1);
  _payload_part := split_part(current_token, '.', 2);
  _signature_part := split_part(current_token, '.', 3);
  
  -- Basic structure check
  IF _header_part IS NULL OR _payload_part IS NULL OR _signature_part IS NULL OR
     _header_part = '' OR _payload_part = '' OR _signature_part = '' THEN
    RAISE EXCEPTION 'Invalid token format';
  END IF;
  
  -- Direct calculation of expected signature for comparison
  _expected_signature := rtrim(
    replace(
      replace(
        replace(
          encode(
            hmac(
              _header_part || '.' || _payload_part,
              _secret,
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
    )
  );
  
  -- Manual signature verification
  IF _signature_part != _expected_signature THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  -- Manually decode and parse payload
  BEGIN
    _payload := convert_from(
      decode(
        _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
        'base64'
      ),
      'UTF8'
    )::JSON;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid token payload';
  END;
  
  -- Check expiration
  IF (_payload->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  -- Extract user ID from payload
  _user_id := (_payload->>'sub')::UUID;
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Token missing subject claim';
  END IF;
  
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
  
  -- Update last_sign_in timestamp if the table exists
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION debug_refresh_token(TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_token(TEXT) TO artist;

-- Add comments
COMMENT ON FUNCTION debug_refresh_token(TEXT) IS 
'DEBUG ONLY - Analyzes a token to find issues preventing refresh.
 This function helps diagnose token validation problems.';

COMMENT ON FUNCTION refresh_token(TEXT) IS 
'Refreshes a JWT token with a new expiration time if the current token is valid.
 Returns a new valid token or raises an exception if the current token is invalid.
 Includes detailed validation of the token format and signature.';
