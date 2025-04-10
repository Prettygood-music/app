# @prettygood/database Package Documentation

## Overview

The `@prettygood/database` package provides a type-safe interface to the prettygood.music PostgreSQL database using PostgREST. This package has been implemented to replace the mock data previously used in the application, providing a consistent and reliable data source with proper TypeScript typing.

## Installation

The package is included in the monorepo and can be imported in other packages:

```typescript
import { createClient } from '@prettygood/database';
```

## Key Features

- Complete TypeScript types for all database tables, views, and functions
- Zod validation schemas for data validation
- PostgREST client integration for API access
- Type-safe queries and mutations

## Basic Usage

### Creating a Database Client

To create a database client, use the `createClient` function:

```typescript
import { createClient } from '@prettygood/database';

// Create a client with the PostgREST URL
const postgrestUrl = 'http://localhost:3000'; // Replace with your PostgREST URL
const db = createClient(postgrestUrl);
```

### Querying Data

Once you have a client, you can query data from the database:

```typescript
// Fetch all tracks
const { data: tracks, error } = await db
  .from('tracks')
  .select('*');

// Fetch tracks with related artist information
const { data: tracksWithArtists, error } = await db
  .from('tracks')
  .select(`
    id,
    title,
    audio_url,
    duration,
    artists (
      id,
      artist_name
    )
  `);

// Fetch tracks with filtering
const { data: filteredTracks, error } = await db
  .from('tracks')
  .select('*')
  .eq('artist_id', artistId)
  .order('created_at', { ascending: false })
  .limit(10);
```

### Inserting Data

```typescript
import { prettygoodTracksInsertSchemaSchema } from '@prettygood/database';

// Use Zod schema for validation
const newTrack = prettygoodTracksInsertSchemaSchema.parse({
  title: 'New Track',
  artist_id: artistId,
  audio_url: 'https://example.com/track.mp3',
  duration: 180,
  genre: ['pop', 'electronic']
});

// Insert the track
const { data, error } = await db
  .from('tracks')
  .insert(newTrack)
  .select();
```

### Updating Data

```typescript
// Update a track
const { data, error } = await db
  .from('tracks')
  .update({ title: 'Updated Track Title' })
  .eq('id', trackId)
  .select();
```

### Deleting Data

```typescript
// Delete a track
const { error } = await db
  .from('tracks')
  .delete()
  .eq('id', trackId);
```

### Calling Database Functions

The PostgreSQL database includes many stored functions for common operations. You can call these functions using the `rpc` method:

```typescript
// Add a track to the user's library
const { data, error } = await db.rpc('add_track_to_library', {
  track_id: trackId
});

// Get track play count
const { data: playCount, error } = await db.rpc('get_track_play_count', {
  track_id: trackId
});

// Create a playlist
const { data: newPlaylist, error } = await db.rpc('create_playlist', {
  name: 'My Awesome Playlist',
  description: 'A collection of great tracks',
  is_public: true
});
```

## TypeScript Integration

The package provides complete TypeScript types for all database entities:

### Tables and Columns

```typescript
import { Database } from '@prettygood/database';

// Type for the Track entity
type Track = Database['prettygood']['Tables']['tracks']['Row'];

// Type for Track insertion
type TrackInsert = Database['prettygood']['Tables']['tracks']['Insert'];

// Type for Track update
type TrackUpdate = Database['prettygood']['Tables']['tracks']['Update'];
```

### Database Functions

```typescript
// Type for the create_playlist function arguments
type CreatePlaylistArgs = Database['prettygood']['Functions']['create_playlist']['Args'];

// Type for the create_playlist function return value
type CreatePlaylistReturn = Database['prettygood']['Functions']['create_playlist']['Returns'];
```

## Zod Validation Schemas

The package includes Zod schemas for validating data before sending it to the database:

```typescript
import { 
  prettygoodTracksInsertSchemaSchema,
  prettygoodTracksUpdateSchemaSchema,
  prettygoodPlaylistsInsertSchemaSchema
} from '@prettygood/database';

// Validate track data before insertion
const validTrack = prettygoodTracksInsertSchemaSchema.parse(trackData);

// Validate playlist data before creation
const validPlaylist = prettygoodPlaylistsInsertSchemaSchema.parse(playlistData);
```

## Error Handling

PostgREST returns errors in a specific format. Handle them appropriately:

```typescript
const { data, error } = await db.from('tracks').select('*');

if (error) {
  console.error('Database error:', error.message);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
  console.error('Code:', error.code);
  
  // Handle different error codes
  if (error.code === '23505') {
    // Unique constraint violation
    console.error('A track with this ISRC already exists');
  }
  
  return;
}

// Process data
console.log('Tracks:', data);
```

