# prettygood.music Database

This directory contains the PostgreSQL database schema and migrations for the prettygood.music application.

## Structure

- `/migrations`: Contains SQL migration files in numbered order
- `/seed`: Contains seed data for development and testing
- `/scripts`: Helper scripts for database management
- `/tests`: pgTAP database tests
- `/docker`: Docker configuration files for PostgreSQL
- `run-migrations.sh`: Shell script to run migrations

## Docker Setup

The database includes a complete Docker setup with PostgreSQL, pgTAP for testing, and PostgREST for API access.

### Running with Docker

```bash
# Build and start the Docker containers
make db-docker-build
make db-docker-up

# Setup a fresh database (drop, recreate, run migrations, seed data)
make db-docker-fresh

# Run tests
make db-docker-test

# Access database shell
make db-docker-shell

# Stop the Docker containers
make db-docker-down
```

Or you can use the npm scripts directly:

```bash
# Build and start the Docker containers
npm run docker:build
npm run docker:up

# Setup fresh database
npm run docker:setup-fresh-db

# Run tests
npm run docker:test

# Run all steps in one command
npm run docker:all
```

### Included Services

1. **PostgreSQL**: A custom PostgreSQL image with pgTAP and other extensions installed
2. **PostgREST**: Provides RESTful API access to the database
3. **pgAdmin**: Web-based administration tool for PostgreSQL

Access these services at:
- PostgreSQL: localhost:5432
- PostgREST: localhost:3000
- pgAdmin: localhost:5050 (login: admin@prettygood.music / admin)

## Database Setup and Reset

You can set up or completely reset the database using the provided scripts:

```bash
# Complete setup - reset database, run migrations, and apply seed data
npm run setup-fresh-db:dev

# Just reset the database (drop and recreate)
npm run reset-db:dev

# Just run migrations (without dropping the database)
npm run migrate:dev
```

These scripts can be used in development, CI/CD pipelines, or to provide a clean database for testing.

## Migration Files

The migration files follow a simple numbered convention:

```
NNN_descriptive_name.sql
```

Where `NNN` is a sequential number starting from 001.

Migrations are designed to be run in order, and each one is idempotent (can be run multiple times without causing problems).

## Migration Tracking

Migrations are tracked in the `prettygood_private.migrations` table, which stores:

- `id`: The migration number (e.g., "001")
- `name`: The migration filename
- `applied_at`: Timestamp when the migration was applied

## Creating New Migrations

To create a new migration file:

```bash
npm run create-migration -- "descriptive_name_of_migration"
```

This will create a new SQL file with the next sequential number.

## Seed Data

The seed directory contains SQL files that populate the database with test data for development and testing. The seed files follow the same numbered convention as migration files and are run in order.

### Creating New Seed Files

To create a new seed file:

```bash
npm run create-seed -- "descriptive_name_of_seed"
```

This will create a new SQL file in the seed directory with the next sequential number.

### Running Seed Files

Seed files are automatically run as part of the `setup-fresh-db` script. They are not run by the standard migration script.

## TypeScript Type Generation

The database includes a type generator that creates TypeScript type definitions from the database schema. This ensures type safety between your database and TypeScript codebase.

### Generating Types

```bash
# Generate TypeScript types
npm run generate-types

# Generate advanced types (including enums and functions)
npm run generate-types:advanced

# Generate types using Docker
npm run generate-types:docker

# Generate advanced types using Docker
npm run generate-types:advanced:docker

# Setup fresh database and generate types in one step
npm run setup-and-generate

# Setup fresh database and generate types using Docker in one step
npm run docker:setup-and-generate
```

Or using the Makefile:

```bash
# Generate TypeScript types
make db-generate-types

# Generate advanced types
make db-generate-types-advanced

# Generate types using Docker
make db-docker-generate-types

# Generate advanced types using Docker
make db-docker-generate-types-advanced

# Setup fresh database and generate types in one step
make db-setup-and-generate

# Setup fresh database and generate types using Docker in one step
make db-docker-setup-and-generate
```

### Generated Types

The type generator creates TypeScript interfaces for all tables, views, enums, and functions in the database. The types are organized into:

```
common/src/types/db/
├── models/       # Table and view interfaces
├── enums/        # PostgreSQL enum types
├── functions/    # Function type definitions
└── index.ts      # Main export file
```

For more details on the type generator, see the [Type Generator README](./scripts/type-generator/README.md).

## Database Testing with pgTAP

The database includes comprehensive tests using pgTAP, a testing framework for PostgreSQL that allows writing tests in SQL.

### Test Structure

Tests are organized into the following categories:

- `structure/`: Tests for database structure (tables, columns, constraints)
- `functions/`: Tests for stored procedures and functions
- `security/`: Tests for Row Level Security policies
- `api/`: Tests for API functions
- `integrity/`: Tests for data integrity

### Running Tests

You can run the tests using npm scripts:

```bash
# Run all tests
npm run test:db:dev

# Run specific test categories
npm run test:db:structure
npm run test:db:functions
npm run test:db:security
npm run test:db:api
npm run test:db:integrity

# Run tests with verbose output
npm run test:db:verbose

# Run a specific test file
npm run test:db:dev -- -f structure/tables.sql
```

Or using the Makefile:

```bash
# Run all database tests
make db-test

# Run specific test categories
make db-test-structure
make db-test-functions
make db-test-security
make db-test-api
make db-test-integrity
```

### Running Tests in Docker

You can also run the tests in Docker:

```bash
# Run all tests in Docker
npm run docker:test

# Run specific test categories in Docker
npm run docker:test:structure
npm run docker:test:functions
npm run docker:test:security
npm run docker:test:api
npm run docker:test:integrity

# Run tests with verbose output in Docker
npm run docker:test:verbose
```

### Writing New Tests

To write a new test, follow the pgTAP format:

```sql
-- Start transaction
BEGIN;

-- Load pgTAP and plan the tests
SELECT plan(3);

-- Test cases
SELECT has_table('prettygood', 'users', 'users table should exist');
SELECT col_is_pk('prettygood', 'users', 'id', 'id column should be primary key');
SELECT col_is_unique('prettygood', 'users', 'username', 'username should be unique');

-- Finish the tests and rollback
SELECT * FROM finish();
ROLLBACK;
```

For more information on pgTAP functions, see the [pgTAP documentation](https://pgtap.org/).

## Database Schema

The database uses two schemas:

- `prettygood`: Public schema with tables accessible through the API
- `prettygood_private`: Private schema for sensitive data and internal functions

## Row-Level Security

The database uses PostgreSQL's Row-Level Security (RLS) to control access to data at the row level. Policies are defined for each table to ensure users can only access data they're authorized to see.

## Authentication Flow

Authentication uses Sui wallet signatures:

1. User requests a nonce from the server
2. User signs the nonce with their wallet
3. Server verifies the signature and issues a JWT token
4. JWT token is used for subsequent API requests

## API Functions

The database provides a number of stored procedures that implement API functionality directly in the database. These are exposed through PostgREST.

## Foreign Keys and Constraints

Tables use UUID primary keys and foreign key constraints to ensure data integrity. Cascading deletes are used where appropriate to automatically clean up related data.

## Development vs Production

The setup process described here is primarily for development and testing. In a production environment, you would typically:

1. Never run seed data files
2. Use a more sophisticated migration strategy with versioning
3. Have proper backups and rollback strategies
4. Use environment variables for all sensitive information

## Connection Environment Variables

All scripts accept the following environment variables for database connections:

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: prettygood)
- `DB_USER` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
