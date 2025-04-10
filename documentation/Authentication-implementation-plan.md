# Authentication Implementation Plan

## 1. Database Migration Work

### 1.1 Password Authentication Schema
- [x] Create migration file (`018_add_password_auth.sql`) to add password fields to `prettygood_private.user_auth` table
- [x] Add `password_hash` field (TEXT, nullable for wallet-only users)
- [x] Add `password_salt` field if not using pgcrypto's built-in salting
- [x] Add comments to document new fields and their purpose
- [x] Modify existing user insertion functions to handle the new fields

### 1.2 Email Verification Schema
- [x] Add `email_verified` boolean field to `prettygood.users` table (default FALSE)
- [x] Add `email` field constraint to NOT NULL with appropriate error message
- [x] Create `prettygood_private.email_verification_tokens` table with:
  - [x] `id` (UUID, primary key)
  - [x] `user_id` (UUID, FK to users, ON DELETE CASCADE)
  - [x] `token` (TEXT, unique, NOT NULL)
  - [x] `created_at` (TIMESTAMPTZ, default NOW())
  - [x] `expires_at` (TIMESTAMPTZ, default NOW() + interval '24 hours')
  - [x] Add appropriate indexes for token lookup
- [x] Add trigger to automatically clean up expired tokens

### 1.3 Password Reset Schema
- [x] Add to `prettygood_private.user_auth`:
  - [x] `reset_token` field (TEXT, nullable)
  - [x] `reset_token_expires_at` timestamp (nullable)
- [x] Create index on `reset_token` for fast lookups
- [x] Add trigger to clear expired reset tokens during authentication attempts

### 1.4 Login Tracking Fields
- [x] Add to `prettygood_private.user_auth`:
  - [x] `failed_login_attempts` (INTEGER, default 0)
  - [x] `last_failed_attempt` timestamp (nullable)
  - [x] `locked_until` timestamp (nullable, for temporary lockouts)
- [x] Create function to automatically reset failed attempts after specified time period
- [x] Add comments documenting lockout policy

## 2. Authentication Functions

### 2.1 User Registration Functions
- [x] Create `prettygood.register_with_email(email, username, password, display_name)` function
- [x] Input validation for email format, username requirements
- [x] Password strength validation (minimum length, complexity)
- [x] Check for existing username or email
- [x] Implement password hashing using pgcrypto's `crypt()` function
- [x] Add email verification token generation using `gen_random_uuid()`
- [x] Add insertion to email_verification_tokens table
- [x] Return user information without sensitive data
- [x] Add function comments and error handling

### 2.2 Login Functions
- [x] Create `prettygood.login_with_email(email_or_username, password)` function
- [x] Allow login with either email or username
- [x] Check if account is locked due to failed attempts
- [x] Implement password verification using pgcrypto's `crypt()` function
- [x] Increment failed login attempts on failure
- [x] Implement account lockout after 5 failed attempts
- [x] Reset failed attempts counter on successful login
- [x] Generate JWT with proper claims (user_id, role, email_verified status)
- [x] Update last_sign_in and IP information
- [x] Return JWT and user profile on success
- [x] Add function comments and proper error handling

### 2.3 Email Verification Functions
- [x] Create `prettygood.verify_email(token)` function
- [x] Validate token exists and hasn't expired
- [x] Update user's email_verified status to TRUE
- [x] Delete used token from verification_tokens table
- [x] Allow for token regeneration if expired
- [x] Add function comments and error handling

### 2.4 Password Reset Functions
- [x] Create `prettygood.request_password_reset(email)` function
- [x] Check if email exists in the system
- [x] Generate secure random token
- [x] Set expiration time (1 hour from request)
- [x] Store token and expiration in user_auth table
- [x] Return success even if email not found (security best practice)
- [x] Create `prettygood.reset_password(token, new_password)` function
- [x] Validate token exists and hasn't expired
- [x] Validate new password strength
- [x] Update password_hash with new hashed password
- [x] Clear reset token and failed login attempts
- [x] Add function comments and error handling

### 2.5 Wallet Connection Functions
- [ ] Create `prettygood.connect_wallet(wallet_address)` function for existing users
- [ ] Verify wallet address format
- [ ] Check if wallet is already connected to another account
- [ ] Update user record with wallet address
- [ ] Update JWT claims when wallet is connected
- [ ] Create `prettygood.disconnect_wallet()` function
- [ ] Add proper permission checks and error handling

## 7. Testing

### 7.1 Database Testing
- [x] Create pgTAP tests for registration function
- [x] Add tests for login function with success/failure cases
- [x] Test email verification functionality
- [x] Create tests for password reset functions
- [x] Test RLS policies with different user roles
- [x] Verify password security measures (hashing, salting)
- [x] Test wallet connection functions
- [x] Add tests for JWT generation and validation

## 3. API Endpoints

