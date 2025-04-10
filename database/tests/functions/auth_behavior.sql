-- Test file: auth_behavior.sql
-- Description: Tests the behavior of authentication functions

-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(23);

-- Set up test data
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Create a test user for the test cases
    INSERT INTO prettygood.users (username, email, display_name)
    VALUES ('testuser', 'test@example.com', 'Test User')
    RETURNING id INTO test_user_id;
    
    -- Add initial auth record
    INSERT INTO prettygood_private.user_auth (user_id, password_hash)
    VALUES (test_user_id, crypt('password123', gen_salt('bf')));
END $$;

-- Test 1: Register new user
SELECT lives_ok(
    $$SELECT prettygood.register_user('newuser', 'new@example.com', 'Password123!', 'New User')$$,
    'Should be able to register a new user with valid credentials'
);

-- Verify the newly registered user exists
SELECT ok(
    EXISTS(SELECT 1 FROM prettygood.users WHERE username = 'newuser' AND email = 'new@example.com'),
    'New user should exist in users table'
);

-- Test 2: Register with duplicate username
SELECT throws_ok(
    $$SELECT prettygood.register_user('testuser', 'another@example.com', 'Password123!')$$,
    'Username already exists',
    'Should not allow registration with existing username'
);

-- Test 3: Register with duplicate email
SELECT throws_ok(
    $$SELECT prettygood.register_user('anotheruser', 'test@example.com', 'Password123!')$$,
    'Email already exists',
    'Should not allow registration with existing email'
);

-- Test 4: Register with weak password
SELECT throws_ok(
    $$SELECT prettygood.register_user('weakpass', 'weak@example.com', '123')$$,
    'Password must be at least 8 characters long',
    'Should not allow registration with weak password'
);

-- Test 5: Authenticate with correct credentials
SELECT lives_ok(
    $$SELECT prettygood.authenticate_user('testuser', 'password123')$$,
    'Should authenticate user with correct username and password'
);

-- Test 6: Authenticate with incorrect password
SELECT throws_ok(
    $$SELECT prettygood.authenticate_user('testuser', 'wrongpassword')$$,
    'Invalid email/username or password',
    'Should reject authentication with incorrect password'
);

-- Test 7: Authenticate with non-existent user
SELECT throws_ok(
    $$SELECT prettygood.authenticate_user('nonexistent', 'password123')$$,
    'Invalid email/username or password',
    'Should reject authentication for non-existent user'
);

-- Test 8: Create email verification token
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        user_id UUID;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'testuser';
        token := prettygood.create_email_verification_token(user_id);
        PERFORM 1 FROM prettygood_private.email_verification_tokens 
        WHERE user_id = user_id AND token = token;
    END
    $$,
    'Should create email verification token'
);

-- Test 9: Verify email
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        user_id UUID;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'testuser';
        
        -- Create a token and then verify it
        token := prettygood.create_email_verification_token(user_id);
        PERFORM prettygood.verify_email(token);
        
        -- Check that email is marked as verified
        PERFORM 1 FROM prettygood.users WHERE id = user_id AND email_verified = TRUE;
    END
    $$,
    'Should verify email with valid token'
);

-- Test 10: Verify with invalid token
SELECT throws_ok(
    $$SELECT prettygood.verify_email('invalid_token_that_does_not_exist')$$,
    'Invalid verification token',
    'Should reject verification with invalid token'
);

-- Test 11: Request password reset
SELECT lives_ok(
    $$SELECT prettygood.request_password_reset('test@example.com')$$,
    'Should generate password reset token for existing email'
);

-- Verify reset token was created
SELECT ok(
    EXISTS(
        SELECT 1 FROM prettygood_private.user_auth a
        JOIN prettygood.users u ON a.user_id = u.id
        WHERE u.email = 'test@example.com' AND a.reset_token IS NOT NULL
    ),
    'Reset token should be saved in user_auth'
);

-- Test 12: Reset password with valid token
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        result BOOLEAN;
    BEGIN
        -- Get the reset token
        SELECT a.reset_token INTO token
        FROM prettygood_private.user_auth a
        JOIN prettygood.users u ON a.user_id = u.id
        WHERE u.email = 'test@example.com';
        
        -- Reset the password
        result := prettygood.reset_password(token, 'NewPassword123!');
    END
    $$,
    'Should reset password with valid token'
);

-- Test 13: Reset password with invalid token
SELECT throws_ok(
    $$SELECT prettygood.reset_password('invalid_token', 'NewPassword123!')$$,
    'Invalid or expired reset token',
    'Should reject password reset with invalid token'
);

