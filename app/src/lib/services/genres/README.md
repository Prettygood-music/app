# Genres Feature Implementation

## Overview

The Genres feature enhances content discovery by allowing users to browse music by genre categories. This implementation connects the UI to real data sources using the @prettygood/database package, replacing mock data with actual database queries. The feature includes genre listing, genre detail pages, and integration with the search functionality.

## Features and Implementation Status

### 1. Genre Browsing Pages

The main routes for genre-based navigation.

| Feature | Status | Notes |
|---------|--------|-------|
| Genre listing page | 🟡 In Progress | Main `/genres` route showing all available genres |
| Genre detail page | 🟡 In Progress | `/genres/[id]` route for individual genre content |
| Genre cards | 🟡 In Progress | Visual representations of genres with images |
| Genre popularity metrics | 🟡 Planned | Display track/artist counts per genre |
| Genre filtering | 🟡 Planned | Filter genre list by popularity, alphabetical, etc. |
| Responsive design | 🟡 In Progress | Mobile-friendly layouts for all genre pages |

### 2. Genre-based Search Integration

Adding genre filters to the search functionality.

| Feature | Status | Notes |
|---------|--------|-------|
| Genre filter UI components | 🟡 In Progress | Add genre selection to search interface |
| Genre search parameter handling | 🟡 In Progress | Update search API calls with genre filters |
| Multi-genre selection | 🟡 Planned | Allow filtering by multiple genres simultaneously |
| Genre-specific result grouping | 🟡 Planned | Organize search results by genre |
| Genre filter persistence | 🟡 Planned | Maintain selected genres between searches |
| URL parameter integration | 🟡 In Progress | Support genre filters via URL parameters |

### 3. Content Discovery Integration

Connecting genres to recommendation and browsing features.

| Feature | Status | Notes |
|---------|--------|-------|
| Genre-based recommendations | 🟡 Planned | Recommendations filtered by genre |
| Featured genres section | 🟡 Planned | Highlight trending or seasonal genres |
| Genre-based playlists | 🟡 Planned | Auto-generated and editorial playlists by genre |
| New releases by genre | 🟡 Planned | Filter new releases to specific genres |
| Personalized genre suggestions | 🟡 Planned | Based on user listening history |
| Genre exploration page | 🟡 Planned | Interactive genre discovery interface |

### 4. Data Services

Backend services for genre data management.

| Feature | Status | Notes |
|---------|--------|-------|
| Genre listing service | 🟡 In Progress | Fetch all available genres |
| Genre detail service | 🟡 In Progress | Get detailed info for specific genre |
| Genre content service | 🟡 In Progress | Get tracks/albums/artists by genre |
| Genre search integration | 🟡 In Progress | Add genre filtering to search API |
| Genre statistics service | 🟡 Planned | Calculate and cache genre popularity metrics |
| Genre relationship service | 🟡 Planned | Identify related/similar genres |

## Technical Architecture

### Data Structure

The genres feature relies on the following database tables:

- `genres` - Core genre information (id, name, description, image_url)
- `track_genres` - Junction table linking tracks to genres (many-to-many)
- `artist_genres` - Junction table linking artists to genres (many-to-many)
- `album_genres` - Junction table linking albums to genres (many-to-many)

### API Integration

Data is fetched using the `@prettygood/database` package which provides a client for PostgREST:

```typescript
import { createClient } from '@prettygood/database';

// Create client instance
const db = getClient();

// Fetch all genres
const getAllGenres = async () => {
  try {
    const { data, error } = await db
      .from('genres')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Get genre details with associated content
const getGenreDetails = async (genreId: string) => {
  try {
    // Get genre information
    const { data: genre, error: genreError } = await db
      .from('genres')
      .select('*')
      .eq('id', genreId)
      .single();
      
    if (genreError) throw genreError;
    
    // Get tracks in this genre
    const { data: tracks, error: tracksError } = await db
      .from('track_genres')
      .select(`
        tracks (
          id,
          title,
          artist_id,
          album_id,
          duration,
          cover_url,
          release_date,
          artists (name),
          albums (title)
        )
      `)
      .eq('genre_id', genreId)
      .limit(50);
      
    if (tracksError) throw tracksError;
    
    // Get artists in this genre
    const { data: artists, error: artistsError } = await db
      .from('artist_genres')
      .select(`
        artists (
          id,
          name,
          profile_image_url,
          verified
        )
      `)
      .eq('genre_id', genreId)
      .limit(20);
      
    if (artistsError) throw artistsError;
    
    return {
      genre,
      tracks: tracks?.map(t => t.tracks) || [],
      artists: artists?.map(a => a.artists) || []
    };
  } catch (error) {
    console.error('Error fetching genre details:', error);
    throw error;
  }
};
```