### 3.1 Registration Endpoint
- [ ] Create `/api/auth/register` endpoint in SvelteKit
- [ ] Implement request body validation using Zod
  - [ ] Email format validation
  - [ ] Password strength requirements (min 8 chars, mixed case, number/symbol)
  - [ ] Username format validation (allowed characters, length)
- [ ] Call `register_with_email` database function
- [ ] Handle database constraint errors with user-friendly messages
- [ ] Return appropriate HTTP status codes (201 success, 400 bad request, 409 conflict)
- [ ] Send verification email (mock for now, log token to console)
- [ ] Set appropriate CORS and security headers

### 3.2 Login Endpoint
- [ ] Create `/api/auth/login` endpoint in SvelteKit
- [ ] Implement request validation using Zod
- [ ] Call `login_with_email` database function
- [ ] Handle authentication failures with appropriate HTTP status codes
- [ ] Implement rate limiting to prevent brute force (max 10 attempts per IP per hour)
- [ ] Set secure, httpOnly cookie with JWT on success
- [ ] Return user profile data on success
- [ ] Set appropriate CORS and security headers

### 3.3 Email Verification Endpoint
- [ ] Create `/api/auth/verify-email/:token` endpoint in SvelteKit
- [ ] Validate token parameter
- [ ] Call `verify_email` database function
- [ ] Handle verification failure cases with appropriate messages
- [ ] Return success message with redirection information
- [ ] Create `/api/auth/resend-verification` endpoint for users with unverified emails
- [ ] Set appropriate CORS and security headers

### 3.4 Password Reset Endpoints
- [ ] Create `/api/auth/forgot-password` endpoint in SvelteKit
- [ ] Implement email validation
- [ ] Call `request_password_reset` database function
- [ ] Return success regardless of whether email exists (security best practice)
- [ ] Log reset link for development purposes
- [ ] Create `/api/auth/reset-password` endpoint in SvelteKit
- [ ] Validate token and new password
- [ ] Call `reset_password` database function
- [ ] Return appropriate success/error messages
- [ ] Set appropriate CORS and security headers

### 3.5 Wallet Connection Endpoint
- [ ] Create `/api/auth/connect-wallet` endpoint for logged-in users
- [ ] Protect endpoint with authentication middleware
- [ ] Implement wallet address validation
- [ ] Generate nonce for wallet signature process
- [ ] Create `/api/auth/verify-wallet` endpoint
- [ ] Implement wallet signature verification
- [ ] Update user profile with wallet address
- [ ] Return updated user profile
- [ ] Set appropriate CORS and security headers

## 4. Authentication State Management

### 4.1 JWT Handling
- [ ] Create `src/lib/auth/jwt.js` utility module
- [ ] Implement JWT decoding function using jose library
- [ ] Add JWT validation function to check expiration
- [ ] Create function to extract user profile from JWT payload
- [ ] Implement secure cookie storage in browser
- [ ] Create automatic token refresh system (refresh when < 15 min remaining)
- [ ] Add error handling for invalid tokens

### 4.2 Authentication Store
- [ ] Create `src/lib/stores/auth.svelte.js` module using Svelte 5 runes
- [ ] Create authentication state with `$state`
- [ ] Add user profile information derived from JWT
- [ ] Implement login function to set JWT and update state
- [ ] Add logout function to clear JWT and reset state
- [ ] Create helper functions to check authentication status
- [ ] Add functions to check user roles (isUser, isArtist, isAdmin)
- [ ] Create client-side token refresh logic

### 4.3 Protected Route Handling
- [ ] Create `src/lib/auth/guards.js` module
- [ ] Implement SvelteKit hooks for route protection
- [ ] Create redirects for unauthenticated users (to login page)
- [ ] Add role-based route protection
- [ ] Implement email verification check for sensitive operations
- [ ] Create error pages for unauthorized access
- [ ] Add session expiration handling

## 5. Frontend Components

### 5.1 Registration Form
- [ ] Create `src/lib/components/auth/RegisterForm.svelte` component
- [ ] Implement form with:
  - [ ] Email field with validation
  - [ ] Username field with validation
  - [ ] Password field with strength meter
  - [ ] Confirm password field with matching validation
  - [ ] Display name field (optional)
  - [ ] Terms of service acceptance checkbox
- [ ] Add client-side validation using Zod
- [ ] Create password strength indicator component
- [ ] Add form submission handling with error display
- [ ] Show success state with verification instructions
- [ ] Style component according to design system

### 5.2 Login Form
- [ ] Create `src/lib/components/auth/LoginForm.svelte` component
- [ ] Implement form with:
  - [ ] Email/username field
  - [ ] Password field with show/hide toggle
  - [ ] "Remember me" checkbox
  - [ ] "Forgot password" link
- [ ] Add client-side validation
- [ ] Implement form submission with error handling
- [ ] Handle account lockout messaging
- [ ] Add loading state during authentication
- [ ] Style component according to design system

