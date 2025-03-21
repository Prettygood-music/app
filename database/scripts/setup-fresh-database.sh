#!/bin/bash
# Script to set up a completely fresh database by:
# 1. Dropping and recreating the database
# 2. Running all migrations
# 3. Loading seed data

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Get the parent directory (database folder)
DATABASE_DIR="$(dirname "$SCRIPT_DIR")"

# Database connection details
# These can be overridden with environment variables
export DB_HOST=${DB_HOST:-localhost}
export DB_PORT=${DB_PORT:-5432}
export DB_NAME=${DB_NAME:-prettygood}
export DB_USER=${DB_USER:-postgres}
export DB_PASSWORD=${DB_PASSWORD:-postgres}

echo "=== SETTING UP FRESH DATABASE ==="
echo "Database: $DB_NAME on $DB_HOST:$DB_PORT"

# Step 1: Reset database
echo "=== STEP 1: Resetting database ==="
$SCRIPT_DIR/reset-database.sh

# Step 2: Run migrations
echo "=== STEP 2: Running migrations ==="
$DATABASE_DIR/run-migrations.sh

# Step 3: Load seed data (if any)
echo "=== STEP 3: Loading seed data ==="
# Look for seed files in the seed directory
SEED_FILES=$(find $DATABASE_DIR/seed -name "*.sql" | sort)

if [ -z "$SEED_FILES" ]; then
  echo "No seed files found, skipping."
else
  for file in $SEED_FILES; do
    echo "Loading seed file: $file"
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
  done
  echo "Seed data loaded."
fi

echo "=== DATABASE SETUP COMPLETE ==="
echo "The $DB_NAME database has been reset and is ready to use."
