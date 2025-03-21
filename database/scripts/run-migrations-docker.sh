#!/bin/bash
# Script to run database migrations in Docker

set -e

# Database details
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-prettygood}

# Base directory
BASE_DIR="$(dirname "$(dirname "$0")")"
MIGRATIONS_DIR="$BASE_DIR/migrations"

# Check if Docker container is running
if ! docker ps | grep -q postgres; then
  echo "Error: Postgres container is not running"
  exit 1
fi

# Create app directory in container if it doesn't exist
docker exec postgres mkdir -p /app/migrations

# Copy all migration files to the container
docker cp "$MIGRATIONS_DIR/." postgres:/app/migrations/

# Create migrations table in the container
docker exec postgres psql -U $DB_USER -d $DB_NAME -c "
  CREATE SCHEMA IF NOT EXISTS prettygood_private;
  
  CREATE TABLE IF NOT EXISTS prettygood_private.migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
"

# Get already applied migrations
applied_migrations=$(docker exec postgres psql -U $DB_USER -d $DB_NAME -t -c "
  SELECT id FROM prettygood_private.migrations ORDER BY id;
")

# Get list of migration files
migration_files=$(ls -1 "$MIGRATIONS_DIR" | grep '\.sql$' | sort)

# Count for statistics
total_migrations=0
applied_migrations_count=0

# Function to run a migration
run_migration() {
  local file=$1
  echo "Running migration: $file"
  
  # Extract migration number and name for logging
  migration_id="${file%%_*}"
  
  # Run the migration
  docker exec postgres psql -U $DB_USER -d $DB_NAME -f "/app/migrations/$file"
  
  # Record the migration in the migrations table
  docker exec postgres psql -U $DB_USER -d $DB_NAME -c "
    INSERT INTO prettygood_private.migrations (id, name, applied_at)
    VALUES ('$migration_id', '$file', NOW())
    ON CONFLICT (id) DO UPDATE SET
      applied_at = NOW(),
      name = '$file';
  "
  
  echo "Migration $file completed successfully"
}

# Run each migration file if it hasn't been applied yet
for file in $migration_files; do
  total_migrations=$((total_migrations + 1))
  
  # Extract migration number
  migration_id="${file%%_*}"
  
  # Check if this migration has already been applied
  if echo "$applied_migrations" | grep -q "$migration_id"; then
    echo "Migration $file already applied, skipping"
    applied_migrations_count=$((applied_migrations_count + 1))
  else
    run_migration "$file"
    applied_migrations_count=$((applied_migrations_count + 1))
  fi
done

echo "Migration complete: $applied_migrations_count of $total_migrations migrations applied"
