# Artist Dashboard

## Overview

The Artist Dashboard is a central hub for artists to manage their content, track performance metrics, monitor earnings, and handle blockchain integrations on the prettygood.music platform. This area of the application is restricted to users with artist accounts.

## Features and Implementation Status

### 1. Overview Dashboard

The main landing page providing a snapshot of key metrics and recent activity.

| Feature | Status | Notes |
|---------|--------|-------|
| Summary statistics cards | 🟢 Completed | Display total streams, followers, earnings |
| Performance trends | 🟢 Completed | Week-over-week and month-over-month growth metrics |
| Recent activity feed | 🟢 Completed | Show latest plays, new followers, recent tips |
| Quick action buttons | 🟢 Completed | Upload, edit profile, create announcements |
| Alert notifications | 🟡 Planned | System alerts, verification status |

### 2. Stats & Analytics (`/stats`)

Detailed performance metrics and audience insights.

| Feature | Status | Notes |
|---------|--------|-------|
| Playback metrics | 🟢 Completed | Plays over time (daily, weekly, monthly views) |
| Top tracks performance | 🟢 Completed | Identify best-performing content |
| Geographic distribution | 🟢 Completed | Map visualization of listener locations |
| Traffic sources | 🟢 Completed | Where listeners find the artist's music |
| Audience growth metrics | 🟢 Completed | Follower growth over time |
| Engagement analytics | 🟢 Completed | Likes, saves, playlist adds |
| Performance comparison | 🟢 Completed | Compare tracks/albums against each other |
| Custom date range selector | 🟢 Completed | Allow filtering data by specific periods |
| Data export | 🟡 Planned | CSV/PDF export of analytics |

### 3. Earnings & Payments (`/earnings`)

Financial tracking and payment management.

| Feature | Status | Notes |
|---------|--------|-------|
| Revenue overview | 🟢 Completed | Total earnings to date |
| Earnings breakdown | 🟢 Completed | By track/album, over time |
| Transaction history | 🟢 Completed | Detailed list of all payments received |
| Payment source analysis | 🟢 Completed | Tips vs. other revenue sources |
| Pending payments | 🟡 Planned | Transactions in process |
| Tipping analytics | 🟢 Completed | Top tippers, average amounts |
| Revenue charts | 🟢 Completed | Visual representation of earnings |
| Payout settings | 🟡 Planned | Configure payment preferences |
| Tax information | 🟡 Planned | Export earnings data for tax purposes |

### 4. Content Management (`/uploads`)

Managing music catalog and uploads.

| Feature | Status | Notes |
|---------|--------|-------|
| Track/album list | 🟢 Completed | Full catalog view with performance metrics |
| Upload interface | 🟢 Completed | Add new tracks and albums |
| Batch upload | 🟢 Completed | Upload multiple tracks at once |
| Metadata editor | 🟡 Planned | Edit titles, descriptions, genres, etc. |
| Cover art management | 🟡 Planned | Upload and crop artwork |
| Audio preview | 🟡 Planned | Listen to tracks before publishing |
| Draft status | 🟢 Completed | Save uploads as drafts before publishing |
| Release scheduling | 🟡 Planned | Set future release dates |
| Collaboration tools | 🟡 Planned | Tag featured artists and collaborators |

### 5. Profile Management (Integrated with `/settings`)

Artist profile customization.

| Feature | Status | Notes |
|---------|--------|-------|
| Profile editor | 🟡 Planned | Edit artist name, bio, location |
| Social links manager | 🟡 Planned | Connect external profiles and websites |
| Profile image uploader | 🟡 Planned | Upload and crop artist photo |
| Genre tags | 🟡 Planned | Select relevant genres |
| Verification status | 🟡 Planned | Request and track verification |
| Public profile preview | 🟡 Planned | See how profile appears to users |
| Featured content selection | 🟡 Planned | Choose tracks to highlight |
| Banner image customization | 🟡 Planned | Customize profile header image |

### 6. Wallet Integration (`/token`)

Blockchain and wallet functionality.

| Feature | Status | Notes |
|---------|--------|-------|
| Wallet connection | 🟢 Completed | Connect/disconnect Sui wallet |
| Balance display | 🟢 Completed | View current wallet balance |
| Transaction history | 🟢 Completed | Blockchain transaction record |
| Payment settings | 🟡 Planned | Set minimum tip amounts |
| Split configurations | 🟡 Planned | Configure revenue sharing for collaborations |
| Gas fee management | 🟡 Planned | Handle transaction fees |
| Multi-wallet support | 🟡 Planned | Connect multiple wallets if needed |
| Transaction notifications | 🟡 Planned | Alerts for new payments |

