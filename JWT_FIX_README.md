# JWT Token Refresh Fix

This document explains the changes made to fix the token refresh issues in the prettygood-music application.

## Issue

The token refresh endpoint was failing with errors:
- `{ code: 'P0001', details: null, hint: null, message: 'Invalid token' }`
- `HttpError { status: 401, body: { message: 'Failed to refresh token' } }`

## Root Causes

After investigation, several issues were identified:

1. **JWT Secret Mismatch**: The refresh token function was using a hardcoded JWT secret (`'your-jwt-secret'`) while the rest of the application was using a more dynamic approach with `auth.get_jwt_secret()`.

2. **JWT Algorithm Changes**: Migration 028 updated the JWT algorithm implementation to use SHA256, but the refresh token function was still using the old approach.

3. **Token Structure Differences**: The token structure in the newer implementation includes additional fields and different field names than what the refresh function expected.

## Changes Made

### 1. Enhanced the Token Refresh Function (Migration 029)

Updated the `refresh_token` function to use the correct JWT verification and generation methods:
- Now uses `auth.verify_jwt` which pulls the secret from `auth.get_jwt_secret()`
- Uses `auth.generate_jwt` for consistent token generation

### 2. Added Debugging to the Refresh API Endpoint

Enhanced the `/api/auth/refresh/+server.ts` file with:
- Detailed logging of token information
- Better error handling and error messages
- Token decoding to help diagnose issues

### 3. Created Debugging Tools

Added new diagnostic tools to help troubleshoot JWT issues:
- `/api/debug/jwt` endpoint to inspect token validity, expiration, and structure
- Database functions `debug_verify_token` and `debug_get_jwt_info` to check JWT configuration

## How to Test the Fix

1. Apply the new migration:
   ```
   # From the database directory
   psql -U postgres -d your_database_name -f migrations/030_add_jwt_debug_functions.sql
   ```

2. Restart your application:
   ```
   # From the app directory
   npm run dev
   ```

3. Test token refresh by:
   - Logging in to get a fresh token
   - Using the application until the token needs refreshing
   - Checking server logs to see if refresh is successful

4. If issues persist, use the debug endpoint:
   ```javascript
   // From browser console or a REST client
   fetch('/api/debug/jwt', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ action: 'tokenInfo' }),
     credentials: 'include'
   }).then(r => r.json()).then(console.log)
   ```

## Security Note

The debugging tools added in this fix should be **disabled or removed in production environments** as they could expose sensitive information about your authentication system.

## Next Steps

If this fix resolves the immediate issue but you're still experiencing authentication problems:

1. Check that the JWT secret is properly set in your environment:
   ```sql
   -- In PostgreSQL
   ALTER DATABASE your_database_name SET app.jwt_secret = 'your_actual_secret';
   ```

2. Verify that all parts of your authentication system are using the same JWT structure.

3. Consider implementing regular token rotation for enhanced security.
