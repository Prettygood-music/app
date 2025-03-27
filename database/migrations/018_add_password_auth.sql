-- Migration: 018_add_password_auth.sql
-- Description: Adds password authentication fields to the user_auth table

-- Add password-related fields to the user_auth table
ALTER TABLE prettygood_private.user_auth
ADD COLUMN password_hash TEXT,
ADD COLUMN password_salt TEXT;

-- Add comments for documentation
COMMENT ON COLUMN prettygood_private.user_auth.password_hash IS 'Hashed password for email/password authentication, null for wallet-only users';
COMMENT ON COLUMN prettygood_private.user_auth.password_salt IS 'Salt used for password hashing, null for wallet-only users';

-- Create function to register a user with email and password
CREATE OR REPLACE FUNCTION prettygood.register_user(
  username TEXT,
  email TEXT,
  password TEXT,
  display_name TEXT DEFAULT NULL,
  wallet_address TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Validate inputs
  IF username IS NULL OR LENGTH(TRIM(username)) < 3 THEN
    RAISE EXCEPTION 'Username must be at least 3 characters long';
  END IF;

  IF email IS NULL OR email !~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF password IS NULL OR LENGTH(password) < 8 THEN
    RAISE EXCEPTION 'Password must be at least 8 characters long';
  END IF;

  -- Check if username or email already exists
  IF EXISTS (SELECT 1 FROM prettygood.users WHERE username = register_user.username) THEN
    RAISE EXCEPTION 'Username already exists';
  END IF;

  IF EXISTS (SELECT 1 FROM prettygood.users WHERE email = register_user.email) THEN
    RAISE EXCEPTION 'Email already exists';
  END IF;

  -- Insert new user
  INSERT INTO prettygood.users (
    username,
    email,
    display_name,
    wallet_address
  ) 
  VALUES (
    register_user.username,
    register_user.email,
    COALESCE(register_user.display_name, register_user.username),
    register_user.wallet_address
  )
  RETURNING id INTO new_user_id;

  -- Create auth entry with hashed password
  INSERT INTO prettygood_private.user_auth (
    user_id,
    password_hash,
    nonce_created_at
  ) 
  VALUES (
    new_user_id,
    crypt(register_user.password, gen_salt('bf')), -- Use Blowfish algorithm for hashing
    NOW()
  );

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION prettygood.register_user IS 'Registers a new user with email/password authentication';

-- Update the existing wallet authentication function to handle password auth too
CREATE OR REPLACE FUNCTION prettygood.authenticate_user(
  email_or_username TEXT,
  password TEXT
) RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  stored_password_hash TEXT;
  user_role TEXT;
BEGIN
  -- Get the user_id and password hash
  SELECT u.id, a.password_hash INTO user_id, stored_password_hash
  FROM prettygood.users u
  JOIN prettygood_private.user_auth a ON u.id = a.user_id
  WHERE (u.email = authenticate_user.email_or_username OR u.username = authenticate_user.email_or_username);
  
  -- Check if user exists
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Verify password
  IF stored_password_hash IS NULL OR stored_password_hash != crypt(authenticate_user.password, stored_password_hash) THEN
    -- Update failed login attempts here in the future
    RAISE EXCEPTION 'Invalid email/username or password';
  END IF;
  
  -- Determine role (artist or regular user)
  SELECT 
    CASE WHEN EXISTS (
      SELECT 1 FROM prettygood.artists WHERE id = user_id
    ) THEN 'artist' ELSE 'user' END 
  INTO user_role;
  
  -- Update last sign in time
  UPDATE prettygood_private.user_auth
  SET 
    last_sign_in = NOW(),
    last_sign_in_ip = current_setting('request.headers', TRUE)::json->>'x-forwarded-for'
  WHERE user_id = user_id;
  
  -- Generate JWT token
  RETURN auth.generate_jwt(user_id, user_role, 86400); -- 24 hour token
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION prettygood.authenticate_user IS 'Authenticates a user with email/username and password, returns JWT on success';
