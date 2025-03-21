#!/bin/bash
# Custom script to set up extensions after PostgreSQL initialization

set -e

# This script is run on container initialization after the database is created

# Create extensions we'll need
echo "Creating PostgreSQL extensions..."

# Create pgTAP extension in main database
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS pgtap;"
psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE EXTENSION IF NOT EXISTS dblink;"

# Create test database if requested
if [ "${POSTGRES_TEST_DB}" = "true" ]; then
    echo "Creating test database..."
    
    # Check if test database already exists
    if psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "${POSTGRES_DB}_test"; then
        echo "Test database already exists"
    else
        # Create the test database
        psql -U "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_DB}_test TEMPLATE ${POSTGRES_DB};"
        
        # Create extensions in test database
        psql -U "$POSTGRES_USER" -d "${POSTGRES_DB}_test" -c "CREATE EXTENSION IF NOT EXISTS pgtap;"
    fi
fi

echo "PostgreSQL setup completed."
