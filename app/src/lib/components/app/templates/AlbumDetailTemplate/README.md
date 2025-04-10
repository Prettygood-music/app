# Album Detail Template

This template follows the Atomic Design methodology and serves as the layout for the album detail page. It provides a comprehensive view of an album, including its tracks, information about the artist, and related albums.

## Features

- Album artwork and metadata display
- Playback controls (play/pause, shuffle)
- Action buttons (like, share, more options)
- Track listing
- Artist information with link to artist profile
- Related albums from the same artist
- Responsive design for various screen sizes

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `album` | `object` | Album data including title, cover, release date, etc. | *See default in component* |
| `artist` | `object` | Artist data including name, avatar, bio | *See default in component* |
| `tracks` | `array` | Array of track objects for the album | `[]` |
| `relatedAlbums` | `array` | Array of other albums by the same artist | `[]` |
| `initialIsPlaying` | `boolean` | Whether the album is initially playing | `false` |
| `initialIsLiked` | `boolean` | Whether the album is initially liked | `false` |
| `onTogglePlay` | `function` | Handler for play/pause button | `() => {}` |
| `onShufflePlay` | `function` | Handler for shuffle play button | `() => {}` |
| `onToggleLike` | `function` | Handler for like button | `() => {}` |
| `onShare` | `function` | Handler for share button | `() => {}` |
| `onMoreOptions` | `function` | Handler for more options button | `() => {}` |
| `pageTitle` | `string` | Title for the page (optional) | `undefined` |
| `pageDescription` | `string` | Meta description for the page (optional) | `undefined` |

## Data Structures

### Album Object Structure

```typescript
interface Album {
  id: string;
  title: string;
  cover_url?: string;
  release_date: string; // ISO format date string
  genre?: string[];
  tracks?: Track[];
  description?: string;
  label?: string;
}
```

### Artist Object Structure

```typescript
interface Artist {
  id: string;
  artist_name: string;
  avatar_url?: string;
  bio?: string;
}
```

### Track Object Structure

```typescript
interface Track {
  id: string;
  title: string;
  duration: number; // in seconds
  plays?: number;
  artist_name?: string;
  album_title?: string;
  cover_url?: string;
}
```

## Usage

```svelte
<script>
  import AlbumDetailTemplate from '$lib/components/app/templates/AlbumDetailTemplate/AlbumDetailTemplate.svelte';
  
  // Data from API or load function
  let { data } = $props();
  
  // Event handlers
  function handleTogglePlay(isPlaying, album) {
    console.log(`Album ${album.title} is now ${isPlaying ? 'playing' : 'paused'}`);
    // Trigger playback in audio service
  }
  
  function handleToggleLike(isLiked, album) {
    console.log(`Album ${album.title} is now ${isLiked ? 'liked' : 'unliked'}`);
    // Update like status in database
  }
  
  // Other handlers
</script>

<AlbumDetailTemplate 
  album={data.album}
  artist={data.artist}
  tracks={data.tracks}
  relatedAlbums={data.relatedAlbums}
  initialIsPlaying={false}
  initialIsLiked={false}
  onTogglePlay={handleTogglePlay}
  onToggleLike={handleToggleLike}
  pageTitle={`${data.album.title} by ${data.artist.artist_name} | prettygood.music`}
  pageDescription={`Listen to ${data.album.title} by ${data.artist.artist_name} on prettygood.music`}
  /* Other handlers */
/>
```

## Implementation Notes

- Uses Svelte 5 runes for state management of playing and liked states
- Calculates total duration from the tracks array
- Formats dates and durations for display
- Responsive design with layout adjustments for different screen sizes
- Conditionally renders sections based on available data
- Uses shadcn/ui components for consistent styling
- Includes hover effects on interactive elements for better user experience
