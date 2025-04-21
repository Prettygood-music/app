-- Initialization script for PrettyGood Music on Supabase
-- This script ensures schemas are created in the correct order

-- First, create the necessary schema
CREATE SCHEMA IF NOT EXISTS prettygood;
COMMENT ON SCHEMA prettygood IS 'Schema for prettygood.music application containing all data and functions';

-- Create the core function in the schema
CREATE OR REPLACE FUNCTION prettygood.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if auth schema exists (Supabase should have created this)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    RAISE EXCEPTION 'Auth schema does not exist. Make sure Supabase is properly initialized.';
  END IF;
END
$$;

-- Now you can apply the schema files in order
-- Example of how to include them:
-- \i schemas/00_core_schemas.sql
-- \i schemas/01_users.sql
-- etc.

-- Reminder to run this with:
-- psql -U postgres -d your_database_name -f init.sql