### Component Structure

The feature follows the Atomic Design methodology with components organized as:

1. **Atoms** - Basic UI elements (genre tag, genre icon)
2. **Molecules** - Simple component combinations (genre card, genre filter selector)
3. **Organisms** - Complex UI sections (genre grid, genre detail header)
4. **Templates** - Page layouts (genre listing, genre detail)
5. **Pages** - Complete views (genres index, genre detail)

### Routes Structure

```
/genres
  ├── +page.svelte       # Main genres listing page
  ├── +page.ts           # Data loading for genres page
  └── [id]/              # Genre detail routes
      ├── +page.svelte   # Genre detail page
      └── +page.ts       # Data loading for genre detail
```

### State Management

The implementation uses Svelte 5's runes for reactive state management:

```typescript
// Genres state
let genres = $state([]);
let isLoading = $state(true);
let error = $state(null);

// For genre detail page
let genreDetail = $state(null);
let genreTracks = $state([]);
let genreArtists = $state([]);

// Effects for data fetching
$effect(async () => {
  try {
    isLoading = true;
    genres = await genresService.getAllGenres();
  } catch (err) {
    error = err;
  } finally {
    isLoading = false;
  }
});
```

## Implementation Plan

### Phase 1: Core Services (1 day)

1. Create genre service module with basic functions:
   - `getAllGenres()` - Fetch all available genres
   - `getGenreById(id)` - Get a specific genre by ID
   - `getTracksByGenre(id)` - Get tracks for a specific genre
   - `getArtistsByGenre(id)` - Get artists for a specific genre
   - `getAlbumsByGenre(id)` - Get albums for a specific genre

2. Implement types and interfaces:
   - `Genre` - Core genre data structure
   - `GenreWithContent` - Genre with related content

### Phase 2: Routes and UI Components (2 days)

1. Implement genre listing page (`/genres`):
   - Genre grid/list display
   - Loading states and error handling
   - Filtering and sorting options

2. Implement genre detail page (`/genres/[id]`):
   - Genre header with image and description
   - Tabs for different content types (tracks, artists, albums)
   - Track listing with play functionality
   - Artist grid with links to artist pages
   - Album grid with links to album pages

3. Create reusable components:
   - `GenreCard` - Card representation of a genre
   - `GenreTag` - Inline tag for genre representation
   - `GenreSelector` - Dropdown or chip-based genre selector

### Phase 3: Search Integration (1 day)

1. Update search functionality:
   - Add genre filter UI to search page
   - Modify search API calls to include genre parameters
   - Update URL handling for genre parameters
   - Add genre filter persistence

2. Implement multi-genre selection:
   - UI for selecting multiple genres
   - Logic for combining genre filters
   - Clear/reset functionality

### Phase 4: Browse & Discovery Integration (1 day)

1. Enhance Home and Explore pages:
   - Add genre-based sections to home page
   - Create featured genres carousel
   - Implement genre-based new releases section

2. Add recommendation filtering:
   - Update recommendation API to filter by genre
   - Add genre preferences to user settings

## Testing Strategy

1. **Unit Tests**:
   - Test genre service functions
   - Validate data transformation logic
   - Test URL parameter handling

2. **Component Tests**:
   - Verify genre card rendering
   - Test genre selector functionality
   - Validate genre filter behavior

3. **Integration Tests**:
   - End-to-end tests for genre browsing flow
   - Verify genre-based search functionality
   - Test navigation between genre-related pages

4. **Performance Tests**:
   - Measure loading times with large genre datasets
   - Optimize genre image loading

## Dependencies

- **Database access**: @prettygood/database package
- **UI components**: shadcn/ui component library
- **State management**: Svelte 5 runes
- **Routing**: SvelteKit
- **Image optimization**: Appropriate image loading/lazy loading strategy

## Security Considerations

- Ensure proper Row-Level Security (RLS) policies for genre-related tables
- Validate and sanitize genre IDs from URL parameters
- Handle missing or deleted genres gracefully

## Status Legend

| Symbol | Status |
|--------|--------|
| 🟢 | Completed |
| 🟡 | Planned/In Progress |
| 🟠 | Blocked |
| 🔴 | Has Issues |

## Next Steps

1. Create the genre service module
2. Implement the genre listing page
3. Develop the genre detail page
4. Integrate with search functionality
5. Add genre-based content to home and discovery pages

## Related Documentation

- [Database Implementation](/documentation/Database-Implementation.md)
- [TODO List](/documentation/TODO.md)

---

**Note**: This documentation will be updated as the implementation progresses.
