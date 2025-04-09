# Artist Profile Template

This template follows the Atomic Design methodology and serves as the layout for the artist profile page. It provides a comprehensive view of an artist, including their tracks, albums, biography, and other details.

## Features

- Artist header with cover image, avatar, and action buttons
- Tabbed interface with Overview, Albums, and About sections
- Top tracks list
- Albums horizontal scroll in overview, grid in albums tab
- Similar artists section
- Biography, social links, and artist information
- Responsive design for various screen sizes

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `artist` | `object` | Artist data including name, bio, tracks, albums, etc. | *See default in component* |
| `similarArtists` | `array` | Array of artist objects that are similar to the main artist | `[]` |
| `initialIsFollowing` | `boolean` | Whether the user is already following the artist | `false` |
| `initialSelectedTab` | `string` | Initial active tab: 'overview', 'albums', or 'about' | `'overview'` |
| `onToggleFollow` | `function` | Handler for follow/unfollow button | `() => {}` |
| `onTipArtist` | `function` | Handler for tip artist button | `() => {}` |
| `onShare` | `function` | Handler for share button | `() => {}` |
| `onSeeAllTracks` | `function` | Handler for "See All" in tracks section | `() => {}` |
| `onSeeAllAlbums` | `function` | Handler for "See All" in albums section | `() => {}` |
| `onSeeAllSimilarArtists` | `function` | Handler for "See All" in similar artists section | `() => {}` |
| `pageTitle` | `string` | Title for the page (optional) | `undefined` |
| `pageDescription` | `string` | Meta description for the page (optional) | `undefined` |

## Artist Object Structure

```typescript
interface Artist {
  id: string;
  artist_name: string;
  cover_url?: string;
  avatar_url?: string;
  bio?: string;
  tracks: Track[];
  albums: Album[];
  social_links?: {
    website?: string;
    twitter?: string;
    instagram?: string;
  };
  stats?: {
    monthlyListeners?: string;
    totalPlays?: string;
    activeSince?: string;
    origin?: string;
  };
  genres?: string[];
}
```

## Usage

```svelte
<script>
  import ArtistProfileTemplate from '$lib/components/app/templates/ArtistProfileTemplate/ArtistProfileTemplate.svelte';
  
  // Data from API or load function
  let { artist, similarArtists } = $props();
  
  function handleToggleFollow(isFollowing) {
    // Handle follow/unfollow action
    console.log('Follow status changed to:', isFollowing);
  }
  
  function handleTipArtist(artist) {
    // Open tip modal or flow
    console.log('Tip artist:', artist.id);
  }
  
  // Other handlers
</script>

<ArtistProfileTemplate 
  {artist}
  {similarArtists}
  initialIsFollowing={false}
  initialSelectedTab="overview"
  onToggleFollow={handleToggleFollow}
  onTipArtist={handleTipArtist}
  pageTitle={`${artist.artist_name} | prettygood.music`}
  pageDescription={artist.bio?.substring(0, 160)}
  /* Other handlers */
/>
```

## Implementation Notes

- Uses Svelte 5 runes for state management
- Responsive design with mobile-first approach
- Conditionally renders sections based on available data
- Social links open in new tabs with proper security attributes
- Header section has gradient overlay for better text visibility
- Similar artists use horizontally scrollable container
