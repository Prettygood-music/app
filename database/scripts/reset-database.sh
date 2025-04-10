#!/bin/bash
# Script to completely reset the database by dropping and recreating it

set -e

# Database connection details
# These can be overridden with environment variables
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-prettygood}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

# PostgreSQL connection string for superuser connection
PG_CONN="-h $DB_HOST -p $DB_PORT -U $DB_USER"

# Function to check if a database exists
database_exists() {
  PGPASSWORD="$DB_PASSWORD" psql $PG_CONN -t -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1
  return $?
}

echo "Dropping database '$DB_NAME' if it exists..."
if database_exists; then
  # Disconnect all other connections
  PGPASSWORD="$DB_PASSWORD" psql $PG_CONN -c "
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = '$DB_NAME'
    AND pid <> pg_backend_pid();
  "
  
  # Drop the database
  PGPASSWORD="$DB_PASSWORD" psql $PG_CONN -c "DROP DATABASE $DB_NAME;"
  echo "Database dropped."
else
  echo "Database does not exist, skipping drop."
fi

echo "Creating database '$DB_NAME'..."
PGPASSWORD="$DB_PASSWORD" psql $PG_CONN -c "CREATE DATABASE $DB_NAME;"
echo "Database created."

echo "Database reset complete."
