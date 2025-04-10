-- Migration: 028_fix_jwt_algorithm.sql
-- Description: Fixes JWT signing algorithm issue using SHA256
-- First, check if auth schema exists, create if it doesn't
CREATE SCHEMA IF NOT EXISTS auth;
-- Create function to get JWT secret from environment variable
CREATE OR REPLACE FUNCTION auth.get_jwt_secret() RETURNS TEXT AS $$
DECLARE _secret TEXT;
BEGIN -- Try to get the secret from environment variable
BEGIN -- This uses the PostgreSQL CURRENT_SETTING function to read settings
_secret := CURRENT_SETTING('app.jwt_secret', true);
-- If we get here, we got a value from the app settings
IF _secret IS NULL
OR _secret = '' THEN -- Fall back to secrets table - checking first what columns exist
IF EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'auth'
    AND table_name = 'secrets'
    AND column_name = 'jwt_secret'
) THEN
SELECT jwt_secret INTO _secret
FROM auth.secrets
WHERE id = 1;
END IF;
-- If still null, use a default (not recommended for production)
IF _secret IS NULL THEN RAISE WARNING 'No JWT secret found in environment variable or secrets table. Using fallback secret.';
_secret := 'temporary_fallback_secret_please_set_environment_variable';
END IF;
END IF;
EXCEPTION
WHEN OTHERS THEN -- If we can't get the environment variable, fall back to secrets table
IF EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'auth'
    AND table_name = 'secrets'
    AND column_name = 'jwt_secret'
) THEN
SELECT jwt_secret INTO _secret
FROM auth.secrets
WHERE id = 1;
END IF;
-- If still null, use a default (not recommended for production)
IF _secret IS NULL THEN RAISE WARNING 'No JWT secret found in environment variable or secrets table. Using fallback secret.';
_secret := 'temporary_fallback_secret_please_set_environment_variable';
END IF;
END;
RETURN _secret;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- First drop the existing function
DROP FUNCTION IF EXISTS auth.generate_jwt(uuid, text, integer);
-- Create or replace the JWT signing function with correct algorithm 
CREATE OR REPLACE FUNCTION auth.generate_jwt(
    user_id UUID,
    role TEXT DEFAULT 'user',
    exp INTEGER DEFAULT 3600 -- 1 hour expiration by default
  ) RETURNS TEXT AS $$
DECLARE _secret TEXT := auth.get_jwt_secret();
_algorithm TEXT := 'sha256';
-- Using SHA256 which is secure and available
_header_json TEXT;
_payload_json TEXT;
_header_encoded TEXT;
_payload_encoded TEXT;
_signature TEXT;
_is_email_verified BOOLEAN;
BEGIN -- Get email verification status
SELECT email_verified INTO _is_email_verified
FROM prettygood.users
WHERE id = user_id;
-- Create the JWT header and payload as JSON strings
_header_json := '{"alg":"HS256","typ":"JWT"}';
_payload_json := json_build_object(
  'sub',
  user_id,
  'role',
  role,
  'username',
  (
    SELECT username
    FROM prettygood.users
    WHERE id = user_id
  ),
  'email',
  (
    SELECT email
    FROM prettygood.users
    WHERE id = user_id
  ),
  'email_verified',
  COALESCE(_is_email_verified, FALSE),
  'wallet_address',
  (
    SELECT wallet_address
    FROM prettygood.users
    WHERE id = user_id
  ),
  'exp',
  extract(
    epoch
    from now()
  )::integer + exp,
  'iat',
  extract(
    epoch
    from now()
  )::integer
)::text;
-- Base64url encode the header and payload
_header_encoded := rtrim(
  replace(encode(_header_json::bytea, 'base64'), '=', ''),
  chr(10)
);
_payload_encoded := rtrim(
  replace(encode(_payload_json::bytea, 'base64'), '=', ''),
  chr(10)
);
-- Create the signature using HMAC with SHA256
_signature := rtrim(
  replace(
    encode(
      hmac(
        _header_encoded || '.' || _payload_encoded,
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
-- Return the complete JWT
RETURN _header_encoded || '.' || _payload_encoded || '.' || _signature;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop and recreate the verify_jwt function
DROP FUNCTION IF EXISTS auth.verify_jwt(text, text);
-- Create or make sure the JWT verification function is compatible
CREATE OR REPLACE FUNCTION auth.verify_jwt(token TEXT, secret TEXT DEFAULT NULL) RETURNS JSON AS $$
DECLARE _header_part TEXT;
_payload_part TEXT;
_signature_part TEXT;
_payload BYTEA;
_payload_json JSON;
_algorithm TEXT := 'sha256';
-- This is the correct name for PostgreSQL's hmac function
_actual_secret TEXT;
BEGIN -- Get the secret if not provided
IF secret IS NULL THEN _actual_secret := auth.get_jwt_secret();
ELSE _actual_secret := secret;
END IF;
-- Split the token
_header_part := split_part(token, '.', 1);
_payload_part := split_part(token, '.', 2);
_signature_part := split_part(token, '.', 3);
-- Verify signature - corrected base64url handling
IF _signature_part != rtrim(
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
  )
) THEN RAISE EXCEPTION 'Invalid signature';
END IF;
-- Decode the payload - handle base64url correctly
_payload := decode(
  _payload_part || repeat('=', (4 - length(_payload_part) % 4) % 4),
  'base64'
);
-- Convert to JSON
_payload_json := convert_from(_payload, 'UTF8')::JSON;
-- Verify token has not expired
IF _payload_json->>'exp' IS NOT NULL
AND (_payload_json->>'exp')::numeric < extract(
  epoch
  from now()
) THEN RAISE EXCEPTION 'Token has expired';
END IF;
RETURN _payload_json;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Add comment explaining how to set the environment variable
COMMENT ON FUNCTION auth.get_jwt_secret IS 'Gets the JWT secret from the app.jwt_secret environment variable or falls back to the secrets table.
To set the environment variable in PostgreSQL:
ALTER DATABASE your_database_name SET app.jwt_secret = ''your_secret_here'';
-- Or for the current session only:
SET app.jwt_secret = ''your_secret_here'';';
-- Update comments
COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a JWT token for a user with the specified role and expiration using SHA256 for signatures';
COMMENT ON FUNCTION auth.verify_jwt IS 'Verifies a JWT token and returns the payload if valid';