-- Test 14: Authenticate with new password
SELECT lives_ok(
    $$SELECT prettygood.authenticate_user('testuser', 'NewPassword123!')$$,
    'Should authenticate with new password after reset'
);

-- Test 15: Record failed login attempts
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'testuser';
        
        -- Record a failed login
        PERFORM prettygood_private.record_failed_login(user_id);
        
        -- Verify failed_login_attempts was incremented
        PERFORM 1 FROM prettygood_private.user_auth 
        WHERE user_id = user_id AND failed_login_attempts > 0;
    END
    $$,
    'Should record failed login attempt'
);

-- Test 16: Account lockout after multiple failures
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
        is_locked BOOLEAN;
    BEGIN
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'testuser';
        
        -- Record multiple failed logins to trigger lockout
        UPDATE prettygood_private.user_auth
        SET failed_login_attempts = 4
        WHERE user_id = user_id;
        
        -- Record one more to reach threshold (5)
        PERFORM prettygood_private.record_failed_login(user_id);
        
        -- Check if account is locked
        is_locked := prettygood_private.check_account_lockout(user_id);
        
        -- Verify account is locked
        IF NOT is_locked THEN
            RAISE EXCEPTION 'Account should be locked';
        END IF;
    END
    $$,
    'Should lock account after multiple failed attempts'
);

-- Test 17: Authenticate during lockout
SELECT throws_ok(
    $$
    -- Try to authenticate when account is locked
    SELECT prettygood.authenticate_user('testuser', 'NewPassword123!')
    $$,
    'Account is temporarily locked due to too many failed login attempts',
    'Should reject authentication when account is locked'
);

-- Test 18: JWT includes email_verified claim
SELECT lives_ok(
    $$
    DECLARE
        token TEXT;
        parts TEXT[];
        payload TEXT;
        json_payload JSON;
        has_claim BOOLEAN;
    BEGIN
        -- Register a new user to get a fresh token
        token := (SELECT prettygood.authenticate_user('newuser', 'Password123!'));
        
        -- Split token to get payload
        parts := string_to_array(token, '.');
        
        -- Payload is base64 encoded
        payload := convert_from(decode(replace(parts[2], '-', '+') || 
                              case when length(parts[2]) % 4 = 0 then '' 
                                   when length(parts[2]) % 4 = 2 then '==' 
                                   when length(parts[2]) % 4 = 3 then '=' end, 'base64'), 'utf8');
        
        json_payload := payload::json;
        
        -- Check for email_verified claim
        has_claim := json_payload ? 'email_verified';
        
        IF NOT has_claim THEN
            RAISE EXCEPTION 'JWT payload should include email_verified claim';
        END IF;
    END;
    $$,
    'JWT should include email_verified claim'
);

-- Test 19: Successful login resets failed attempts
SELECT lives_ok(
    $$
    DECLARE
        user_id UUID;
    BEGIN
        -- Unlock the account for this test
        SELECT id INTO user_id FROM prettygood.users WHERE username = 'testuser';
        UPDATE prettygood_private.user_auth
        SET failed_login_attempts = 1, locked_until = NULL
        WHERE user_id = user_id;
        
        -- Authenticate successfully
        PERFORM prettygood.authenticate_user('testuser', 'NewPassword123!');
        
        -- Verify failed_login_attempts was reset
        PERFORM 1 FROM prettygood_private.user_auth 
        WHERE user_id = user_id AND failed_login_attempts = 0;
    END;
    $$,
    'Successful login should reset failed login attempts'
);

-- Test 20: Register function generates email verification token
SELECT ok(
    (SELECT json_typeof((prettygood.register_user('tokentester', 'token@example.com', 'SecurePass123!', 'Token Tester')::json->'verification_token'))) = 'string',
    'Register function should return verification token'
);

-- Test 21: Email verification returns expected result
SELECT ok(
    EXISTS(
        SELECT 1 FROM prettygood.users WHERE username = 'newuser' AND email_verified = FALSE
    ),
    'Email should start as unverified'
);

-- Cleanup test data
DO $$
BEGIN
    DELETE FROM prettygood_private.user_auth WHERE user_id IN 
        (SELECT id FROM prettygood.users WHERE username IN ('testuser', 'newuser', 'tokentester'));
    DELETE FROM prettygood.users WHERE username IN ('testuser', 'newuser', 'tokentester');
END $$;

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
