#!/bin/bash
# Script to run pgTAP tests for the prettygood.music database

set -e

# Database connection details
# These can be overridden with environment variables
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-prettygood}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}
TEST_DIR=${TEST_DIR:-"$(dirname "$0")/../tests"}

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

# Function to run a single test file
run_test_file() {
    local file=$1
    local basename=$(basename "$file")
    
    if [ $VERBOSE -eq 1 ]; then
        echo "Running test: $basename"
    fi
    
    # Check if pgTAP is installed
    PGTAP_INSTALLED=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT 1 FROM pg_extension WHERE extname = 'pgtap'" | grep -c 1 || true)
    
    if [ "$PGTAP_INSTALLED" -eq 0 ]; then
        echo "pgTAP extension is not installed. Installing..."
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS pgtap;"
    fi
    
    # Run the test and capture output
    if [ $VERBOSE -eq 1 ]; then
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
    else
        # Use pg_prove for nicer output if available
        if command -v pg_prove &> /dev/null; then
            PGPASSWORD="$DB_PASSWORD" pg_prove -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" "$file"
        else
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file" | grep -E "^(ok|not ok|#|1\.\.|plan)"
        fi
    fi
    
    # Check psql exit status
    local status=$?
    if [ $status -ne 0 ]; then
        echo "Test failed: $basename"
        return 1
    fi
    
    if [ $VERBOSE -eq 1 ]; then
        echo "Test passed: $basename"
    fi
    return 0
}

# Check if all necessary commands are available
if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found. Please install PostgreSQL client tools."
    exit 1
fi

# Find and run tests
echo "Running pgTAP tests for prettygood.music database"
echo "Database: $DB_NAME on $DB_HOST:$DB_PORT"

if [ -n "$SPECIFIC_FILE" ]; then
    # Run a specific file
    TEST_PATH="${TEST_DIR}/${SPECIFIC_FILE}"
    if [ ! -f "$TEST_PATH" ]; then
        echo "Error: Test file not found: $TEST_PATH"
        exit 1
    fi
    
    echo "Running specific test: $SPECIFIC_FILE"
    run_test_file "$TEST_PATH"
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
        if run_test_file "$file"; then
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
