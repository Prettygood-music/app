# PostgreSQL TypeScript Type Generator

This tool generates TypeScript type definitions from a PostgreSQL database schema. It extracts table structures, enums, and function definitions to create strongly-typed interfaces for use in your TypeScript application.

## Features

- Generates TypeScript interfaces from PostgreSQL tables and views
- Extracts PostgreSQL enum types and creates corresponding TypeScript enums
- Creates type definitions for PostgreSQL functions
- Maps PostgreSQL data types to appropriate TypeScript types
- Handles array types, nullable fields, and primary keys
- Supports running in Docker or locally

## Usage

### Basic Usage

```bash
# Generate basic types
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
# Generate basic types
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

### Output Structure

The generated types are organized into the following structure:

```
common/src/types/db/
├── models/       # Table and view interfaces
├── enums/        # PostgreSQL enum types
├── functions/    # Function type definitions
└── index.ts      # Main export file
```

### Configuration

You can configure the type generator using the following environment variables:

- `DB_HOST`: PostgreSQL host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (default: prettygood)
- `DB_USER`: Database username (default: postgres)
- `DB_PASSWORD`: Database password (default: postgres)
- `OUTPUT_DIR`: Output directory for generated types (default: common/src/types/db)
- `USE_DOCKER`: Set to "true" to run in Docker container
- `USE_ADVANCED`: Set to "true" to use the advanced type generator

## Type Mapping

The type generator maps PostgreSQL types to TypeScript types as follows:

| PostgreSQL Type | TypeScript Type |
|----------------|----------------|
| int, integer, smallint, bigint | number |
| numeric, decimal, float | number |
| boolean, bool | boolean |
| text, varchar, char | string |
| uuid | string |
| date, timestamp, timestamptz | Date |
| json, jsonb | any |
| array types | T[] |
| enum types | Enum |

## Generated Types Example

### Table Interface

```typescript
/**
 * Represents the prettygood.users table.
 * @generated This is a generated type. Do not modify directly.
 */
export interface Users {
  /**
   * Primary key.
   * Type: uuid
   */
  id: string;

  /**
   * Type: text
   */
  wallet_address: string;

  /**
   * Type: text
   */
  username: string;

  /**
   * Type: timestamptz
   */
  created_at: Date;

  /**
   * Type: timestamptz
   */
  updated_at: Date;
}
```

### Enum Type

```typescript
/**
 * Represents the payment_status enum type from the database.
 * @generated This is a generated type. Do not modify directly.
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
```

### Function Type

```typescript
/**
 * Type definition for the prettygood.add_track_to_library database function.
 * @generated This is a generated type. Do not modify directly.
 */
export interface AddTrackToLibraryFunction {
  /**
   * @returns boolean
   */
  (track_id: string): Promise<boolean>;
}
```

## Notes

- The generated types are intended for use with TypeScript clients connecting to the PostgreSQL database.
- The type generator can be run as part of a CI/CD pipeline to keep types in sync with the database schema.
- Consider adding generated types to version control to ensure consistency across all developers.
