# Genres Routes Implementation

## Overview

The Genres section provides browsing of music content by genre categories. The implementation connects the UI to real data sources using the @prettygood/database package, replacing mock data with actual database queries. Users can browse genres, view genre-specific content, and filter search results by genre.

## Features

### 1. Genre Browsing

- **Main Genres Page** (`/genres`)
  - Displays all available genres in a grid layout
  - Shows popular genres based on recent play activity
  - Provides tabbed navigation between popular and all genres
  - Connected to real data through the genres service

- **Genre Detail Page** (`/genres/[id]`)
  - Shows detailed information about a specific genre
  - Displays tracks, artists, and albums in that genre
  - Provides play functionality for genre content
  - Tab-based navigation between different content types
  - Shows related genres if available

### 2. Search Integration

- Genre-based filtering for search results
- Multi-genre selection via filter panel
- URL parameter synchronization for shareable genre-filtered search results
- Visual indicators for active genre filters
- Enhanced search UI with filter panel accessible via button

### 3. Data Services

- Complete genres service implementation with comprehensive database integration
- Rich genre metadata including images, colors, and slugs
- Support for sorting and pagination of genre content
- Related genres functionality
- Genre popularity metrics

## Technical Implementation

### Database Structure

The genres feature relies on the following database tables:

- `genres` - Primary table containing genre information
  - `id` - Unique identifier
  - `name` - Genre name
  - `description` - Optional description
  - `image_url` - Optional background image
  - `slug` - URL-friendly version of name
  - `color` - Optional theme color

- Junction tables for many-to-many relationships:
  - `track_genres` - Connects tracks to genres
  - `artist_genres` - Connects artists to genres
  - `album_genres` - Connects albums to genres

### Components

1. **Components in `/lib/components/genres/`**:
   - `GenreCard.svelte` - Visual card representation of a genre
   - `GenreGrid.svelte` - Grid layout for displaying multiple genres
   - `index.ts` - Exports all genre components

2. **Search Components**:
   - `GenreFilter.svelte` - UI for selecting and filtering by genres
   - Enhanced `EnhancedSearchBar.svelte` - Includes genre filter integration

### Services

The genres service in `/lib/services/genres/` provides:

1. **Core Functions**:
   - `getAllGenres()` - Get all available genres
   - `getGenreById()` - Get a specific genre by ID
   - `getGenreBySlug()` - Get a genre by its slug
   - `getTracksByGenre()` - Get tracks for a specific genre
   - `getArtistsByGenre()` - Get artists for a specific genre
   - `getAlbumsByGenre()` - Get albums for a specific genre
   - `getGenreWithContent()` - Get a genre with all its related content
   - `getRelatedGenres()` - Get genres related to a specific genre
   - `getPopularGenres()` - Get trending genres by time period
   - `searchGenres()` - Search for genres by name

2. **Helper Utilities**:
   - `formatDuration()` - Format track durations
   - `formatReleaseDate()` - Format release dates
   - `generateRandomColor()` - Generate colors for genres without one
   - `slugify()` - Convert genre names to URL-friendly slugs

### Routes

1. **Main Routes**:
   - `/genres` - Main genres browsing page
   - `/genres/[id]` - Genre detail page (works with both IDs and slugs)

2. **API Endpoints**:
   - Enhanced `/lib/api/search` endpoint with genre filtering support

### Data Flow

1. **Page Load**:
   - The `+page.ts` files load data from the genres service
   - Data is passed to the Svelte components via the `data` prop

2. **User Interactions**:
   - Clicking a genre card navigates to the genre detail page
   - Tab selection changes the displayed content
   - Genre filters in search update the URL parameters
   - "Play All" adds tracks to the player queue

3. **Search Integration**:
   - Genre filters are sent as URL parameters to the search API
   - API applies filtering based on the junction tables
   - Results are returned filtered by the selected genres

## Usage Examples

### Basic Genre Browsing

```svelte
<script>
  import { getAllGenres } from '$lib/services/genres';
  import { GenreGrid } from '$lib/components/genres';
  
  let genres = $state([]);
  let isLoading = $state(true);
  
  $effect(async () => {
    try {
      genres = await getAllGenres();
    } catch (error) {
      console.error('Error loading genres:', error);
    } finally {
      isLoading = false;
    }
  });
</script>

<GenreGrid {genres} {isLoading} size="medium" />
```

### Genre Filtering in Search

```svelte
<script>
  import { GenreFilter } from '$lib/components/search';
  
  let selectedGenres = $state([]);
  
  function handleSearch() {
    // Add selected genres to search params
    const searchParams = new URLSearchParams();
    if (selectedGenres.length > 0) {
      searchParams.set('genres', selectedGenres.join(','));
    }
    // ... other search logic
  }
</script>

<GenreFilter bind:selectedGenres />
<button on:click={handleSearch}>Search</button>
```

## Future Enhancements

1. **Personalization**:
   - Genre recommendations based on listening history
   - User-specific genre preferences
   - "Follow" functionality for genres

2. **Advanced Discovery**:
   - Genre mood maps for exploration
   - Genre relationship visualization
   - Temporal trends in genre popularity

3. **Content Improvements**:
   - Genre-specific playlists
   - Genre radio functionality
   - Genre-based music recommendations

4. **UI Enhancements**:
   - Genre color themes throughout the UI
   - Improved genre imagery and visualization
   - Genre tag clouds and related keyword exploration

## Dependencies

- `@prettygood/database` - For database access via PostgREST
- SvelteKit - For routing and page structure
- shadcn/ui components - For UI elements
- Svelte 5 runes - For reactive state management

## Related Documentation

- [Database Implementation](/documentation/Database-Implementation.md)
- [TODO List](/documentation/TODO.md)
- [Main Service Implementation](/app/src/lib/services/genres/README.md)
