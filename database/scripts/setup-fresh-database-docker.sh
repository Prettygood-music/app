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

# Find the postgres container - look for any container running postgres
#POSTGRES_CONTAINER=$(docker ps | grep -E 'postgres|postgre|pg' | head -n 1 | awk '{print $1}')
POSTGRES_CONTAINER=$(docker ps | grep -E 'postgres|postgre|pg' | grep -v 'postgrest' | grep -v 'pgadmin' | head -n 1 | awk '{print $1}')


if [ -z "$POSTGRES_CONTAINER" ]; then
  echo "Error: No PostgreSQL container found running. Please start the container first."
  echo "Run 'make db-docker-up' or 'docker-compose up -d' first."
  exit 1
fi

echo "=== SETTING UP FRESH DATABASE IN DOCKER ==="
echo "Database: $DB_NAME"
echo "Using PostgreSQL container: $POSTGRES_CONTAINER"

# Step 1: Reset database
echo "=== STEP 1: Resetting database ==="

# Disconnect all other connections
docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
  psql -U $DB_USER -c \"

  SELECT pg_terminate_backend(pg_stat_activity.pid)
  FROM pg_stat_activity
  WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
\"  
else
  /usr/lib/postgresql/15/bin/psql -U $DB_USER -c \"
  SELECT pg_terminate_backend(pg_stat_activity.pid)
  FROM pg_stat_activity
  WHERE pg_stat_activity.datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
\"  
fi"

# Drop and recreate the database
docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
  psql -U $DB_USER -c \"DROP DATABASE IF EXISTS $DB_NAME;\"
  psql -U $DB_USER -c \"CREATE DATABASE $DB_NAME;\"
else
  /usr/lib/postgresql/15/bin/psql -U $DB_USER -c \"DROP DATABASE IF EXISTS $DB_NAME;\"
  /usr/lib/postgresql/15/bin/psql -U $DB_USER -c \"CREATE DATABASE $DB_NAME;\"
fi"

echo "Database reset complete."

# Step 2: Run migrations
echo "=== STEP 2: Running migrations ==="

# Create app directory in container
docker exec "$POSTGRES_CONTAINER" mkdir -p /app/migrations

# Copy all migration files to the container
docker cp "$MIGRATIONS_DIR/." "$POSTGRES_CONTAINER:/app/migrations/"

# Create migrations table in the container
docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
  psql -U $DB_USER -d $DB_NAME -c \"

  CREATE SCHEMA IF NOT EXISTS prettygood_private;
  
  CREATE TABLE IF NOT EXISTS prettygood_private.migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );\"
else
  /usr/lib/postgresql/15/bin/psql -U $DB_USER -d $DB_NAME -c \"  
  CREATE SCHEMA IF NOT EXISTS prettygood_private;
  
  CREATE TABLE IF NOT EXISTS prettygood_private.migrations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );\"
fi
"

# Get list of migration files
migration_files=$(ls -1 "$MIGRATIONS_DIR" | grep '\.sql$' | sort)

# Run migrations
for file in $migration_files; do
  echo "Running migration: $file"
  docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
    psql -U $DB_USER -d $DB_NAME -f \"/app/migrations/$file\"
  else
    /usr/lib/postgresql/15/bin/psql -U $DB_USER -d $DB_NAME -f \"/app/migrations/$file\"
  fi"
  
  # Record the migration in the migrations table
  migration_id="${file%%_*}"
  docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
    psql -U $DB_USER -d $DB_NAME -c \"

    INSERT INTO prettygood_private.migrations (id, name, applied_at)
    VALUES ('$migration_id', '$file', NOW())
    ON CONFLICT (id) DO UPDATE SET
      applied_at = NOW(),
      name = '$file';\"
  else
    /usr/lib/postgresql/15/bin/psql -U $DB_USER -d $DB_NAME -c \"
    INSERT INTO prettygood_private.migrations (id, name, applied_at)
    VALUES ('$migration_id', '$file', NOW())
    ON CONFLICT (id) DO UPDATE SET
      applied_at = NOW(),
      name = '$file';\"
  fi
  "
done

echo "Migrations complete."

# Step 3: Load seed data (if any)
echo "=== STEP 3: Loading seed data ==="

# Create seed directory in container
docker exec "$POSTGRES_CONTAINER" mkdir -p /app/seed

# Copy all seed files to the container
docker cp "$SEED_DIR/." "$POSTGRES_CONTAINER:/app/seed/"

# Look for seed files
seed_files=$(ls -1 "$SEED_DIR" | grep '\.sql$' | sort)

if [ -z "$seed_files" ]; then
  echo "No seed files found, skipping."
else
  for file in $seed_files; do
    echo "Loading seed file: $file"
    docker exec "$POSTGRES_CONTAINER" bash -c "if command -v psql >/dev/null 2>&1; then
      psql -U $DB_USER -d $DB_NAME -f \"/app/seed/$file\"
    else
      /usr/lib/postgresql/15/bin/psql -U $DB_USER -d $DB_NAME -f \"/app/seed/$file\"
    fi"
  done
  echo "Seed data loaded."
fi

echo "=== DATABASE SETUP COMPLETE ==="
echo "The $DB_NAME database has been reset and is ready to use."
