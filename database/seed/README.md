# Seed Data for prettygood.music

This directory contains SQL seed files to populate the database with realistic test data for development and testing purposes.

## Running Seed Files

You can run all seed files in the correct order using the master seed file:

```bash
psql -U postgres -d prettygood < seed/000_run_all.sql
```

Alternatively, you can use the database Makefile commands:

```bash
# From the database directory
make seed

# From the project root
make db-seed
```

## Seed File Structure

The seed files are organized in a logical order to respect database relationships:

1. **000_run_all.sql** - Master file that runs all seed files in the correct order
2. **001_development_users.sql** - Creates development users and artists with predictable credentials
3. **002_test_content.sql** - Creates albums and tracks for testing
4. **003_playlists.sql** - Creates playlists and adds tracks to them
5. **004_likes_follows.sql** - Sets up likes and follows relationships
6. **005_play_history.sql** - Creates play history records
7. **006_user_library.sql** - Adds tracks, albums, and artists to user libraries
8. **007_payments.sql** - Creates test payments/tips between users and artists
9. **008_search_history.sql** - Creates search history for users

## Test Users

The seed files create the following users with predictable credentials:

### Admin User
- ID: `00000000-0000-0000-0000-000000000001`
- Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000001`
- Username: `admin`
- Display Name: `System Admin`

### Artist Users
- **Electric Symphony**
  - ID: `00000000-0000-0000-0000-000000000002`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000002`
  - Username: `electric_symphony`

- **Vintage Echoes**
  - ID: `00000000-0000-0000-0000-000000000003`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000003`
  - Username: `vintage_echoes`

- **Sonic Wanderer**
  - ID: `00000000-0000-0000-0000-000000000006`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000006`
  - Username: `sonic_wanderer`

- **Melodic Journey**
  - ID: `00000000-0000-0000-0000-000000000007`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000007`
  - Username: `melodic_journey`

- **Bass Architect**
  - ID: `00000000-0000-0000-0000-000000000008`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000008`
  - Username: `bass_architect`

### Regular Users
- **Music Lover**
  - ID: `00000000-0000-0000-0000-000000000004`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000004`
  - Username: `music_lover42`

- **Beat Enthusiast**
  - ID: `00000000-0000-0000-0000-000000000005`
  - Wallet Address: `0x0000000000000000000000000000000000000000000000000000000000000005`
  - Username: `beat_enthusiast`

## Seed Data Content

The seed data includes:

- **Albums**: 5 albums across different genres
- **Tracks**: 10 tracks with full metadata (2 tracks per album)
- **Playlists**: 3 playlists with different tracks
- **Play History**: Realistic play history entries for both test users
- **Likes**: Track, album, and artist likes for both test users
- **Follows**: Artist follows for both test users
- **Library**: Saved tracks, albums, and artists for both test users
- **Payments**: Tips from users to artists for tracks they enjoyed
- **Search History**: Search queries for both test users

## Development Notes

- All IDs use predictable UUIDs for easy reference in code and tests
- User IDs start with `00000000-0000-0000-0000-00000000000X`
- Album IDs start with `10000000-0000-0000-0000-00000000000X`
- Track IDs start with `20000000-0000-0000-0000-00000000000X`
- Playlist IDs start with `30000000-0000-0000-0000-00000000000X`
- Payment IDs start with `40000000-0000-0000-0000-00000000000X`
- All dates are relative to the current date when the seed is run (using `NOW() - INTERVAL X days`)
