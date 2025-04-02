-- Migration: 030_add_jwt_debug_functions.sql
-- Description: Adds debugging functions for JWT token issues
-- IMPORTANT: These functions should be disabled or removed in production

-- Set the search path
SET search_path TO prettygood_private, prettygood, public;

-- Debug function to verify a token and return detailed info about why it might be failing
CREATE OR REPLACE FUNCTION prettygood.debug_verify_token(token TEXT)
RETURNS JSONB AS $$
DECLARE
  _verify_result JSONB;
  _decoded_payload JSONB;
  _user_info JSONB;
  _header TEXT;
  _payload TEXT;
  _signature TEXT;
  _jwt_secret TEXT;
BEGIN
  -- Only allow in development
  IF current_setting('app.environment', TRUE) = 'production' THEN
    RETURN jsonb_build_object('error', 'Debug functions disabled in production');
  END IF;

  -- Get the JWT secret
  BEGIN
    _jwt_secret := auth.get_jwt_secret();
  EXCEPTION WHEN OTHERS THEN
    _jwt_secret := NULL;
  END;

  -- Basic JWT structure check
  IF token IS NULL THEN
    RETURN jsonb_build_object('error', 'Token is null');
  END IF;

  -- Split token into parts
  _header := split_part(token, '.', 1);
  _payload := split_part(token, '.', 2);
  _signature := split_part(token, '.', 3);

  IF _header IS NULL OR _payload IS NULL OR _signature IS NULL OR 
     _header = '' OR _payload = '' OR _signature = '' THEN
    RETURN jsonb_build_object('error', 'Token does not have three parts');
  END IF;

  -- Try to decode payload without verification
  BEGIN
    _decoded_payload := convert_from(
      decode(
        _payload || repeat('=', (4 - length(_payload) % 4) % 4),
        'base64'
      ),
      'UTF8'
    )::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Cannot decode payload',
      'detail', SQLERRM,
      'payload_part', _payload
    );
  END;

  -- Check token structure
  IF _decoded_payload->>'sub' IS NULL THEN
    RETURN jsonb_build_object(
      'error', 'Token missing subject (sub) claim',
      'payload', _decoded_payload
    );
  END IF;

  -- Check user existence
  BEGIN
    SELECT jsonb_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'role', u.role,
      'exists', TRUE
    )
    INTO _user_info
    FROM prettygood.users u
    WHERE u.id = (_decoded_payload->>'sub')::UUID;

    IF _user_info IS NULL THEN
      _user_info := jsonb_build_object('exists', FALSE);
    END IF;
  EXCEPTION WHEN OTHERS THEN
    _user_info := jsonb_build_object(
      'error', 'Error checking user',
      'detail', SQLERRM
    );
  END;

  -- Try to verify with auth.verify_jwt
  BEGIN
    _verify_result := auth.verify_jwt(token)::JSONB;
    RETURN jsonb_build_object(
      'success', TRUE,
      'verification', 'Token verified successfully',
      'payload', _decoded_payload,
      'user', _user_info,
      'exp_date', to_timestamp((_decoded_payload->>'exp')::DOUBLE PRECISION),
      'is_expired', ((_decoded_payload->>'exp')::DOUBLE PRECISION < extract(epoch from now())),
      'now', now(),
      'jwt_secret_exists', _jwt_secret IS NOT NULL
    );
  EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'error', 'Token verification failed',
      'detail', SQLERRM,
      'payload', _decoded_payload,
      'user', _user_info,
      'exp_date', to_timestamp((_decoded_payload->>'exp')::DOUBLE PRECISION),
      'is_expired', ((_decoded_payload->>'exp')::DOUBLE PRECISION < extract(epoch from now())),
      'now', now(),
      'jwt_secret_exists', _jwt_secret IS NOT NULL
    );
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Debug function to check JWT configuration
CREATE OR REPLACE FUNCTION prettygood.debug_get_jwt_info()
RETURNS JSONB AS $$
DECLARE
  _jwt_secret TEXT;
  _has_secrets_table BOOLEAN;
  _has_jwt_env BOOLEAN;
  _algorithm TEXT := 'sha256';
BEGIN
  -- Only allow in development
  IF current_setting('app.environment', TRUE) = 'production' THEN
    RETURN jsonb_build_object('error', 'Debug functions disabled in production');
  END IF;

  -- Check if secrets table exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'secrets'
  ) INTO _has_secrets_table;

  -- Try to get JWT secret from environment
  BEGIN
    _has_jwt_env := current_setting('app.jwt_secret', TRUE) IS NOT NULL;
  EXCEPTION WHEN OTHERS THEN
    _has_jwt_env := FALSE;
  END;

  -- Get the JWT secret (not returning the actual value for security)
  BEGIN
    _jwt_secret := auth.get_jwt_secret();
  EXCEPTION WHEN OTHERS THEN
    _jwt_secret := NULL;
  END;

  -- Return configuration info
  RETURN jsonb_build_object(
    'jwt_secret_exists', _jwt_secret IS NOT NULL,
    'jwt_secret_length', CASE WHEN _jwt_secret IS NULL THEN 0 ELSE length(_jwt_secret) END,
    'secrets_table_exists', _has_secrets_table,
    'jwt_env_var_set', _has_jwt_env,
    'algorithm', _algorithm,
    'auth_functions', jsonb_build_object(
      'auth.generate_jwt', has_function_privilege('auth.generate_jwt(uuid,text,integer)', 'execute'),
      'auth.verify_jwt', has_function_privilege('auth.verify_jwt(text,text)', 'execute'),
      'prettygood.refresh_token', has_function_privilege('prettygood.refresh_token(text)', 'execute')
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION debug_verify_token(TEXT) TO postgres;
GRANT EXECUTE ON FUNCTION debug_get_jwt_info() TO postgres;

-- Grant execute to authenticated users for API access
GRANT EXECUTE ON FUNCTION debug_verify_token(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION debug_get_jwt_info() TO authenticated;

-- Add warnings as comments
COMMENT ON FUNCTION debug_verify_token(TEXT) IS 
'DEBUG ONLY - Returns detailed information about a JWT token to help diagnose verification issues.
 This function should be disabled or removed in production environments.';

COMMENT ON FUNCTION debug_get_jwt_info() IS 
'DEBUG ONLY - Returns information about JWT configuration (without exposing secrets).
 This function should be disabled or removed in production environments.';
