# Track Detail Template

This template follows the Atomic Design methodology and serves as the layout for the track detail page. It provides a comprehensive view of a track, including its metadata, artist information, album details (if applicable), and recommended tracks.

## Features

- Track artwork and metadata display
- Playback controls (play/pause)
- Action buttons (like, share, more options)
- Track information (duration, release date, play count)
- Genre tags
- Album information (when a track belongs to an album)
- Artist information with link to artist profile
- Recommended tracks section
- Responsive design for various screen sizes

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `track` | `object` | Track data including title, cover, artist, album, etc. | *See default in component* |
| `recommendedTracks` | `array` | Array of recommended track objects | `[]` |
| `initialIsPlaying` | `boolean` | Whether the track is initially playing | `false` |
| `initialIsLiked` | `boolean` | Whether the track is initially liked | `false` |
| `onTogglePlay` | `function` | Handler for play/pause button | `() => {}` |
| `onToggleLike` | `function` | Handler for like button | `() => {}` |
| `onShare` | `function` | Handler for share button | `() => {}` |
| `onMoreOptions` | `function` | Handler for more options button | `() => {}` |

## Data Structures

### Track Object Structure

```typescript
interface Track {
  id: string;
  title: string;
  cover_url?: string;
  duration: number; // in seconds
  release_date: string; // ISO format date string
  play_count?: number;
  genre?: string[];
  artist: {
    id: string;
    artist_name: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
  };
  album?: {
    id: string;
    title: string;
    cover_url?: string;
    release_date: string;
    tracks?: any[];
  };
}
```

## Usage

```svelte
<script>
  import TrackDetailTemplate from '$lib/components/app/templates/TrackDetailTemplate/TrackDetailTemplate.svelte';
  
  // Data from API or load function
  let { data } = $props();
  
  // State management
  let isPlaying = $state(false);
  let isLiked = $state(false);
  
  // Event handlers
  function handleTogglePlay(playing, track) {
    console.log(`${playing ? 'Playing' : 'Paused'} track: ${track.title}`);
    // Trigger playback in audio service
  }
  
  function handleToggleLike(liked, track) {
    console.log(`${liked ? 'Liked' : 'Unliked'} track: ${track.title}`);
    // Update like status in database
  }
  
  function handleShare(track) {
    console.log(`Sharing track: ${track.title}`);
    // Open share dialog
  }
  
  function handleMoreOptions(track) {
    console.log(`More options for track: ${track.title}`);
    // Open options menu
  }
</script>

<svelte:head>
  <title>{data.track.title} by {data.track.artist.artist_name} | prettygood.music</title>
  <meta
    name="description"
    content="Listen to {data.track.title} by {data.track.artist.artist_name} on prettygood.music"
  />
</svelte:head>

<TrackDetailTemplate 
  track={data.track}
  recommendedTracks={data.recommendedTracks}
  initialIsPlaying={isPlaying}
  initialIsLiked={isLiked}
  onTogglePlay={handleTogglePlay}
  onToggleLike={handleToggleLike}
  onShare={handleShare}
  onMoreOptions={handleMoreOptions}
/>
```

## Implementation Notes

- Uses Svelte 5 runes for state management of playing and liked states
- Formats track duration and release date for display
- Responsive design with layout adjustments for different screen sizes
- Conditionally renders sections based on available data (album, genres, etc.)
- Uses shadcn/ui components for consistent styling
- Shows only information that is available, hiding sections when data is missing
- Includes transition effects for cover artwork using view transitions API