### 7. NFT Management (`/nfts`) - Post-MVP Feature

Placeholder for future NFT features (not part of MVP).

| Feature | Status | Notes |
|---------|--------|-------|
| "Coming Soon" placeholder | 🟢 Completed | Simple placeholder page with future feature teaser |
| Feature announcement signup | 🟢 Completed | Optional email capture for NFT feature interest |

## Technical Architecture

### Data Management

The Artist Dashboard pulls data from several tables in the PostgreSQL database:

- `artists` - Core artist profile information
- `tracks` - Music catalog
- `albums` - Album collections
- `play_history` - Track play/streaming data
- `artist_followers` - Follower tracking
- `payments` - Financial transactions
- `user_library_tracks` - Saved tracks (engagement)
- `track_likes` - Track likes (engagement)

### API Integration

Data is fetched using the `@prettygood/database` package which provides a client for PostgREST:

```typescript
import { createClient } from '@prettygood/database';

// Create client instance
const db = createClient(import.meta.env.VITE_POSTGREST_URL);

// Fetch artist data
const getArtistData = async (artistId: string) => {
  const { data, error } = await db
    .from('artists')
    .select('*')
    .eq('id', artistId)
    .single();
    
  if (error) throw error;
  return data;
};

// Get play counts
const getPlayCounts = async (artistId: string) => {
  const { data, error } = await db.rpc('get_artist_play_count', {
    artist_id: artistId
  });
  
  if (error) throw error;
  return data;
};
```

### Component Structure

The dashboard follows the Atomic Design methodology with components organized as:

1. **Atoms** - Basic UI elements (buttons, inputs, labels)
2. **Molecules** - Simple component combinations (stat cards, form groups)
3. **Organisms** - Complex UI sections (analytics charts, data tables)
4. **Templates** - Page layouts
5. **Pages** - Complete dashboard views

### State Management

The dashboard uses Svelte 5's runes for reactive state management:

```typescript
// Artist state
let artistData = $state(null);
let isLoading = $state(true);
let error = $state(null);

// Derived values
let totalPlays = $derived(
  artistData?.tracks?.reduce((sum, track) => sum + (track.play_count || 0), 0) || 0
);

// Effects for data fetching
$effect(async () => {
  try {
    isLoading = true;
    artistData = await getArtistData(currentArtistId);
  } catch (err) {
    error = err;
  } finally {
    isLoading = false;
  }
});
```

### Authentication & Authorization

Access to the artist dashboard is restricted to authenticated users with artist accounts:

- JWT token validation occurs via SvelteKit hooks
- Row-Level Security (RLS) in PostgreSQL ensures data privacy
- Route protection prevents unauthorized access

## Development Workflow

### Getting Started

1. Ensure the database is running with proper seed data
2. Navigate to the artist-dashboard directory
3. Implement or modify component files
4. Test with an artist account login

### Status Legend

| Symbol | Status |
|--------|--------|
| 🟢 | Completed |
| 🟡 | Planned/In Progress |
| 🟠 | Blocked |
| 🔴 | Has Issues |

### Testing Notes

- Test with different artist accounts to ensure proper data isolation
- Verify mobile responsiveness of all dashboard components
- Check loading states and error handling 
- Test with various data volumes (new artists vs. established)

### Performance Considerations

- Implement pagination for large data sets
- Use skeleton loaders during data fetching
- Consider caching strategies for frequently accessed data
- Optimize chart rendering for performance

## Dependencies

- **Data visualization**: Chart libraries compatible with Svelte (such as D3.js with Svelte wrappers or svelte-chartjs)
- **UI components**: shadcn/ui component library with Svelte adaptations
- **Database access**: @prettygood/database package
- **Blockchain integration**: @mysten/sui for wallet connectivity
- **Form handling**: sveltekit-superforms with zod validation

## Related Documentation

- [Database Implementation](/documentation/Database-Implementation.md)
- [Authentication Implementation Plan](/documentation/Authentication-implementation-plan.md)
- [TODO List](/documentation/TODO.md)

## Next Implementation Steps

See the [detailed implementation plan](./IMPLEMENTATION-PLAN.md) for specific tasks, technical details, and estimated effort.

---

**Note**: This documentation is a living document and will be updated as features are implemented and requirements evolve.
