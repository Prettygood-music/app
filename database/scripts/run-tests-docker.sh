#!/bin/bash
# Script to run pgTAP tests for the prettygood.music database inside Docker

set -e

# Parse command-line options
SPECIFIC_FILE=""
TEST_PATTERN=""
VERBOSE=0

while getopts "f:p:v" opt; do
  case $opt in
    f)
      SPECIFIC_FILE="$OPTARG"
      ;;
    p)
      TEST_PATTERN="$OPTARG"
      ;;
    v)
      VERBOSE=1
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Base directory
BASE_DIR="$(dirname "$(dirname "$0")")"
TEST_DIR="$BASE_DIR/tests"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
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

# Function to run a test in Docker
docker_test() {
  local test_file="$1"
  local test_name=$(basename "$test_file")
  local test_path="/tests/$(basename "$(dirname "$test_file")")/$test_name"
  
  echo "Running test: $test_name"
  
  # Copy the test file to the container
  # First create the directory in the container if it doesn't exist
  docker exec "$POSTGRES_CONTAINER" mkdir -p "/tests/$(basename "$(dirname "$test_file")")"
  
  # Then copy the file
  docker cp "$test_file" "$POSTGRES_CONTAINER:$test_path"
  
  # Run the test
  if [ $VERBOSE -eq 1 ]; then
    docker exec "$POSTGRES_CONTAINER" psql -U postgres -d prettygood -f "$test_path"
  else
    # Use pg_prove if available
    if docker exec "$POSTGRES_CONTAINER" which pg_prove > /dev/null 2>&1; then
      docker exec "$POSTGRES_CONTAINER" pg_prove -U postgres -d prettygood "$test_path"
    else
      docker exec "$POSTGRES_CONTAINER" psql -U postgres -d prettygood -f "$test_path" | grep -E "^(ok|not ok|#|1\.\.|plan)"
    fi
  fi
  
  return $?
}

echo "Running pgTAP tests in Docker for prettygood.music database"

# Create tests directory in the container
docker exec "$POSTGRES_CONTAINER" mkdir -p /tests

if [ -n "$SPECIFIC_FILE" ]; then
  # Run a specific file
  TEST_PATH="${TEST_DIR}/${SPECIFIC_FILE}"
  if [ ! -f "$TEST_PATH" ]; then
    echo "Error: Test file not found: $TEST_PATH"
    exit 1
  fi
  
  echo "Running specific test: $SPECIFIC_FILE"
  docker_test "$TEST_PATH"
  exit $?
else
  # Run all test files or files matching pattern
  FAILED_TESTS=()
  PASSED_TESTS=0
  TOTAL_TESTS=0
  
  # Find test files
  if [ -n "$TEST_PATTERN" ]; then
    TEST_FILES=$(find "$TEST_DIR" -name "$TEST_PATTERN" -name "*.sql" | sort)
  else
    TEST_FILES=$(find "$TEST_DIR" -name "*.sql" | sort)
  fi
  
  if [ -z "$TEST_FILES" ]; then
    echo "No test files found"
    exit 0
  fi
  
  # Run each test file
  for file in $TEST_FILES; do
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if docker_test "$file"; then
      PASSED_TESTS=$((PASSED_TESTS + 1))
    else
      FAILED_TESTS+=("$(basename "$file")")
    fi
  done
  
  # Print summary
  echo ""
  echo "Test Summary:"
  echo "-------------"
  echo "Total tests: $TOTAL_TESTS"
  echo "Passed: $PASSED_TESTS"
  echo "Failed: $((TOTAL_TESTS - PASSED_TESTS))"
  
  if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo ""
    echo "Failed tests:"
    for test in "${FAILED_TESTS[@]}"; do
      echo "- $test"
    done
    exit 1
  fi
  
  exit 0
fi
