#!/bin/bash
# Script to run database migrations in order

set -e

# Database connection details
# These can be overridden with environment variables
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-prettygood}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

# Function to run a migration file
run_migration() {
  local file=$1
  echo "Running migration: $file"
  
  # Extract migration number and name for logging
  filename=$(basename -- "$file")
  migration_id="${filename%%_*}"
  
  # Run the migration
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
  
  # Record the migration in the migrations table
  PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO prettygood_private.migrations (id, name, applied_at)
    VALUES ('$migration_id', '$filename', NOW())
    ON CONFLICT (id) DO UPDATE SET
      applied_at = NOW(),
      name = '$filename';
  "
  
  echo "Migration $filename completed successfully"
}

# Create migrations table if it doesn't exist
echo "Ensuring migrations table exists..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
  CREATE SCHEMA IF NOT EXISTS prettygood_private;
  
  CREATE TABLE IF NOT EXISTS prettygood_private.migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
"

# Get already applied migrations
applied_migrations=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "
  SELECT id FROM prettygood_private.migrations ORDER BY id;
")

# Read all migration files in numerical order
migration_files=$(find $(dirname "$0")/migrations -type f -name "*.sql" | sort)

# Count for statistics
total_migrations=0
applied_migrations_count=0

# Run each migration file if it hasn't been applied yet
for file in $migration_files; do
  total_migrations=$((total_migrations + 1))
  
  # Extract migration number
  filename=$(basename -- "$file")
  migration_id="${filename%%_*}"
  
  # Check if this migration has already been applied
  if echo "$applied_migrations" | grep -q "$migration_id"; then
    echo "Migration $filename already applied, skipping"
    applied_migrations_count=$((applied_migrations_count + 1))
  else
    run_migration "$file"
    applied_migrations_count=$((applied_migrations_count + 1))
  fi
done

echo "Migration complete: $applied_migrations_count of $total_migrations migrations applied"
