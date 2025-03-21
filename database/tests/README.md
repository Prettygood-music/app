# pgTAP Tests for prettygood.music Database

This directory contains pgTAP tests for the PostgreSQL database schema, functions, and data integrity.

## Directory Structure

- `structure/`: Tests for database structure (tables, columns, constraints)
- `functions/`: Tests for stored procedures and functions
- `security/`: Tests for Row Level Security policies and authentication
- `api/`: Tests for API functions exposed through PostgREST
- `integrity/`: Tests for data integrity and business rules
- `fixtures/`: Test data fixtures specific to testing

## Running Tests

You can run the tests using the provided npm scripts:

```bash
# Run all tests
npm run test:db

# Run specific test files
npm run test:db -- -f structure/tables.sql
```

Or using the Makefile:

```bash
# Run all database tests
make db-test

# Run specific test suite
make db-test-structure
make db-test-functions
make db-test-security
```

## Writing Tests

pgTAP uses the Test Anything Protocol (TAP) and provides functions for testing PostgreSQL database objects. 

Example test:

```sql
-- Start transaction to roll back any test changes
BEGIN;

-- Load pgTAP
SELECT plan(3);

-- Test if table exists
SELECT has_table('prettygood', 'users', 'users table should exist');

-- Test if column exists
SELECT has_column('prettygood', 'users', 'username', 'users table should have username column');

-- Test if column has a constraint
SELECT col_is_unique('prettygood', 'users', 'username', 'username column should be unique');

-- Finish the tests and rollback any changes
SELECT * FROM finish();
ROLLBACK;
```

For more information on pgTAP functions, see the [official documentation](https://pgtap.org/).

## Best Practices

1. Always wrap your tests in a transaction (BEGIN/ROLLBACK) to avoid test data persisting
2. Use descriptive test names to make failure messages clear
3. Organize tests by functional area or database object
4. Use pgTAP's `plan()` function to ensure the expected number of tests are run
5. Include comments explaining the purpose of complex tests
