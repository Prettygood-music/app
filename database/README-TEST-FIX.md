# Database Testing Fix

## Problem 
The PostgreSQL container was failing to start because of issues with installing pgTAP, including missing the `patch` command.

## Solution
Instead of trying to compile and install the full pgTAP extension, we created a simplified version that implements just the functions needed for our tests. This approach:

1. Uses a minimal set of test functions that mimic pgTAP behavior
2. Doesn't require compilation or installation of extensions
3. Works with any PostgreSQL container without modification

## Files Modified
- Created `docker/Dockerfile.simple` - a simpler Dockerfile without pgTAP compilation
- Created `docker/init-pgtap-simple.sh` - a script that creates basic test functions in a `tap` schema
- Updated `tests/setup-simple.sql` - includes the `tap` schema in the search path
- Updated `tests/api/library_functions.sql` - uses the simplified setup file
- Updated `docker-compose.yaml` - uses the simpler Dockerfile

## How to Use
1. First, rebuild the database container:
   ```
   make db-docker-build
   ```

2. Start the database services:
   ```
   make db-docker-up
   ```

3. Create a fresh database with all migrations:
   ```
   make db-docker-fresh
   ```

4. Run the tests:
   ```
   make db-docker-test
   ```

Or run the complete setup with one command:
   ```
   make db-docker-setup
   ```

## What This Does
Instead of installing pgTAP as a PostgreSQL extension, this approach creates a simple schema called `tap` with custom functions that mimic the pgTAP functions we need:

- `plan(count)` - Plans the number of tests
- `ok(condition, message)` - Tests if a condition is true
- `is(got, expected, message)` - Tests if two values are equal
- `isnt(got, expected, message)` - Tests if two values are not equal
- `lives_ok(sql, message)` - Tests if SQL executes without errors
- `is_empty(sql, message)` - Tests if a query returns no rows
- `isnt_empty(sql, message)` - Tests if a query returns at least one row
- `finish()` - Finishes the test run

These functions provide the same interface as pgTAP but are implemented directly in PL/pgSQL, avoiding the need for C compilation and extension installation.

## Why This Works
This approach works because:

1. The test code only uses a small subset of pgTAP functions
2. PostgreSQL's schema system allows us to namespace our functions similarly to pgTAP
3. PL/pgSQL is powerful enough to implement the test functions we need
4. Setting the search path makes our functions available without schema qualification

This provides a more reliable solution that doesn't depend on complex build processes or external dependencies.
