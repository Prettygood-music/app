# Migration Fixes

This document describes the fixes implemented to resolve issues with database migrations and seed files.

## Issues Fixed

### 1. Missing Play History Table

**Problem:** There was a reference to a `play_history` table in migration 014 and seed file 005, but the table itself was never created.

**Fix:** Created a new migration file `012_create_play_history.sql` to properly create this table with all necessary columns and indexes.

### 2. Column Renaming Errors

**Problem:** Migration 015 tried to rename columns that didn't exist:
- `cover_image` to `cover_url` in various tables
- `profile_image` to `profile_url` in the users table
- Tried to drop non-existent `collaborative` column from playlists table

**Fix:** Modified `015_rename_columns.sql` to check if columns exist before attempting to rename them using conditional logic within a PL/pgSQL DO block.

### 3. Duplicate Function Definition

**Problem:** Migration 016 tried to redefine `prettygood.create_playlist` function but a version with different parameters already existed.

**Fix:** Modified `016_update_api_functions.sql` to check if the function with 4 parameters exists, and drop it before creating the new version with 3 parameters.

### 4. Seed File Syntax Errors

**Problem:** The development seed file had syntax errors in the admin role creation:
```sql
DO $$
BEGIN
  -- Problematic code here
END IF;
```

**Fix:** Rewrote the admin role creation in `001_development_users.sql` to properly check if the role exists and create it if needed.

### 5. Missing Context Column Handling

**Problem:** Seed file `005_play_history.sql` referenced a `context_id` column that might not exist if migrations were run in a different order.

**Fix:** Modified the seed file to first check if the column exists, and then use different INSERT statements depending on the schema.

## Best Practices Implemented

1. **Check Before Modifying**: All column/table modifications now check if the object exists before attempting to modify it.

2. **Versioning Awareness**: Seed files now handle different database versions gracefully.

3. **Error Handling**: Better error handling for cases where dependencies might be missing.

4. **Idempotence**: All migrations are now more idempotent and can be run multiple times without error.

## Additional Recommendations

1. Consider implementing a dependency system to ensure migrations run in the correct order.

2. Add more detailed comments at the beginning of each migration file explaining its purpose and dependencies.

3. Consider using numbered versions in function names when making significant changes to their signatures.

4. Implement a migration testing framework to catch these issues before deploying.