### 5.3 Email Verification Components
- [ ] Create `src/routes/verify-email/[token]/+page.svelte` component
- [ ] Implement automatic verification on page load
- [ ] Show success/failure states with appropriate messaging
- [ ] Add resend verification button for expired tokens
- [ ] Create banner component for unverified emails
- [ ] Add email verification status indicator in user profile
- [ ] Style components according to design system

### 5.4 Password Reset Components
- [ ] Create `src/lib/components/auth/ForgotPasswordForm.svelte` component
- [ ] Implement email input with validation
- [ ] Add form submission handling
- [ ] Show success state with instructions
- [ ] Create `src/routes/reset-password/[token]/+page.svelte` component
- [ ] Implement new password and confirm password fields
- [ ] Add password strength validation
- [ ] Show success/failure states with appropriate messages
- [ ] Style components according to design system

### 5.5 Account Management
- [ ] Create `src/routes/settings/account/+page.svelte` component
- [ ] Implement email update functionality
- [ ] Add password change form
- [ ] Create profile information editor
- [ ] Add optional wallet connection section for artists
- [ ] Implement account deletion with confirmation
- [ ] Add account security settings (2FA placeholder for future)
- [ ] Style components according to design system

## 6. Wallet Integration (Optional for Artists)

### 6.1 Wallet Connection UI
- [ ] Create `src/lib/components/wallet/ConnectWallet.svelte` component
- [ ] Add wallet connection button for artists
- [ ] Implement wallet address input field
- [ ] Create signature request dialog
- [ ] Show connection status (connected, pending, failed)
- [ ] Add loading state during connection process
- [ ] Style components according to design system

### 6.2 Wallet Management
- [ ] Create `src/routes/settings/wallet/+page.svelte` component
- [ ] Show connected wallet address with copy button
- [ ] Add disconnect wallet button with confirmation
- [ ] Create placeholder for transaction history
- [ ] Add wallet balance display (if applicable)
- [ ] Implement wallet verification status indicator
- [ ] Style component according to design system

## 7. Testing

### 7.2 API Testing
- [ ] Create tests for registration endpoint
- [ ] Test login endpoint with valid/invalid credentials
- [ ] Verify rate limiting for security endpoints
- [ ] Test email verification endpoints
- [ ] Create tests for password reset flow
- [ ] Test wallet connection endpoints
- [ ] Verify JWT validation and refresh flow
- [ ] Test CORS and security headers

### 7.3 End-to-End Testing
- [ ] Create test for complete registration, verification, and login flow
- [ ] Test password reset flow from request to completion
- [ ] Create test for account settings updates
- [ ] Test wallet connection flow for artists
- [ ] Verify route protection functionality
- [ ] Test responsive design on mobile devices
- [ ] Create accessibility tests for all authentication components

## 8. Security Measures

### 8.1 Password Security
- [x] Configure pgcrypto with strong hashing parameters
- [x] Implement password strength requirements (min 8 chars, mixed case, number/symbol)
- [x] Add account lockout after 5 failed login attempts
- [ ] Create rate limiting for authentication endpoints
- [x] Implement secure password reset mechanism
- [ ] Add audit logging for security-sensitive operations

### 8.2 Email Security
- [x] Create secure token generation for email verification
- [x] Set appropriate token expiration (24 hours)
- [x] Verify email uniqueness at registration
- [ ] Implement rate limiting for email operations
- [ ] Add email change verification requirement
- [ ] Create audit logging for email operations

### 8.3 JWT Security
- [x] Set appropriate token lifetime (24 hours)
- [ ] Implement token refresh mechanism
- [ ] Store tokens in httpOnly, secure cookies
- [ ] Add SameSite=Strict cookie attribute
- [ ] Implement CSRF protection with token
- [ ] Create audit logging for JWT operations
- [ ] Add token revocation capability

### 8.4 Input Validation
- [x] Add thorough validation on all authentication endpoints using Zod
- [x] Implement SQL injection prevention using parameterized queries
- [ ] Add sanitization for user-generated content
- [ ] Implement rate limiting on all sensitive endpoints
- [ ] Create request size limitations
- [ ] Add content-type enforcement

## 9. Documentation

### 9.1 API Documentation
- [ ] Document all authentication endpoints
- [ ] Create example requests and responses
- [ ] Document error codes and messages
- [ ] Add authentication flow diagrams
- [ ] Document rate limiting policies
- [ ] Create security considerations section

### 9.2 Developer Documentation
- [ ] Create authentication flow diagrams
- [ ] Document JWT structure and claims
- [ ] Add implementation details for future reference
- [ ] Document database schema and relationships
- [ ] Create function documentation
- [ ] Add code comments throughout

### 9.3 User Documentation
- [ ] Create user-facing help documentation
- [ ] Add FAQs for common authentication issues
- [ ] Create password recovery instructions
- [ ] Add account security best practices
- [ ] Document wallet connection process
- [ ] Create troubleshooting guide