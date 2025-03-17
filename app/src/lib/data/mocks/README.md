# Mock Data

This directory contains mock data used for local development and testing of the prettygood.music platform.

## Overview

The mock data in this directory simulates the data that would typically come from our PostgreSQL database. Using these mocks allows frontend and backend development to proceed without requiring a complete database setup.

## Files

- `mockData.ts` - Main collection of mock objects (artists, tracks, albums)
- `mockUsers.ts` - User accounts and authentication data
- `mockPlaylists.ts` - User-created playlists and collections
- `mockPayments.ts` - Transaction and tipping history

## Usage

### In Development

The mock data is automatically used in development mode. The repository layer will detect the development environment and use these mocks instead of making actual database queries.

### In Testing

The mock data can be imported directly in test files:

```typescript
import { mockArtists } from '../data/mocks/mockData';

describe('Artist API', () => {
	test('should return artist details', async () => {
		// Use mock data for test
		const artistId = mockArtists[0].id;
		// ...
	});
});
```

## Adding New Mock Data

When adding new mock data, follow these guidelines:

1. **Consistency**: Ensure relationships between objects are maintained (e.g., tracks should reference valid artist IDs)
2. **IDs**: Use UUIDs for all IDs to match production format
3. **Timestamps**: Use ISO format for all dates and times
4. **Realistic Data**: Try to use realistic values that represent actual use cases

Example for adding a new mock artist:

```typescript
// Add to mockData.ts
mockArtists.push({
	id: 'f6a7b8c9-d0e1-2345-6789-abcdef123456',
	artistName: 'New Artist Name',
	bio: 'Bio description goes here...',
	profileImage: 'https://example.com/images/new-artist.jpg',
	walletAddress: '0x9876543210abcdef9876543210abcdef98765432',
	createdAt: '2023-12-15T11:22:33Z'
});
```

## Extending Mock Data

To extend the mock data system:

1. Create a new file for your data category (e.g., `mockGenres.ts`)
2. Export your mock objects
3. Import and use them in the appropriate repository

## Limitations

The mock data system has some inherent limitations:

- No persistence between server restarts
- Limited dataset size
- Simplified relationships compared to a real database
- No support for complex queries or aggregations

These limitations are acceptable for development but should be considered when testing complex features.

## Transition to Production

When transitioning to a real database:

1. The repository layer will be updated to use real database connections
2. The API interface will remain the same
3. Mock data may be used to seed the initial database

This ensures a smooth transition from development to production environments.
