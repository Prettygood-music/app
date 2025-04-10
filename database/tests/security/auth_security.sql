-- Test file: auth_security.sql
-- Description: Tests for authentication security features

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(10);

-- Setup test data
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Create a test user for the test cases
    INSERT INTO prettygood.users (username, email, display_name, email_verified)
    VALUES ('securitytest', 'security@example.com', 'Security Test', TRUE)
    RETURNING id INTO test_user_id;
    
    -- Add auth record with a known password
    INSERT INTO prettygood_private.user_auth (user_id, password_hash)
    VALUES (test_user_id, crypt('SecurePassword123!', gen_salt('bf')));
END $$;

-- Test 1: Password hashing is secure
SELECT isnt(
    (SELECT password_hash FROM prettygood_private.user_auth WHERE user_id = 
     (SELECT id FROM prettygood.users WHERE username = 'securitytest')),
    'SecurePassword123!',
    'Password should be stored as a hash, not plaintext'
);

-- Test 2: Different passwords produce different hashes
SELECT isnt(
    crypt('password1', gen_salt('bf')),
    crypt('password1', gen_salt('bf')),
    'Same password should produce different hashes with different salts'
);

-- Test 3: Password hashing is deterministic with same salt
SELECT ok(
    (SELECT password_hash = crypt('SecurePassword123!', password_hash) 
     FROM prettygood_private.user_auth 
     WHERE user_id = (SELECT id FROM prettygood.users WHERE username = 'securitytest')),
    'Password verification should work by hashing with the same salt'
);

-- Test 4: Reset token uses a secure length
SELECT ok(
    length(prettygood.request_password_reset('security@example.com')) >= 32,
    'Reset token should be at least 32 characters for security'
);

-- Test 5: Verification token is securely generated
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        user_id UUID;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'securitytest';
        token := prettygood.create_email_verification_token(user_id);
        
        -- Ensure token is sufficiently long
        IF length(token) < 32 THEN
            RAISE EXCEPTION 'Token is too short for security';
        END IF;
    END
    $$,
    'Email verification token should be securely generated'
);

-- Test 6: Failed login attempts tracking
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
        attempts_before INTEGER;
        attempts_after INTEGER;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'securitytest';
        
        -- Get current attempts
        SELECT failed_login_attempts INTO attempts_before 
        FROM prettygood_private.user_auth 
        WHERE user_id = user_id;
        
        -- Record a failed attempt
        PERFORM prettygood_private.record_failed_login(user_id);
        
        -- Get updated attempts
        SELECT failed_login_attempts INTO attempts_after 
        FROM prettygood_private.user_auth 
        WHERE user_id = user_id;
        
        -- Verify attempts were incremented
        IF attempts_after <= attempts_before THEN
            RAISE EXCEPTION 'Failed login attempts not incremented';
        END IF;
    END
    $$,
    'Failed login attempts should be tracked'
);

-- Test 7: Account lockout mechanism
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
        is_locked BOOLEAN;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'securitytest';
        
        -- Set to just below threshold
        UPDATE prettygood_private.user_auth
        SET failed_login_attempts = 4
        WHERE user_id = user_id;
        
        -- Record one more to hit threshold (5)
        PERFORM prettygood_private.record_failed_login(user_id);
        
        -- Check locked status
        SELECT locked_until IS NOT NULL INTO is_locked
        FROM prettygood_private.user_auth
        WHERE user_id = user_id;
        
        IF NOT is_locked THEN
            RAISE EXCEPTION 'Account not locked after threshold reached';
        END IF;
    END
    $$,
    'Account should be locked after exceeding threshold'
);

-- Test 8: JWT token structure is valid
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        parts TEXT[];
    BEGIN
        -- Unlock account for this test
        UPDATE prettygood_private.user_auth
        SET failed_login_attempts = 0, locked_until = NULL
        WHERE user_id = (SELECT id FROM prettygood.users WHERE username = 'securitytest');
        
        -- Get a token
        token := prettygood.authenticate_user('securitytest', 'SecurePassword123!');
        
        -- Validate token format (should have 3 parts separated by dots)
        parts := string_to_array(token, '.');
        
        IF array_length(parts, 1) != 3 THEN
            RAISE EXCEPTION 'JWT token should have 3 parts';
        END IF;
    END
    $$,
    'JWT token should have valid structure'
);

-- Test 9: Reset token expiration is properly set
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
        expiration TIMESTAMPTZ;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'securitytest';
        
        -- Request reset
        PERFORM prettygood.request_password_reset('security@example.com');
        
        -- Check expiration is set to future
        SELECT reset_token_expires_at INTO expiration
        FROM prettygood_private.user_auth
        WHERE user_id = user_id;
        
        IF expiration IS NULL OR expiration <= NOW() THEN
            RAISE EXCEPTION 'Reset token expiration not properly set';
        END IF;
    END
    $$,
    'Reset token expiration should be set to future time'
);

-- Test 10: Email verification expiration is properly set
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
        token TEXT;
        expiration TIMESTAMPTZ;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'securitytest';
        
        -- Create verification token
        token := prettygood.create_email_verification_token(user_id);
        
        -- Check expiration is set to future
        SELECT expires_at INTO expiration
        FROM prettygood_private.email_verification_tokens
        WHERE user_id = user_id;
        
        IF expiration IS NULL OR expiration <= NOW() THEN
            RAISE EXCEPTION 'Verification token expiration not properly set';
        END IF;
    END
    $$,
    'Email verification token expiration should be set to future time'
);

-- Cleanup test data
DO $$
BEGIN
    DELETE FROM prettygood_private.user_auth WHERE user_id = 
        (SELECT id FROM prettygood.users WHERE username = 'securitytest');
    DELETE FROM prettygood.users WHERE username = 'securitytest';
END $$;

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
