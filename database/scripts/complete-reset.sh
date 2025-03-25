#!/bin/bash
# Script to completely reset the PostgreSQL setup

set -e

echo "=== COMPLETELY RESETTING POSTGRESQL ENVIRONMENT ==="

# Stop all containers
echo "Stopping all containers..."
cd "$(dirname "$(dirname "$0")")" && docker-compose down

# Remove the volume
echo "Removing PostgreSQL data volume..."
docker volume rm $(docker volume ls -q | grep prettygood | grep pgdata) || true

# Rebuild the container
echo "Rebuilding the PostgreSQL container..."
cd "$(dirname "$(dirname "$0")")" && docker-compose build

# Start fresh
echo "Starting containers with fresh data volumes..."
cd "$(dirname "$(dirname "$0")")" && docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 10

# Create the database
POSTGRES_CONTAINER=$(docker ps | grep -E 'postgres|postgre|pg' | grep -v 'postgrest' | grep -v 'pgadmin' | head -n 1 | awk '{print $1}')
echo "Creating fresh database..."
docker exec "$POSTGRES_CONTAINER" bash -c "psql -U postgres -c \"CREATE DATABASE prettygood;\""

echo "=== RESET COMPLETE ==="
echo "Now you can run 'make db-docker-fresh' to set up the database."
