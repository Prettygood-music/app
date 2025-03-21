#!/bin/bash
# Script to set up a completely fresh database in Docker

set -e

# Database connection details
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
DB_NAME=${DB_NAME:-prettygood}

# Base directory
BASE_DIR="$(dirname "$(dirname "$0")")"
SCRIPTS_DIR="$BASE_DIR/scripts"
MIGRATIONS_DIR="$BASE_DIR/migrations"
SEED_DIR="$BASE_DIR/seed"

# Check if Docker container is running
if ! docker ps | grep -q postgres; then
  echo "Error: Postgres container is not running"
  exit 1
fi

echo "=== SETTING UP FRESH DATABASE IN DOCKER ==="
echo "Database: $DB_NAME"

# Step 1: Reset database
echo "=== STEP 1: Resetting database ==="

# Disconnect all other connections
docker exec postgres psql -U $DB_USER -c "
  SELECT pg_terminate_backend(pg_stat_activity.pid)
  FROM pg_stat_activity
  WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
"

# Drop and recreate the database
docker exec postgres psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
docker exec postgres psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

echo "Database reset complete."

# Step 2: Run migrations
echo "=== STEP 2: Running migrations ==="

# Create app directory in container
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

# Get list of migration files
migration_files=$(ls -1 "$MIGRATIONS_DIR" | grep '\.sql$' | sort)

# Run migrations
for file in $migration_files; do
  echo "Running migration: $file"
  docker exec postgres psql -U $DB_USER -d $DB_NAME -f "/app/migrations/$file"
  
  # Record the migration in the migrations table
  migration_id="${file%%_*}"
  docker exec postgres psql -U $DB_USER -d $DB_NAME -c "
    INSERT INTO prettygood_private.migrations (id, name, applied_at)
    VALUES ('$migration_id', '$file', NOW())
    ON CONFLICT (id) DO UPDATE SET
      applied_at = NOW(),
      name = '$file';
  "
done

echo "Migrations complete."

# Step 3: Load seed data (if any)
echo "=== STEP 3: Loading seed data ==="

# Create seed directory in container
docker exec postgres mkdir -p /app/seed

# Copy all seed files to the container
docker cp "$SEED_DIR/." postgres:/app/seed/

# Look for seed files
seed_files=$(ls -1 "$SEED_DIR" | grep '\.sql$' | sort)

if [ -z "$seed_files" ]; then
  echo "No seed files found, skipping."
else
  for file in $seed_files; do
    echo "Loading seed file: $file"
    docker exec postgres psql -U $DB_USER -d $DB_NAME -f "/app/seed/$file"
  done
  echo "Seed data loaded."
fi

echo "=== DATABASE SETUP COMPLETE ==="
echo "The $DB_NAME database has been reset and is ready to use."
