# Genres Database Migration

## Overview

This migration (`023_create_genres_table.sql`) enhances the database structure by replacing the existing genre arrays with a proper relational model for genres. Instead of storing genres as text arrays in the tracks, artists, and albums tables, we now have a dedicated `genres` table with junction tables to establish many-to-many relationships.

## Changes Made

### 1. New Tables

- **`prettygood.genres`** - A central table for storing genre information:
  - `id` - UUID identifier
  - `name` - Genre name (unique)
  - `description` - Optional description
  - `image_url` - Optional URL for a genre image
  - `color` - Optional color code for UI display
  - `slug` - URL-friendly version of the name
  - `popularity` - Calculated popularity score
  - Standard timestamp columns

- **Junction Tables**:
  - `prettygood.track_genres` - Links tracks to genres
  - `prettygood.artist_genres` - Links artists to genres
  - `prettygood.album_genres` - Links albums to genres

### 2. Migration Function

The migration includes a function `prettygood_private.migrate_genres()` that:
1. Collects all unique genre names from existing `genre` arrays
2. Creates entries in the new `genres` table
3. Creates appropriate entries in the junction tables based on the existing associations
4. Calculates initial popularity scores based on track counts

### 3. New Database Functions

- `prettygood.get_related_genres(p_genre_id, p_limit)` - Gets genres related to a specified genre
- `prettygood.get_popular_genres(p_start_date, p_end_date, p_limit)` - Gets popular genres in a time period
- `prettygood.get_tracks_by_genre(p_genre_id, p_limit, p_offset)` - Gets tracks for a specific genre
- `prettygood.get_artists_by_genre(p_genre_id, p_limit, p_offset)` - Gets artists for a specific genre
- `prettygood.get_albums_by_genre(p_genre_id, p_limit, p_offset)` - Gets albums for a specific genre

### 4. Row-Level Security Policies

Added RLS policies for all new tables:
- `genres` table is readable by anyone, but only admins can modify
- Junction tables have appropriate policies to ensure only the owner of the content can modify genre associations

## Benefits of the New Model

1. **Data Consistency**: Centralized genre definitions ensure consistency across the application
2. **Enhanced Metadata**: Can now store additional information about genres (descriptions, images, etc.)
3. **Improved Querying**: The relational model makes complex queries more efficient
4. **Better Performance**: Properly indexed junction tables improve query performance
5. **UI Enhancements**: Additional metadata enables richer UI experiences

## API Usage Examples

### Getting All Genres

```typescript
const { data, error } = await db
  .from('genres')
  .select('*')
  .order('name');
```

### Getting Tracks by Genre

Using the database function:
```typescript
const { data, error } = await db.rpc('get_tracks_by_genre', {
  p_genre_id: 'some-genre-id',
  p_limit: 20,
  p_offset: 0
});
```

Or using the junction table:
```typescript
const { data, error } = await db
  .from('track_genres')
  .select(`
    tracks (
      id,
      title,
      artist_id,
      album_id,
      duration,
      artists (name),
      albums (title)
    )
  `)
  .eq('genre_id', 'some-genre-id')
  .limit(20);
```

### Getting Popular Genres

```typescript
const { data, error } = await db.rpc('get_popular_genres', {
  p_start_date: '2023-01-01',
  p_end_date: '2023-12-31',
  p_limit: 10
});
```

## Backward Compatibility

The existing `genre` array columns in the tracks, artists, and albums tables have not been removed in this migration. This allows for a smooth transition period where both systems can coexist. In a future migration, once all code has been updated to use the new model, these array columns can be deprecated and eventually removed.

To maintain compatibility during transition, it would be advisable to:

1. Update the insert/update triggers on these tables to sync with the new junction tables
2. Create a view that exposes the new genre relationships in the old array format

## Next Steps

1. Update API functions to use the new genre model
2. Update frontend components to use the enhanced genre data
3. Add additional genre-related features that leverage the new model
4. Plan for future removal of the original array columns
