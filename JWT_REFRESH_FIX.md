# JWT Token Refresh Fix - Updated (2025-04-02)

## Issue Identified

The token refresh was failing with the error: `Invalid token` despite the token being decodable on the client side and having a valid expiration date.

After thorough investigation, two issues were identified:

1. **Inconsistent base64url encoding** in the JWT signature verification
2. **Database schema mismatches** in the user role handling

## Fixes Implemented

### 1. Fixed JWT Signature Verification (Migration 032)

Created migration `032_fix_jwt_signature_base64url.sql` that:

- Updates `auth.verify_jwt` to correctly handle base64url encoding in signatures
- Updates `auth.generate_jwt` to use consistent base64url encoding
- Updates `prettygood.refresh_token` to use the fixed JWT functions

### 2. Fixed User Role Field Issue (Migration 033)

Created migration `033_fix_user_role_field.sql` that:

- Updates the JWT functions to properly handle the current database structure
- Modifies role determination to check the artists table
- Makes the code more resilient to structure changes with proper error handling

### 3. Added Debugging Tools

- Created `/api/debug/token-refresh` endpoint to diagnose token refresh issues
- Added `debug_refresh_token` function to trace specific signature verification problems
- Created a verification script (`scripts/verify_jwt_config.js`) to test the full JWT flow

### 4. Enhanced Error Handling

- Created more robust functions with better error messages
- Added detailed logging in the API endpoint to capture token information
- Implemented step-by-step verification to pinpoint exact failure points

### 5. Technical Solution Details

The core issue was in how base64url encoding was handled for JWT signatures:

1. **Base64url vs Base64**: JWT uses base64url encoding (where '+' becomes '-' and '/' becomes '_')
2. **Inconsistent Implementation**: The token generation was correctly using base64url but verification was not handling it consistently 
3. **Padding Issues**: Base64 padding characters ('=') were not consistently handled

The solution ensures consistent encoding/decoding by:

- Using the same base64url encoding process for both generation and verification
- Properly handling character replacements ('+' to '-' and '/' to '_')
- Correctly handling padding characters
- Using the same JWT secret source throughout the application

## How to Apply the Fix

1. Apply the migrations to fix the JWT functions:

```bash
cd /path/to/prettygood-music/database
psql -U postgres -d your_database_name -f migrations/032_fix_jwt_signature_base64url.sql
psql -U postgres -d your_database_name -f migrations/033_fix_user_role_field.sql
```

2. Restart your application to ensure the API changes take effect:

```bash
cd /path/to/prettygood-music/app
npm run dev # or your start command
```

## Verification

To verify the fix is working:

1. Log in to get a new token
2. Try refreshing the token via the API endpoint
3. Check the logs to confirm successful refresh

For additional debugging, you can use the debug endpoint:

```javascript
// From browser console or a REST client
fetch('/api/debug/token-refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

## Security Notes

1. The debugging endpoints should be disabled in production environments
2. Consider implementing periodic JWT secret rotation for enhanced security
3. Review your JWT expiration policies to balance security and user experience

## Technical Background

### JWT Structure

JWT tokens consist of three parts:
- Header: Contains the algorithm used for signing
- Payload: Contains the claims (user information, expiration, etc.)
- Signature: Verifies the token hasn't been tampered with

When a token is created and verified, all three parts must be encoded and processed consistently.

### Base64url Encoding

Base64url is a variant of Base64 encoding that's URL-safe:
- Replaces '+' with '-'
- Replaces '/' with '_'
- Removes padding '=' characters

The issue occurred because part of the code was using standard Base64 while other parts were using Base64url. This created signature mismatch even though the token was valid.

## Next Steps

If you continue to experience authentication issues after applying this fix:

1. Review your JWT secret configuration to ensure it's properly set
2. Consider adding monitoring for authentication failures to detect issues earlier
3. Review your token expiration and refresh policies
