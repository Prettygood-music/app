-- Migration: 001_create_schemas.sql
-- Description: Creates the main schemas for the prettygood.music application

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS prettygood;
CREATE SCHEMA IF NOT EXISTS prettygood_private;

-- Set search path to include our schemas
-- We'll use dynamic SQL to set the search path for the current database
DO $$
BEGIN
    EXECUTE 'ALTER DATABASE ' || current_database() || ' SET search_path TO prettygood, prettygood_private, public';
END $$;

COMMENT ON SCHEMA prettygood IS 'Public schema for prettygood.music application';
COMMENT ON SCHEMA prettygood_private IS 'Private schema for sensitive data and authentication in prettygood.music application';