## Authentication

The PostgREST client supports authentication through JWT tokens:

```typescript
// Set authentication token
db.auth(jwt);

// Clear authentication
db.auth(null);
```

## Common Patterns

### Repository Pattern

A recommended approach is to create repository classes for each entity type:

```typescript
// src/lib/repositories/tracks.repository.ts
import { createClient, Database } from '@prettygood/database';

type Track = Database['prettygood']['Tables']['tracks']['Row'];
type TrackInsert = Database['prettygood']['Tables']['tracks']['Insert'];

export class TracksRepository {
  private db;
  
  constructor(postgrestUrl: string) {
    this.db = createClient(postgrestUrl);
  }
  
  async findAll(): Promise<Track[]> {
    const { data, error } = await this.db.from('tracks').select('*');
    if (error) throw error;
    return data || [];
  }
  
  async findById(id: string): Promise<Track | null> {
    const { data, error } = await this.db
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    return data;
  }
  
  async create(track: TrackInsert): Promise<Track> {
    const { data, error } = await this.db
      .from('tracks')
      .insert(track)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
  
  // Add other methods as needed
}
```

### Service Pattern

Services can provide higher-level operations combining multiple repositories:

```typescript
// src/lib/services/library.service.ts
import { TracksRepository } from '../repositories/tracks.repository';
import { UserLibraryRepository } from '../repositories/user-library.repository';

export class LibraryService {
  private tracksRepo: TracksRepository;
  private libraryRepo: UserLibraryRepository;
  
  constructor(postgrestUrl: string) {
    this.tracksRepo = new TracksRepository(postgrestUrl);
    this.libraryRepo = new UserLibraryRepository(postgrestUrl);
  }
  
  async addTrackToLibrary(trackId: string): Promise<boolean> {
    // Check if track exists
    const track = await this.tracksRepo.findById(trackId);
    if (!track) throw new Error('Track not found');
    
    // Call the database function
    const { data, error } = await this.libraryRepo.db.rpc('add_track_to_library', {
      track_id: trackId
    });
    
    if (error) throw error;
    return !!data;
  }
  
  // Add other methods as needed
}
```

## Working with Views

The database includes several views that provide aggregated data. You can query them just like tables:

```typescript
// Get track play counts
const { data: trackPlayCounts, error } = await db
  .from('track_play_counts')
  .select('*')
  .order('play_count', { ascending: false })
  .limit(10);
```

## Row-Level Security (RLS)

The PostgreSQL database uses Row-Level Security policies to restrict access to data. This means:

1. Authentication is required for most operations
2. Users can only see and modify data they own or have access to
3. Certain operations are restricted to specific roles

Make sure to set the JWT token on the client before performing operations that require authentication:

```typescript
// Set JWT after user login
db.auth(jwt);
```

## Development Workflows

### Generating Types

If the database schema changes, you need to regenerate the TypeScript types:

```bash
# From the database directory
npm run generate-types:advanced
```

Or, from the app directory:

```bash
# From the app directory
npm run gen:types
```

### Testing Database Operations

When implementing new features, it's recommended to first test database operations in isolation:

1. Write a test that uses the database client directly
2. Verify that the operations work as expected
3. Implement the feature in the application

## Best Practices

1. **Always use type-checking**: Leverage the TypeScript types to ensure data consistency.
2. **Validate data with Zod**: Use the provided Zod schemas to validate data before sending it to the database.
3. **Handle errors properly**: Always check for errors in the database responses.
4. **Use transactions for complex operations**: For operations that involve multiple database changes, use transactions to ensure data consistency.
5. **Respect Row-Level Security**: Be aware of RLS policies and ensure users are authenticated when needed.
6. **Optimize queries**: Select only the columns you need to minimize data transfer.
7. **Use database functions**: Where possible, use the provided database functions rather than implementing complex logic in the application.

## Troubleshooting

### Common Issues

1. **Authentication errors**: Make sure the JWT token is set and valid.
2. **Permission denied**: Check RLS policies and user roles.
3. **Type errors**: Ensure database schema and TypeScript types are in sync.
4. **Data validation errors**: Use Zod schemas to validate data before sending it to the database.

### Debugging

For debugging database issues:

1. Check the PostgreSQL logs for detailed error messages
2. Use the pgAdmin interface to inspect the database state
3. Validate queries directly against PostgREST before using them in the application

## Further Resources

- [PostgREST Documentation](https://postgrest.org/en/stable/)
- [Zod Documentation](https://zod.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
