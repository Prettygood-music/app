# Migration Cleanup Guide

This document outlines which migrations from the original system are no longer needed with the new declarative schema approach.

## Migrations Analysis

The original database used a migration-based approach with 41+ migration files, many of which were fixes for previous migrations. With the new declarative schema approach, these migrations are replaced by a more maintainable set of schema files.

## Categories of Removed Migrations

### 1. Authentication Fixes

The following migrations related to authentication fixes are consolidated into `01_users.sql` and no longer needed:

- ✅ 013_create_auth_system.sql - Replaced by Supabase Auth integration
- ✅ 018_add_password_auth.sql - Replaced by Supabase Auth
- ✅ 019_add_email_verification.sql - Replaced by Supabase Auth
- ✅ 020_add_password_reset.sql - Replaced by Supabase Auth
- ✅ 021_add_login_tracking.sql - Replaced by Supabase Auth features
- ✅ 024_add_token_refresh.sql - Replaced by Supabase Auth token handling
- ✅ 025_fix_register_user_ambiguous_column.sql - Fixed in declarative schema
- ✅ 026_fix_ambiguous_columns.sql - Fixed in declarative schema
- ✅ 027_fix_authenticate_user_function.sql - Replaced by Supabase Auth
- ✅ 028_fix_jwt_algorithm.sql - Replaced by Supabase Auth
- ✅ 029_fix_token_refresh.sql - Replaced by Supabase Auth
- ✅ 033_fix_user_role_field.sql - Properly defined in new schema

### 2. Debug Migrations (Should Never Be in Production)

The following debug-related migrations are removed completely:

- ✅ 030_add_jwt_debug_functions.sql - Debug functions removed
- ✅ 031_debug_refresh_token.sql - Debug functions removed
- ✅ 032_fix_jwt_signature_base64url.sql - Fixed in new auth approach
- ✅ 034_detailed_token_tracing.sql - Debug functions removed
- ✅ 035_fix_base64_padding.sql - Fixed in new auth approach
- ✅ 036_clean_token_generation.sql - Fixed in new auth approach

### 3. RPC Functions Replaced with Views

The following migrations with RPC functions have been optimized:

- ✅ 014_create_play_count_functions.sql - Replaced with efficient views
- ✅ 017_add_play_count_views.sql - Improved and included in new schema
- ✅ 022_add_analytics_functions.sql - Replaced with more efficient analytics views

### 4. Permission Fixes

The following migrations that fixed permission issues are properly implemented in the new schema:

- ✅ 010_create_rls_policies.sql - Replaced with proper RLS policies
- ✅ 039_fix_table_permissions.sql - Fixed in new schema
- ✅ 040_fix_tracks_permissions.sql - Fixed in new schema

### 5. Core Schema (Modified and Improved)

These core schema migrations are replaced with improved versions:

- ✅ 001_create_schemas.sql - Replaced by `00_core_schemas.sql`
- ✅ 002_create_users.sql - Replaced by `01_users.sql`
- ✅ 003_create_artists.sql - Replaced by `02_artists.sql`
- ✅ 004_create_albums.sql - Replaced by `03_albums.sql`
- ✅ 005_create_tracks.sql - Replaced by `04_tracks.sql`
- ✅ 006_create_playlists.sql - Replaced by `05_playlists.sql`
- ✅ 007_create_payments.sql - Replaced by `06_payments.sql`
- ✅ 008_create_library.sql - Distributed across relevant schema files
- ✅ 009_create_settings.sql - Moved to `01_users.sql`
- ✅ 012_create_play_history.sql - Moved to `04_tracks.sql`
- ✅ 023_create_genres_table.sql - Replaced by `07_genres.sql`

### 6. Improvements and Fixes

These migrations that added improvements are properly implemented in the new schema:

- ✅ 011_create_api_functions.sql - Functions moved to relevant schema files
- ✅ 015_rename_columns.sql - Columns properly named in new schema
- ✅ 016_update_api_functions.sql - Functions updated in new schema
- ✅ 038_add_explicit_artist_registration.sql - Properly implemented in `02_artists.sql`
- ✅ 041_create_track_rpc.sql - Improved and included in `04_tracks.sql`

## Benefits of the New Approach

1. **Simplified Structure** - Consolidated 41+ migrations into 8 clear schema files
2. **Better Organization** - Related tables and functions are grouped together
3. **Improved Security** - Consistent RLS policies and proper auth integration
4. **Reduced Redundancy** - No need for multiple fix migrations
5. **Better Performance** - Optimized views instead of redundant RPC functions
6. **Maintainability** - Easier to understand and modify the schema

## Migration Process

The following steps should be taken to migrate to the new schema:

1. Review the new schema files to understand the structure
2. Create a new database using the declarative schema
3. Migrate data from the old database to the new one
4. Verify all relationships and constraints are maintained
5. Update application code to use the new structure
6. Remove the old migration files once the migration is complete

This approach provides a clean break from the complex migration history while preserving all the functionality and fixing the previous issues.
