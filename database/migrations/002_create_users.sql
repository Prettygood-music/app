-- Migration: 002_create_users.sql
-- Description: Creates the core user tables for the prettygood.music application

-- Users table
CREATE TABLE IF NOT EXISTS prettygood.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE,
  profile_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON prettygood.users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_username ON prettygood.users(username);

-- Store authentication details in private schema
CREATE TABLE IF NOT EXISTS prettygood_private.user_auth (
  user_id UUID PRIMARY KEY REFERENCES prettygood.users(id) ON DELETE CASCADE,
  nonce TEXT,
  nonce_created_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ,
  last_sign_in_ip TEXT
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION prettygood_private.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON prettygood.users
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Comments for documentation
COMMENT ON TABLE prettygood.users IS 'User accounts for the prettygood.music platform';
COMMENT ON TABLE prettygood_private.user_auth IS 'Private authentication details for users';
COMMENT ON COLUMN prettygood.users.wallet_address IS 'Sui blockchain wallet address used for authentication';
COMMENT ON COLUMN prettygood.users.username IS 'Unique username for the user';
COMMENT ON COLUMN prettygood_private.user_auth.nonce IS 'Random value used for wallet signature verification';
