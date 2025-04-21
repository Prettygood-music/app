# Schema Troubleshooting Guide

## Common Issues

### "prettygood_private does not exist" Error

If you encounter `prettygood_private does not exist (SQLSTATE 3F000)` errors, it means the private schema wasn't correctly created before it was referenced.

## Solution

1. **Run the schema fix migrations**

The migrations `20250421195000_fix_private_schema.sql` and `20250421195100_ensure_schema_tables.sql` are designed to resolve this issue by:
- Creating the `prettygood_private` schema if it doesn't exist
- Recreating essential functions in the private schema
- Ensuring private schema tables exist with the correct structure

To apply these fixes:

```bash
supabase db push
```

2. **Manual Fix (if migration doesn't work)**

If the migration approach fails, you can manually run the following SQL in the Supabase SQL Editor:

```sql
-- Create the schema
CREATE SCHEMA IF NOT EXISTS prettygood_private;
COMMENT ON SCHEMA prettygood_private IS 'Private schema for sensitive data in prettygood.music application';

-- Recreate the core function
CREATE OR REPLACE FUNCTION prettygood_private.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the payment tracking function
CREATE OR REPLACE FUNCTION prettygood_private.track_payment_status_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prettygood_private.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$function$;
```

## Why We Need The Private Schema

The `prettygood_private` schema is an essential part of our database architecture for several reasons:

1. **Security Separation**: It isolates sensitive data like payment history from the public-facing schema.
2. **Utility Functions**: It contains functions like `set_updated_at()` which are used as triggers throughout the application.
3. **Data Integrity**: It stores historical records that shouldn't be directly exposed to users.
4. **Best Practices**: This separation follows Supabase recommendations for organizing your database.

## Prevention

To prevent this issue in future deployments:

1. Always