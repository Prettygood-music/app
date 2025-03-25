-- Test setup file
-- This file is run before any tests to set up the test environment

-- Load pgTAP extension if it exists
CREATE EXTENSION IF NOT EXISTS pgtap;

-- If pgTAP can't be loaded as an extension, try to load it as a module
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgtap') THEN
        -- Try to load pgTAP from the system path
        LOAD 'pgtap';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'pgTAP is not available. Tests requiring pgTAP will fail.';
END $$;
