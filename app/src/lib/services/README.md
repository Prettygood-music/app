# Services

This directory contains service modules for interfacing with various data sources and APIs in the prettygood.music application.

## Available Services

### Analytics Service

Located in: `/app/src/lib/services/analytics/`

Provides functions for retrieving and analyzing artist performance data, including play counts, follower growth, engagement metrics, and earnings analytics. Used primarily in the artist dashboard.

**Key Features:**
- Play count analytics by time period
- Follower growth tracking
- Revenue and earnings analysis
- User engagement metrics
- Traffic source analysis

### Genres Service

Located in: `/app/src/lib/services/genres/`

Provides functions for retrieving and filtering music content by genre categories. Supports genre browsing, content discovery, and search filtering by genre.

**Key Features:**
- Genre listing and details
- Genre-specific content (tracks, artists, albums)
- Related genres discovery
- Popular genres by play count
- Genre search and filtering

## Usage Guidelines

### Database Access

All services use the `@prettygood/database` package for database access:

```typescript
import { createClient } from '@prettygood/database';

// Create a client instance
const db = createClient(import.meta.env.VITE_POSTGREST_URL);

// Use the client for database operations
const { data, error } = await db
  .from('table_name')
  .select('*')
  .limit(10);
```

### Error Handling

Services should implement consistent error handling:

1. Use try/catch blocks to handle potential errors
2. Log errors with appropriate context
3. Return structured error responses when possible
4. Provide fallback data when appropriate

### State Management Integration

Services work well with Svelte 5 runes for state management:

```typescript
// Component using a service
import { getGenreById } from '$lib/services/genres';

// State
let genre = $state(null);
let isLoading = $state(true);
let error = $state(null);

// Effect to load data
$effect(async () => {
  try {
    isLoading = true;
    genre = await getGenreById('some-genre-id');
  } catch (err) {
    error = err;
    console.error('Error loading genre:', err);
  } finally {
    isLoading = false;
  }
});
```

## Adding a New Service

When creating a new service:

1. Create a new directory in `/app/src/lib/services/` for your service
2. Implement a clear API with well-defined function signatures
3. Create a proper type system for your service
4. Document your service in this README.md file
5. Add appropriate exports to the service's `index.ts`
6. Consider adding the service to the global services index if it's widely used

## Related Documentation

- [Database Implementation](/documentation/Database-Implementation.md)
- [Authentication Implementation Plan](/documentation/Authentication-implementation-plan.md)
- [Genres Implementation Summary](/documentation/Genres-Implementation-Summary.md)
