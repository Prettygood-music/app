# PrettyGood Music Schema Installation Guide

This guide provides instructions for properly installing the PrettyGood Music database schema with Supabase.

## Prerequisites

1. Supabase CLI installed
2. A Supabase project created either locally or in the cloud

## Installation Methods

### Method 1: Using Supabase Migration Tool (Recommended)

1. Start by ensuring your Supabase instance is running:
   ```bash
   supabase start
   ```

2. Create the schemas first:
   ```bash
   echo "CREATE SCHEMA IF NOT EXISTS prettygood; CREATE SCHEMA IF NOT EXISTS prettygood_private;" | supabase db execute
   ```

3. Apply the schema files in order:
   ```bash
   for file in schemas/0*.sql; do
     echo "Applying $file..."
     supabase db execute -f "$file"
   done
   ```

### Method 2: Manual Installation with psql

If you're experiencing issues with the Supabase CLI, you can use psql directly:

1. Connect to your database:
   ```bash
   psql -U postgres -d postgres
   ```

2. Create the schemas:
   ```sql
   CREATE SCHEMA IF NOT EXISTS prettygood;
   CREATE SCHEMA IF NOT EXISTS prettygood_private;
   ```

3. Exit psql and run the schema files in order:
   ```bash
   for file in schemas/0*.sql; do
     echo "Applying $file..."
     psql -U postgres -d postgres -f "$file"
   done
   ```

### Method 3: SQL Dump Alternative

If you continue to experience issues with schema dependencies, use this approach:

1. Combine all schema files into a single SQL file ensuring schema creation comes first:
   ```bash
   cat <(echo "CREATE SCHEMA IF NOT EXISTS prettygood; CREATE SCHEMA IF NOT EXISTS prettygood_private;") schemas/0*.sql > combined_schema.sql
   ```

2. Apply the combined file:
   ```bash
   supabase db execute -f combined_schema.sql
   ```

## Troubleshooting

If you encounter errors like "schema does not exist", ensure you're creating the schemas before attempting to create objects within them.

Common errors and solutions:

1. **Error: schema "prettygood_private" does not exist**
   Solution: Make sure you've created the schemas first before applying any other SQL.

2. **Error: relation does not exist**
   Solution: Check the order of your SQL files and ensure tables are created before they're referenced.

3. **Error with auth schema**
   Solution: Supabase should automatically create the auth schema. If not, ensure your Supabase instance is properly initialized.

## Verifying Installation

To verify the schema was created correctly:

```bash
supabase db execute -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('prettygood', 'prettygood_private')"
```

You should see both schemas listed in the output.
