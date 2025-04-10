-- Create extension in the main database
CREATE EXTENSION IF NOT EXISTS pgtap;

-- Create test database conditionally (will be handled through env in entrypoint script)
DO $$
BEGIN
    -- Check if POSTGRES_TEST_DB variable is set to 'true'
    BEGIN
        IF current_setting('POSTGRES_TEST_DB', true) = 'true' THEN
            -- Try to create test database
            BEGIN
                CREATE DATABASE prettygood_test;
                
                -- Connect to the test database and create extension
                PERFORM dblink_exec('dbname=prettygood_test', 
                    'CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA public;');
            EXCEPTION
                WHEN duplicate_database THEN
                    -- Database already exists, do nothing
                    RAISE NOTICE 'Test database already exists';
                WHEN OTHERS THEN
                    -- Log other errors but continue
                    RAISE NOTICE 'Error creating test database: %', SQLERRM;
            END;
        END IF;
    EXCEPTION
        WHEN undefined_object THEN
            -- Variable doesn't exist, just continue silently
            NULL;
    END;
END
$$;

-- Create dblink extension (needed for cross-db operations)
CREATE EXTENSION IF NOT EXISTS dblink;
