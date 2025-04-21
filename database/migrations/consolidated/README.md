# Database Migration Consolidation

This directory contains consolidated migrations that replace multiple original migrations to improve database structure and performance. The consolidation addresses several issues identified in the original migrations:

1. **Authentication System Fixes**: Multiple JWT implementation issues were consolidated into a single migration
2. **RPC vs Views Optimization**: Some operations that used RPC functions were replaced with views for better efficiency
3. **Permission Fixes**: Multiple permission-related migrations were consolidated
4. **Debug/Development Code Removal**: Debug functions not required in production were removed
5. **Artist Registration Improvements**: Artist registration process was improved and consolidated

## Consolidated Migration Files

| Consolidated File | Description | Original Migrations Replaced |
|-------------------|-------------|------------------------------|
| `001_consolidated_auth_fixes.sql` | Fixes authentication system issues | 025, 026, 027, 029, 033, 036 |
| `002_consolidate_play_count.sql` | Replaces play count functions with views | 014, 017 |
| `003_consolidate_permissions.sql` | Fixes table permissions and RLS issues | 039, 040 |
| `004_artist_registration.sql` | Improves artist registration process | Parts of 003, 038 |
| `005_remove_debug_functions.sql` | Removes debug functions not needed in production | 030, 031, 034 |
| `006_optimize_track_functions.sql` | Optimizes track-related functions | 041, parts of 011 |

## How to Apply These Migrations

There are two approaches to applying these consolidated migrations:

### Option 1: Fresh Installation

For new installations, you can use the consolidated migrations from the beginning:

1. Start with the essential schema creation migrations (001-010)
2. Apply these consolidated migrations instead of the original ones
3. Apply any remaining migrations that haven't been consolidated

```bash
# Example using psql
psql -U postgres -d your_database -f migrations/001_create_schemas.sql
psql -U postgres -d your_database -f migrations/002_create_users.sql
# ...continue with essential migrations...
psql -U postgres -d your_database -f migrations/010_create_rls_policies.sql

# Apply consolidated migrations
psql -U postgres -d your_database -f migrations/consolidated/001_consolidated_auth_fixes.sql
psql -U postgres -d your_database -f migrations/consolidated/002_consolidate_play_count.sql
psql -U postgres -d your_database -f migrations/consolidated/003_consolidate_permissions.sql
psql -U postgres -d your_database -f migrations/consolidated/004_artist_registration.sql
psql -U postgres -d your_database -f migrations/consolidated/005_remove_debug_functions.sql
psql -U postgres -d your_database -f migrations/consolidated/006_optimize_track_functions.sql
```

### Option 2: Migration from Existing Database

For existing databases that may have already applied some or all of the original migrations:

1. Create a backup of your database
2. Create a temporary migration script that checks which original migrations have been applied
3. Apply only the consolidated migrations that replace migrations not yet applied
4. Optionally, run the optimization migrations (005, 006) to improve existing functionality

Here's a sample script to handle this process (replace with your actual migration tracking mechanism):

```sql
DO $$
DECLARE
    migration_applied BOOLEAN;
BEGIN
    -- Example: Check if migration 025 has been applied
    -- Adjust this to your migration tracking method
    SELECT EXISTS(
        SELECT 1 FROM migration_history 
        WHERE migration_name = '025_fix_register_user_ambiguous_column.sql'
    ) INTO migration_applied;
    
    -- If not applied, apply the consolidated auth fixes
    IF NOT migration_applied THEN
        -- Code to apply consolidated/001_consolidated_auth_fixes.sql
        RAISE NOTICE 'Applying consolidated auth fixes';
    END IF;
    
    -- Continue with similar checks for other migrations
END $$;
```

## Future Migration Development

To avoid similar issues in the future, consider these best practices:

1. **Plan schema carefully** before implementation to avoid rename migrations
2. **Use views instead of functions** for read operations where possible
3. **Implement RLS from the beginning** rather than adding it later
4. **Keep debug/development code separate** from production migrations
5. **Test migrations thoroughly** before applying to production

## Migration Dependencies

Note that some consolidated migrations may depend on specific schema structures. Review each consolidated migration to ensure it matches your current database schema before applying.
