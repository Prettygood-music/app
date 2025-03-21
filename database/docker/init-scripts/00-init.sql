-- Create test database if requested
DO $$
BEGIN
    IF '${POSTGRES_TEST_DB:-false}' = 'true' THEN
        CREATE DATABASE prettygood_test;
    END IF;
END
$$;

-- Create extension in the main database
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Create extension in the test database if it exists
DO $$
BEGIN
    IF '${POSTGRES_TEST_DB:-false}' = 'true' THEN
        EXECUTE 'CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA public;' IN prettygood_test;
    END IF;
END
$$;
