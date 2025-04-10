# Artist Dashboard Template

This template follows the Atomic Design methodology and serves as the core layout for the artist dashboard page. It combines multiple UI components to create a complete dashboard experience for artists.

## Features

- Overview statistics with time period filters (day, week, month, year)
- Recent activity feed
- Quick actions panel
- Placeholder chart sections

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| `artistName` | `string` | Name of the artist | 'Your Artist Name' |
| `stats` | `object` | Statistical data for different time periods (day, week, month, year) | *See default in component* |
| `recentActivity` | `array` | Array of recent activity items with type, content, and time | *See default in component* |
| `onViewAllActivity` | `function` | Handler for View All Activity button | `() => {}` |
| `onUploadTrack` | `function` | Handler for Upload Track button | `() => {}` |
| `onEditProfile` | `function` | Handler for Edit Profile button | `() => {}` |
| `onCreateAnnouncement` | `function` | Handler for Create Announcement button | `() => {}` |
| `onGetHelp` | `function` | Handler for Get Analytics Help button | `() => {}` |

## Usage

```svelte
<script>
  import ArtistDashboardTemplate from '$lib/components/app/templates/ArtistDashboardTemplate/ArtistDashboardTemplate.svelte';
  
  const artistData = {
    artistName: 'Artist Name',
    stats: {
      day: { /* day stats */ },
      week: { /* week stats */ },
      month: { /* month stats */ },
      year: { /* year stats */ }
    },
    recentActivity: [
      // activity items
    ]
  };
  
  function handleViewAllActivity() {
    // Handle view all activity
  }
  
  // Other handlers
</script>

<ArtistDashboardTemplate 
  artistName={artistData.artistName}
  stats={artistData.stats}
  recentActivity={artistData.recentActivity}
  onViewAllActivity={handleViewAllActivity}
  // Other handlers
/>
```

## Implementation Notes

- The template uses the `$state` and `$derived` runes from Svelte 5 for reactivity
- Tab switching automatically updates the displayed statistics
- Activity feed items display different icons based on the activity type
- All interactive elements are wired up with event handlers
- The template is responsive and adjusts its layout for different screen sizes
