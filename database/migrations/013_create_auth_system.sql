-- Migration: 013_create_auth_system.sql
-- Description: Creates JWT authentication functions for PostgREST

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Create a table to store our secret
CREATE TABLE IF NOT EXISTS auth.secrets (
  id INTEGER PRIMARY KEY,
  jwt_secret TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure we have exactly one record with a secret
INSERT INTO auth.secrets (id, jwt_secret)
SELECT 1, gen_random_uuid()::TEXT
WHERE NOT EXISTS (SELECT 1 FROM auth.secrets WHERE id = 1);

-- Function to generate JWT token with user information
CREATE OR REPLACE FUNCTION auth.generate_jwt(
  user_id UUID,
  role TEXT DEFAULT 'user',
  exp INTEGER DEFAULT 3600 -- 1 hour expiration by default
) RETURNS TEXT AS $$
DECLARE
  secret TEXT;
  algorithm TEXT := 'HS256';
  header JSON;
  payload JSON;
  signature TEXT;
BEGIN
  -- Get the secret from the secrets table
  SELECT jwt_secret INTO secret FROM auth.secrets WHERE id = 1;
  
  -- Create the JWT header
  header := json_build_object(
    'alg', algorithm,
    'typ', 'JWT'
  );
  
  -- Create the JWT payload
  payload := json_build_object(
    'role', role,
    'user_id', user_id,
    'exp', extract(epoch from now())::integer + exp,
    'iat', extract(epoch from now())::integer
  );
  
  -- Return the composed JWT token
  RETURN 
    rtrim(replace(encode(header::text::bytea, 'base64'), '=', ''), chr(10)) || '.' ||
    rtrim(replace(encode(payload::text::bytea, 'base64'), '=', ''), chr(10)) || '.' ||
    rtrim(replace(encode(hmac(payload::text, secret, algorithm), 'base64'), '=', ''), chr(10));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to verify Sui wallet signatures (mock function)
-- In a real implementation, this would use cryptographic libraries to verify the signature
CREATE OR REPLACE FUNCTION auth.verify_wallet_signature(
  wallet_address TEXT,
  message TEXT,
  signature TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- This is a mock implementation that always returns true
  -- In a real implementation, this would verify the signature cryptographically
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to authenticate a user with their wallet
CREATE OR REPLACE FUNCTION prettygood.authenticate_wallet(
  wallet_address TEXT,
  signature TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  nonce TEXT;
  user_role TEXT;
  nonce_valid BOOLEAN;
  signature_valid BOOLEAN;
BEGIN
  -- Get the user from the wallet address
  SELECT u.id INTO user_id
  FROM prettygood.users u
  WHERE u.wallet_address = authenticate_wallet.wallet_address;
  
  -- Check if user exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not found for wallet address: %', wallet_address;
  END IF;
  
  -- Get the nonce
  SELECT 
    a.nonce, 
    a.nonce_created_at > (NOW() - INTERVAL '15 minutes')
  INTO nonce, nonce_valid
  FROM prettygood_private.user_auth a
  WHERE a.user_id = user_id;
  
  -- Check if nonce exists and is valid
  IF nonce IS NULL OR NOT nonce_valid THEN
    RAISE EXCEPTION 'Invalid or expired nonce. Please request a new one.';
  END IF;
  
  -- Construct the message that would have been signed
  -- In a real implementation, this would be a standardized message format
  -- that includes the nonce and perhaps domain separation
  -- e.g. "Sign this message to authenticate with prettygood.music: [nonce]"
  
  -- Verify the signature
  signature_valid := auth.verify_wallet_signature(
    wallet_address,
    'Sign this message to authenticate with prettygood.music: ' || nonce,
    signature
  );
  
  IF NOT signature_valid THEN
    RAISE EXCEPTION 'Invalid signature';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO user_role;
  
  -- Update last sign in time
  UPDATE prettygood_private.user_auth
  SET 
    nonce = NULL, -- Clear the nonce
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE user_id = user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(user_id, user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to refresh the JWT token
CREATE OR REPLACE FUNCTION prettygood.refresh_token() RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  user_role TEXT;
BEGIN
  -- Get the user ID from the current JWT claims
  user_id := prettygood_private.current_user_id();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO user_role;
  
  -- Generate a new JWT token
  RETURN auth.generate_jwt(user_id, user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a special role for authenticated requests
DO $$
BEGIN
  -- Create a role for API requests if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'api_user') THEN
    CREATE ROLE api_user NOLOGIN;
  END IF;
  
  -- Create a role for anonymous requests if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  
  -- Create a role for authenticated users if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  
  -- Create a role for artists if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'artist') THEN
    CREATE ROLE artist NOLOGIN;
  END IF;
END $$;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA prettygood TO api_user, anon, authenticated, artist;
GRANT USAGE ON SCHEMA prettygood_private TO api_user;
GRANT USAGE ON SCHEMA auth TO api_user;

-- Public schema access for all roles
GRANT SELECT ON ALL TABLES IN SCHEMA prettygood TO api_user, anon, authenticated, artist;

-- Additional permissions based on role
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA prettygood TO authenticated, artist;

-- Authenticated user role inherits from anon
GRANT anon TO authenticated;

-- Artist role inherits from authenticated user role
GRANT authenticated TO artist;

-- Add comments
COMMENT ON FUNCTION auth.generate_jwt IS 'Generates a JWT token for authentication';
COMMENT ON FUNCTION auth.verify_wallet_signature IS 'Verifies a wallet signature (mock implementation for development)';
COMMENT ON FUNCTION prettygood.authenticate_wallet IS 'Authenticates a user with their wallet and returns a JWT token';
COMMENT ON FUNCTION prettygood.refresh_token IS 'Refreshes the JWT token for the current user';
