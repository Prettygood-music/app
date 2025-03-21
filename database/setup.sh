#!/bin/bash
# Master script to set up the database environment from scratch

set -e

echo "=== SETTING UP PRETTYGOOD.MUSIC DATABASE ENVIRONMENT ==="

# Step 1: Build and start Docker containers
echo "=== Step 1: Building and starting Docker containers ==="
docker-compose down -v || true
docker-compose build --no-cache
docker-compose up -d

# Wait for the PostgreSQL container to be healthy
echo "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  if docker-compose exec postgres pg_isready -U postgres -d postgres > /dev/null 2>&1; then
    echo "PostgreSQL is ready!"
    break
  fi
  echo -n "."
  sleep 1
  if [ $i -eq 30 ]; then
    echo "Timed out waiting for PostgreSQL to be ready"
    exit 1
  fi
done

# Step 2: Set up a fresh database
echo "=== Step 2: Setting up fresh database ==="
chmod +x ./scripts/setup-fresh-database-docker.sh
./scripts/setup-fresh-database-docker.sh

# Step 3: Generate TypeScript types
echo "=== Step 3: Generating TypeScript types ==="
chmod +x ./scripts/generate-types.sh
USE_DOCKER=true USE_ADVANCED=true ./scripts/generate-types.sh

# Step 4: Run tests to verify everything is working
echo "=== Step 4: Running tests ==="
chmod +x ./scripts/run-tests-docker.sh
./scripts/run-tests-docker.sh

echo "=== SETUP COMPLETE! ==="
echo "PostgreSQL is available at: localhost:5432"
echo "PostgREST is available at: http://localhost:3000"
echo "pgAdmin is available at: http://localhost:5050 (login: admin@prettygood.music / admin)"
echo ""
echo "TypeScript types have been generated at: ../common/src/types/db/"
