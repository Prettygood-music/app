# How to Apply the JWT Token Refresh Fix

Follow these steps to fix the JWT token refresh issue:

## Step 1: Apply Database Migrations

Apply the two migration files to fix the JWT functions:

```bash
cd /path/to/prettygood-music/database

# Apply the base64url encoding fix
psql -U postgres -d your_database_name -f migrations/032_fix_jwt_signature_base64url.sql

# Apply the user role field fix
psql -U postgres -d your_database_name -f migrations/033_fix_user_role_field.sql
```

## Step 2: Verify the Fix

Run the verification script to make sure the JWT functions are working correctly:

```bash
cd /path/to/prettygood-music

# Install pg if not already installed
npm install pg

# Run the verification script
node scripts/verify_jwt_config.js
```

The script should output a series of successful checks. If everything is working correctly, you'll see:

```
✨ JWT configuration is working correctly
   Your authentication system should now be able to refresh tokens
```

## Step 3: Restart Your Application

Restart your application to ensure the API changes take effect:

```bash
cd /path/to/prettygood-music/app
npm run dev  # Or your start command
```

## Step 4: Test Token Refresh

Try logging in and then refreshing the token. The refresh should now work correctly.

If you still encounter issues, you can use the debug endpoint to get more detailed information:

```javascript
// From browser console
fetch('/api/debug/token-refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include'
}).then(r => r.json()).then(console.log)
```

## Additional Notes

- The debugging endpoints should be disabled or removed in production.
- For more details on the fixes, see the [JWT_REFRESH_FIX.md](./JWT_REFRESH_FIX.md) file.
- If you have custom JWT handling code elsewhere in the application, you may need to apply similar fixes there.
