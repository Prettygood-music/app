#!/bin/bash
# Script to generate TypeScript types from the database schema

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TYPE_GENERATOR_DIR="$SCRIPT_DIR/type-generator"
OUTPUT_DIR="${OUTPUT_DIR:-"$SCRIPT_DIR/../../common/src/types/db"}"

# Database connection details
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"prettygood"}
DB_USER=${DB_USER:-"postgres"}
DB_PASSWORD=${DB_PASSWORD:-"postgres"}

# Export environment variables for the type generator
export DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD OUTPUT_DIR

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if we're running in Docker
if [ "$USE_DOCKER" = "true" ]; then
  echo "Generating types using Docker container..."
  
  # Check if Docker is running
  if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running or not accessible"
    exit 1
  fi

  # Find the postgres container - look for any container running postgres
POSTGRES_CONTAINER=$(docker ps | grep -E 'postgres|postgre|pg' | grep -v 'postgrest' | grep -v 'pgadmin' | head -n 1 | awk '{print $1}')



  if [ -z "$POSTGRES_CONTAINER" ]; then
    echo "Error: No PostgreSQL container found running. Please start the container first."
    echo "Run 'make db-docker-up' or 'docker-compose up -d' first."
    exit 1
  fi

  echo "Using PostgreSQL container: $POSTGRES_CONTAINER"

  # Install dependencies in the container if needed
  if [ ! -d "$TYPE_GENERATOR_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    cd "$TYPE_GENERATOR_DIR" && npm install
  fi

  # Copy the type generator to the container
  docker exec "$POSTGRES_CONTAINER" mkdir -p /app/database/scripts/type-generator
  docker cp "$TYPE_GENERATOR_DIR" "$POSTGRES_CONTAINER:/app/database/scripts/"

  # Run the type generator in the Docker container
  if [ "$USE_ADVANCED" = "true" ]; then
    echo "Using advanced type generator..."
    docker exec -e DB_HOST=localhost -e DB_PORT=5432 -e DB_NAME=$DB_NAME -e DB_USER=$DB_USER -e DB_PASSWORD=$DB_PASSWORD -e OUTPUT_DIR=/app/database/scripts/type-generator/output "$POSTGRES_CONTAINER" sh -c "cd /app/database/scripts/type-generator && node generate-types-advanced.js"
  else
    docker exec -e DB_HOST=localhost -e DB_PORT=5432 -e DB_NAME=$DB_NAME -e DB_USER=$DB_USER -e DB_PASSWORD=$DB_PASSWORD -e OUTPUT_DIR=/app/database/scripts/type-generator/output "$POSTGRES_CONTAINER" sh -c "cd /app/database/scripts/type-generator && node generate-types.js"
  fi

  # Copy the generated types from the container to the host
  docker exec "$POSTGRES_CONTAINER" mkdir -p /app/database/scripts/type-generator/output
  docker cp "$POSTGRES_CONTAINER:/app/database/scripts/type-generator/output/." "$OUTPUT_DIR"
else
  echo "Generating types locally..."
  
  # Install dependencies if needed
  if [ ! -d "$TYPE_GENERATOR_DIR/node_modules" ]; then
    echo "Installing dependencies..."
    cd "$TYPE_GENERATOR_DIR" && npm install
  fi

  # Run the type generator
  if [ "$USE_ADVANCED" = "true" ]; then
    echo "Using advanced type generator..."
    cd "$TYPE_GENERATOR_DIR" && npm run generate:advanced
  else
    cd "$TYPE_GENERATOR_DIR" && npm run generate
  fi
fi

echo "TypeScript types generated successfully at $OUTPUT_DIR"
