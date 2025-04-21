-- Migration: 004_artist_registration.sql
-- Description: Consolidates artist registration functionality
-- This migration replaces and fixes:
-- - portions of 003_create_artists.sql
-- - 038_add_explicit_artist_registration.sql

-- Set search path
SET search_path TO prettygood, prettygood_private, public;

-- Ensure the artists table has all necessary columns
DO $$
BEGIN
    -- Add verification status if missing
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'prettygood' 
                  AND table_name = 'artists'
                  AND column_name = 'verified') THEN
        ALTER TABLE prettygood.artists ADD COLUMN verified BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add approval status if missing
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'prettygood' 
                  AND table_name = 'artists'
                  AND column_name = 'approved') THEN
        ALTER TABLE prettygood.artists ADD COLUMN approved BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add application date if missing
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'prettygood' 
                  AND table_name = 'artists'
                  AND column_name = 'application_date') THEN
        ALTER TABLE prettygood.artists ADD COLUMN application_date TIMESTAMPTZ;
    END IF;
    
    -- Add application notes if missing
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'prettygood' 
                  AND table_name = 'artists'
                  AND column_name = 'application_notes') THEN
        ALTER TABLE prettygood.artists ADD COLUMN application_notes TEXT;
    END IF;
END $$;

-- Drop existing artist registration function to avoid conflicts
DROP FUNCTION IF EXISTS prettygood.register_as_artist(text, text, text[], text, text, jsonb);

-- Create improved function for artist registration
CREATE OR REPLACE FUNCTION prettygood.apply_for_artist_account(
    artist_name TEXT,
    bio TEXT DEFAULT NULL,
    genre TEXT[] DEFAULT '{}',
    location TEXT DEFAULT NULL,
    website TEXT DEFAULT NULL,
    social_links JSONB DEFAULT NULL,
    application_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    current_user_id UUID := prettygood_private.current_user_id();
    new_artist_id UUID;
    result JSONB;
BEGIN
    -- Check authentication
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Check if user is already an artist
    IF EXISTS (SELECT 1 FROM prettygood.artists WHERE id = current_user_id) THEN
        RAISE EXCEPTION 'User is already registered as an artist';
    END IF;
    
    -- Create pending artist application
    INSERT INTO prettygood.artists (
        id,
        artist_name,
        bio,
        genre,
        location,
        website,
        social_links,
        verified,
        approved,
        application_date,
        application_notes
    )
    VALUES (
        current_user_id,
        artist_name,
        bio,
        COALESCE(genre, '{}'),
        location,
        website,
        COALESCE(social_links, '{}'::jsonb),
        FALSE,           -- Not verified initially
        FALSE,           -- Not approved initially
        NOW(),           -- Application timestamp
        application_notes
    )
    RETURNING id INTO new_artist_id;
    
    -- Update user role to indicate pending artist status
    UPDATE prettygood.users 
    SET role = 'pending_artist'
    WHERE id = current_user_id;
    
    -- Return application status
    result := json_build_object(
        'artist_id', new_artist_id,
        'status', 'pending_approval',
        'application_date', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for admins to approve artist applications
CREATE OR REPLACE FUNCTION prettygood.approve_artist_application(
    artist_id UUID,
    approved BOOLEAN,
    admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check administrator privileges
    IF NOT prettygood_private.is_admin() THEN
        RAISE EXCEPTION 'Administrator privileges required';
    END IF;
    
    -- Check if artist record exists
    IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
        RAISE EXCEPTION 'Artist not found';
    END IF;
    
    -- Update artist approval status
    UPDATE prettygood.artists
    SET 
        approved = approve_artist_application.approved,
        application_notes = CASE 
            WHEN admin_notes IS NOT NULL 
            THEN COALESCE(application_notes, '') || E'\n\nAdmin Notes (' || NOW() || '): ' || admin_notes
            ELSE application_notes
        END
    WHERE id = artist_id;
    
    -- Update user role based on approval
    IF approved THEN
        UPDATE prettygood.users
        SET role = 'artist'
        WHERE id = artist_id;
    ELSE
        UPDATE prettygood.users
        SET role = 'user'
        WHERE id = artist_id;
    END IF;
    
    -- Return result
    result := json_build_object(
        'artist_id', artist_id,
        'approved', approved,
        'processed_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to verify artist
CREATE OR REPLACE FUNCTION prettygood.verify_artist(
    artist_id UUID,
    verified BOOLEAN
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check administrator privileges
    IF NOT prettygood_private.is_admin() THEN
        RAISE EXCEPTION 'Administrator privileges required';
    END IF;
    
    -- Check if artist record exists
    IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
        RAISE EXCEPTION 'Artist not found';
    END IF;
    
    -- Update artist verification status
    UPDATE prettygood.artists
    SET verified = verify_artist.verified
    WHERE id = artist_id;
    
    -- Return result
    result := json_build_object(
        'artist_id', artist_id,
        'verified', verified,
        'processed_at', NOW()
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION prettygood.apply_for_artist_account IS 'Allows a user to apply for an artist account, subject to approval';
COMMENT ON FUNCTION prettygood.approve_artist_application IS 'Allows administrators to approve or reject artist account applications';
COMMENT ON FUNCTION prettygood.verify_artist IS 'Allows administrators to verify artist accounts to display verification badge';
