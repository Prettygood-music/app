-- Core schemas must be created first
-- Create core schema for the Pretty Good Music application
CREATE SCHEMA IF NOT EXISTS prettygood;
COMMENT ON SCHEMA prettygood IS 'Schema for prettygood.music application containing all data and functions';

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create auth schema if not already created by Supabase
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    CREATE SCHEMA IF NOT EXISTS auth;
  END IF;
END
$$;

-- Base updated_at function for all tables
-- Must be created after the schema exists
CREATE OR REPLACE FUNCTION prettygood.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: We're now using RLS instead of a separate private schema
-- for better compliance with Supabase design patterns.
