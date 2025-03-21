# Database Seed Files

This directory contains SQL seed files for the prettygood.music application. These seed files are used to populate a fresh database with test data for development and testing purposes.

## Purpose

Seed files are useful for:

- Setting up a consistent development environment
- Creating test data for automated tests
- Demonstrating database schema with realistic data
- Testing specific scenarios with controlled data

## File Organization

Seed files follow a numbered naming convention similar to migrations:

```
NNN_descriptive_name.sql
```

Files are executed in numeric order, so dependencies between seed data should be considered when organizing files.

## Current Seed Files

1. **001_development_users.sql** - Creates test users and artists with predictable IDs
2. **002_test_content.sql** - Creates test albums, tracks, playlists, etc.

## Running Seed Files

Seed files are automatically executed as part of the setup-fresh-database.sh script. To run them:

```bash
# Full database reset with migrations and seed data
./scripts/setup-fresh-database.sh
```

## Creating New Seed Files

To add a new seed file, create a SQL file in this directory with the next sequential number:

```
003_your_new_seed_file.sql
```

## Guidelines for Seed Data

- Use fixed UUIDs (with prefixes like `00000000-...` for users, `10000000-...` for albums, etc.)
- Include enough data to test all features but keep it minimal
- Add comments to explain test scenarios
- Avoid dependencies on sample data from migrations
- Use `ON CONFLICT DO NOTHING` to make seed files idempotent
- Consider including test scenarios in comments

## Development/Test Data vs Production Data

These seed files are strictly for development and testing. Never use them in a production environment. The data created here is intended to be easily recognizable and predictable for testing purposes.
