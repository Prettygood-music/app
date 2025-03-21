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

  # Check if the database container is running
  if ! docker ps | grep -q postgres; then
    echo "Error: Postgres container is not running"
    exit 1
  fi

  # Run the type generator in the Docker container
  if [ "$USE_ADVANCED" = "true" ]; then
    echo "Using advanced type generator..."
    cd "$TYPE_GENERATOR_DIR" && npm run generate:advanced:docker
  else
    cd "$TYPE_GENERATOR_DIR" && npm run generate:docker
  fi
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
