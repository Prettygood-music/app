# Database Implementation in prettygood.music

## Overview

The prettygood.music application uses a PostgreSQL database with PostgREST to provide a RESTful API interface. The database implementation follows best practices for security, performance, and type safety.

## Database Access in the Application

The application interacts with the database using the `@prettygood/database` package, which is included in the project monorepo. This package provides:

- A type-safe client for interacting with the database
- Complete TypeScript typing for all database entities
- Zod validation schemas for data validation
- Integration with PostgREST for API access

## Key Components

1. **PostgreSQL Database**: Core storage with tables for users, artists, tracks, albums, playlists, and more
2. **PostgREST**: Provides a RESTful API interface to the database
3. **Row-Level Security**: Controls access to data based on user roles and ownership
4. **Database Functions**: Implements business logic directly in the database
5. **TypeScript Integration**: Ensures type safety between database and application code

## Architecture

```
Frontend (SvelteKit) → @prettygood/database client → PostgREST → PostgreSQL
```

The client application (SvelteKit) uses the database package to communicate with PostgREST, which in turn communicates with the PostgreSQL database. Authentication is handled using JWT tokens, which are passed to PostgREST to authorize requests.

## Getting Started

To use the database in your code:

```typescript
import { createClient } from '@prettygood/database';

// Create a client
const postgrestUrl = import.meta.env.VITE_POSTGREST_URL;
const db = createClient(postgrestUrl);

// Authenticate (after user login)
db.auth(jwtToken);

// Query data
const { data, error } = await db
  .from('tracks')
  .select('*')
  .limit(10);
```

## Data Schema

The database includes tables for:

- Users and authentication
- Artists and their profiles
- Tracks and albums
- Playlists and user libraries
- Play history and analytics
- Search history and recommendations
- Payments and transactions

## Authentication and Security

The database uses Row-Level Security (RLS) policies to ensure users can only access data they're authorized to see. Most tables have policies that restrict access based on user ID or public availability.

Authentication is performed using JWT tokens, which are validated by PostgREST and used to enforce RLS policies.

## Detailed Documentation

For detailed documentation on using the `@prettygood/database` package, including examples, best practices, and troubleshooting, see the [DATABASE-PACKAGE-USAGE.md](/database/DATABASE-PACKAGE-USAGE.md) file in the database directory.

## Development Workflow

When working with the database:

1. Make database schema changes via migrations
2. Run migrations to update the database schema
3. Generate updated TypeScript types
4. Use the types and Zod schemas in your code

## Available Scripts

The following scripts are available for working with the database:

- `npm run setup-fresh-db:dev`: Reset the database and run migrations
- `npm run migrate:dev`: Run migrations without resetting the database
- `npm run generate-types:advanced`: Generate TypeScript types from the database schema
- `npm run test:db:dev`: Run database tests

## Best Practices

1. Always use the provided TypeScript types for type safety
2. Use Zod schemas to validate data before sending it to the database
3. Handle database errors appropriately
4. Use database functions for complex operations
5. Be aware of RLS policies when designing queries

## Next Steps

As the application continues to develop, the database will evolve to support:

1. Enhanced authentication with Sui wallet integration
2. Blockchain transaction tracking for artist payments
3. Advanced analytics for artists and users
4. Optimized query performance for scale
5. Caching strategies for frequently accessed data

## Related Documentation

- [Authentication Implementation Plan](/documentation/Authentication-implementation-plan.md)
- [TODO List](/documentation/TODO.md)
