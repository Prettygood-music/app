# Database Testing Setup

This directory contains tests for the database functions and schema. Tests are written using pgTAP, a TAP-compliant testing framework for PostgreSQL.

## Setup

The testing environment is configured to automatically install and enable pgTAP in the test database container. PostgreSQL extensions required for testing (like pgtap) are installed as part of the Docker container build.

## Running Tests

Tests can be run using Docker Compose:

```bash
# Run all database tests
docker-compose -f compose.test.yaml up db-test

# Run just the database container with pgTAP for manual testing
docker-compose -f compose.test.yaml up postgres
```

## Test Structure

1. **setup.sql**: This file is included at the beginning of each test file and ensures that pgTAP is loaded.

2. **Test files**: Each test file is a SQL script that tests a specific feature or function.

## Writing Tests

Tests are written using the pgTAP framework. Here's a basic example:

```sql
-- Start transaction
BEGIN;

-- Load test setup
\i '/app/tests/setup.sql'

-- Plan the tests
SELECT plan(3);

-- Run the tests
SELECT ok(true, 'This test should pass');
SELECT is(2+2, 4, 'Addition works');
SELECT isnt(1, 2, 'One is not two');

-- Finish the tests
SELECT * FROM finish();

-- Rollback the transaction
ROLLBACK;
```

## Common pgTAP Functions

- `plan(n)`: Declare how many tests you plan to run
- `ok(boolean, description)`: Test whether a condition is true
- `is(value, expected, description)`: Test whether a value equals the expected value
- `isnt(value, not_expected, description)`: Test whether a value does not equal the expected value
- `lives_ok(sql, description)`: Test whether SQL code executes without errors
- `throws_ok(sql, error_code, description)`: Test whether SQL code throws a specific error
- `is_empty(sql, description)`: Test whether SQL returns no rows
- `isnt_empty(sql, description)`: Test whether SQL returns at least one row
- `finish()`: Finish the test run and display results

For more functions, see the [pgTAP documentation](https://pgtap.org/).

## Troubleshooting

If you encounter errors about pgTAP functions not existing:

1. Ensure the pgTAP extension is properly installed in the Docker container.
2. Check that the `setup.sql` file is being loaded at the beginning of your test.
3. Verify that the test is running inside a transaction.
4. Make sure the PostgreSQL container is using the custom Dockerfile that includes pgTAP.
