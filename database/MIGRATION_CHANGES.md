# Database Migration Changes

This document outlines the changes made to align the database schema with our updated models.

## Summary of Changes

1. **User Model**:
   - Made `wallet_address` nullable
   - Renamed `profile_image` to `profile_url`

2. **Album Model**:
   - Renamed `cover_image` to `cover_url`

3. **Track Model**:
   - Renamed `cover_image` to `cover_url`
   - Made `genre` non-nullable with default empty array

4. **Playlist Model**:
   - Renamed `cover_image` to `cover_url`
   - Removed `collaborative` field

5. **Play Count Functionality**:
   - Added functions to calculate play counts from play history
   - Added views to easily access play count statistics

## Migration Files Created/Modified

1. **Modified Migrations**:
   - `002_create_users.sql`: Made wallet_address nullable and renamed profile_image to profile_url
   - `004_create_albums.sql`: Renamed cover_image to cover_url
   - `005_create_tracks.sql`: Renamed cover_image to cover_url and made genre non-nullable
   - `006_create_playlists.sql`: Renamed cover_image to cover_url and removed collaborative field

2. **New Migrations**:
   - `014_create_play_count_functions.sql`: Functions to calculate play counts
   - `015_rename_columns.sql`: Migration for renaming columns in existing database
   - `016_update_api_functions.sql`: Updated API functions to match new column names
   - `017_add_play_count_views.sql`: Created views for play count statistics

## Naming Convention

- Consistently using snake_case for all properties
- All image/media URLs now have `_url` suffix (e.g., `cover_url`, `profile_url`, `audio_url`)
- Consistent timestamp fields (`created_at`, `updated_at`)

## Play Count Implementation

Play counts are now calculated dynamically from the `play_history` table using:

1. **Functions**:
   - `get_track_play_count(track_id)`: Returns play count for a specific track
   - `get_track_play_count_by_period(track_id, start_date, end_date)`: Returns play count within a time range
   - `get_artist_play_count(artist_id)`: Returns total play count for all tracks by an artist
   - `get_album_play_count(album_id)`: Returns total play count for all tracks in an album

2. **Views**:
   - `track_play_counts`: Aggregated play counts for each track
   - `artist_play_counts`: Aggregated play counts for each artist
   - `album_play_counts`: Aggregated play counts for each album
   - `user_play_counts`: Aggregated play counts for each user

These changes align the database schema with the front-end models while maintaining all the existing functionality.
