# PrettyGood Music Declarative Database Schema

This directory contains the declarative database schema for the PrettyGood Music application using Supabase.

## Overview

The database schema is organized into the following files:

1. `schemas/00_core_schemas.sql` - Core schemas and functions
2. `schemas/01_users.sql` - User profiles and settings
3. `schemas/02_artists.sql` - Artist profiles 
4. `schemas/03_albums.sql` - Albums and artist catalogs
5. `schemas/04_tracks.sql` - Tracks and play history
6. `schemas/05_playlists.sql` - Playlists and collaborations
7. `schemas/06_payments.sql` - Payments and tipping system
8. `schemas/07_genres.sql` - Genre categorization system

## Using with Supabase

### Local Development

1. Start your Supabase local development instance:
   ```bash
   supabase start
   ```

2. Apply the schema files in order:
   ```bash
   cat schemas/*.sql | supabase db execute
   ```

3. Reset the database if needed:
   ```bash
   supabase db reset
   ```

### Deploying to Supabase

1. Connect to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Push schema changes:
   ```bash
   supabase db push
   ```

## Database Design Principles

### Authentication

- Uses Supabase Auth for user authentication
- Custom triggers tie auth.users to prettygood.users
- Uses Row Level Security (RLS) for authorization

### Row Level Security

All tables have proper Row Level Security policies:

- Public data is viewable by everyone
- Personal data is only accessible to the owner
- Artist data is manageable by the artist

### Data Access Patterns

- Views for commonly accessed joined data
- Functions for complex operations with proper security
- Proper indexing on frequently queried columns

## Migration from Previous Schema

If migrating from the old migrations-based approach:

1. Create a new database in Supabase
2. Apply the new schema files
3. Export data from the old database
4. Import data into the appropriate tables in the new schema
5. Verify relationships and constraints

## Security Considerations

- All sensitive data is stored in the `prettygood_private` schema
- Authentication leverages Supabase Auth
- All functions that modify data use `SECURITY DEFINER` with proper checks
- RLS policies ensure users can only access appropriate data

## Database Roles

- `anon` - Unauthenticated access (limited to public data)
- `authenticated` - Regular authenticated users
- `service_role` - For server-side operations that bypass RLS

## Schema Cheat Sheet

### Main Tables

- `users` - User profiles
- `artists` - Artist profiles (extends users)
- `albums` - Music albums
- `tracks` - Music tracks
- `playlists` - User playlists
- `payments` - Payment transactions

### Junction Tables

- `playlist_tracks` - Tracks in playlists
- `track_genres` - Genre assignments for tracks
- `album_genres` - Genre assignments for albums
- `artist_genres` - Genre assignments for artists

### Library Tables

- `user_library_tracks` - Tracks saved to user library
- `user_library_albums` - Albums saved to user library
- `user_library_artists` - Artists followed by user

### Activity Tables

- `play_history` - Track play events
- `user_recently_played` - Recently played tracks
- `track_likes`, `album_likes`, `playlist_likes` - Like activity
