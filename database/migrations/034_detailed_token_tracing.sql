-- Migration: 034_detailed_token_tracing.sql
-- Description: Adds advanced token debugging and fixes token verification

-- Set search path
SET search_path TO prettygood_private, prettygood, public;

-- Create a detailed token debugging function
CREATE OR REPLACE FUNCTION prettygood.trace_token_verification(token TEXT)
RETURNS JSONB AS $$
DECLARE
  _parts TEXT[];
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _payload_decoded BYTEA;
  _payload_json JSONB;
  _expected_signature TEXT;
  _algorithm TEXT := 'sha256';
  _secret TEXT;
BEGIN
  -- Split the token into parts
  _parts := string_to_array(token, '.');
  
  -- Basic validation
  IF array_length(_parts, 1) != 3 THEN
    RETURN jsonb_build_object(
      'error', 'Token does not have three parts',
      'parts_count', array_length(_parts, 1)
    );
  END IF;
  
  _header_part := _parts[1];
  _payload_part := _parts[2];
  _signature_part := _parts[3];
  
  -- Check for empty parts
  IF _header_part = '' OR _payload_part = '' OR _signature_part = '' THEN
    RETURN jsonb_build_object(
      'error', 'Token has empty parts',
      'header_length', length(_header_part),
      'payload_length', length(_payload_part),
      'signature_length', length(_signature_part)
    );
  END IF;
  
  -- Try to decode payload
  BEGIN
    -- Add padding if needed for base64 decoding
    _payload_decoded := decode(
      _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
      'base64'
    );
    
    -- Convert to JSON
    _payload_json := convert_from(_payload_decoded, 'UTF8')::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Failed to decode payload',
      'payload_part', _payload_part,
      'detail', SQLERRM
    );
  END;
  
  -- Check if decoded payload has required fields
  IF _payload_json->>'sub' IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'Payload missing subject claim',
      'payload', _payload_json
    );
  END IF;
  
  -- Check if token has expired
  IF (_payload_json->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RETURN jsonb_build_object(
      'error', 'Token has expired',
      'exp', to_timestamp((_payload_json->>'exp')::NUMERIC),
      'now', now(),
      'seconds_expired', extract(epoch from now()) - (_payload_json->>'exp')::NUMERIC
    );
  END IF;
  
  -- Get JWT secret
  BEGIN
    _secret := auth.get_jwt_secret();
    
    IF _secret IS NULL OR _secret = '' THEN
      RETURN jsonb_build_object(
        'error', 'JWT secret is not configured'
      );
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Failed to get JWT secret',
      'detail', SQLERRM
    );
  END;
  
  -- Calculate expected signature
  -- First with normal base64 handling
  _expected_signature := rtrim(
    replace(
      encode(
        hmac(
          _header_part || '.' || _payload_part,
          _secret,
          _algorithm
        ),
        'base64'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Check if signatures match with normal base64
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (standard base64)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'standard_base64'
    );
  END IF;
  
  -- Try with base64url encoding
  _expected_signature := replace(
    replace(
      rtrim(
        replace(
          encode(
            hmac(
              _header_part || '.' || _payload_part,
              _secret,
              _algorithm
            ),
            'base64'
          ),
          '=',
          ''
        ),
        chr(10)
      ),
      '+',
      '-'
    ),
    '/',
    '_'
  );
  
  -- Check if signatures match with base64url
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (base64url)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'base64url'
    );
  END IF;
  
  -- Calculate with full base64url conversion to debug
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
    ),
    chr(10)
  );
  
  -- Check with full base64url encoding
  IF _signature_part = _expected_signature THEN
    RETURN jsonb_build_object(
      'status', 'Valid token (full base64url)',
      'payload', _payload_json,
      'signature_match', true,
      'encoding_mode', 'full_base64url'
    );
  END IF;
  
  -- If we get here, the signatures don't match
  RETURN jsonb_build_object(
    'error', 'Signature verification failed',
    'payload', _payload_json,
    'signature_part', _signature_part,
    'expected_signature_std', rtrim(
      replace(
        encode(
          hmac(
            _header_part || '.' || _payload_part,
            _secret,
            _algorithm
          ),
          'base64'
        ),
        '=',
        ''
      ),
      chr(10)
    ),
    'expected_signature_url', rtrim(
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
      ),
      chr(10)
    ),
    'signature_match', false,
    'secret_length', length(_secret)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a new version of the refresh token function with more detailed debugging
CREATE OR REPLACE FUNCTION prettygood.refresh_token_v2(current_token TEXT)
RETURNS TEXT AS $$
DECLARE
  _user_id UUID;
  _role TEXT;
  _token TEXT;
  _payload JSONB;
  _is_artist BOOLEAN;
  _parts TEXT[];
  _header_part TEXT;
  _payload_part TEXT;
  _signature_part TEXT;
  _expected_signature TEXT;
  _secret TEXT;
  _algorithm TEXT := 'sha256';
BEGIN
  -- Basic validation of token format
  IF current_token IS NULL OR current_token = '' THEN
    RAISE EXCEPTION 'Token is null or empty';
  END IF;
  
  -- Split the token into parts
  _parts := string_to_array(current_token, '.');
  
  IF array_length(_parts, 1) != 3 THEN
    RAISE EXCEPTION 'Invalid token format: expecting header.payload.signature';
  END IF;
  
  _header_part := _parts[1];
  _payload_part := _parts[2];
  _signature_part := _parts[3];
  
  -- Get JWT secret
  _secret := auth.get_jwt_secret();
  
  IF _secret IS NULL OR _secret = '' THEN
    RAISE EXCEPTION 'JWT secret is not configured';
  END IF;
  
  -- Calculate expected signature with alternative methods until one matches
  -- Method 1: Standard base64 (no URL encoding)
  _expected_signature := rtrim(
    replace(
      encode(
        hmac(
          _header_part || '.' || _payload_part,
          _secret,
          _algorithm
        ),
        'base64'
      ),
      '=',
      ''
    ),
    chr(10)
  );
  
  -- Method 2: Base64url encoding
  IF _signature_part != _expected_signature THEN
    _expected_signature := replace(
      replace(
        rtrim(
          replace(
            encode(
              hmac(
                _header_part || '.' || _payload_part,
                _secret,
                _algorithm
              ),
              'base64'
            ),
            '=',
            ''
          ),
          chr(10)
        ),
        '+',
        '-'
      ),
      '/',
      '_'
    );
  END IF;
  
  -- Method 3: Full base64url conversion
  IF _signature_part != _expected_signature THEN
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
      ),
      chr(10)
    );
  END IF;
  
  -- Verify signature using any of the methods
  IF _signature_part != _expected_signature THEN
    RAISE EXCEPTION 'Invalid token signature';
  END IF;
  
  -- Decode the payload
  _payload := convert_from(
    decode(
      _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
      'base64'
    ),
    'UTF8'
  )::JSONB;
  
  -- Check expiration
  IF (_payload->>'exp')::NUMERIC < extract(epoch from now()) THEN
    RAISE EXCEPTION 'Token has expired';
  END IF;
  
  -- Extract the user ID from payload
  _user_id := (_payload->>'sub')::UUID;
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Token missing subject claim';
  END IF;
  
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION trace_token_verification(TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION refresh_token_v2(TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION refresh_token_v2(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_token_v2(TEXT) TO artist;

-- Update comments
COMMENT ON FUNCTION trace_token_verification(TEXT) IS 'Debug function that provides detailed tracing of JWT token verification steps';
COMMENT ON FUNCTION refresh_token_v2(TEXT) IS 'Improved token refresh function with better signature verification methods';
