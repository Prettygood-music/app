import type { Album } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';

// Album IDs for reference
export const digitalHorizonsId = uuidv4();
export const nostalgicFrequenciesId = uuidv4();
export const experimentalSoundscapesId = uuidv4();
export const emotionalJourneysId = uuidv4();
export const bassArchitectureId = uuidv4();

// Mock albums
export const mockAlbums: Album[] = [
	{
		id: uuidv4(),
		title: 'Digital Horizons',
		artist_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		release_date: '2023-10-05',
		cover_url: 'https://example.com/images/digital-horizons.jpg',
		release_date: '2023-10-05T00:00:00Z'
	},
	{
		id: uuidv4(),
		title: 'Nostalgic Frequencies',
		artist_id: 'b2c3d4e5-f6a7-8901-bcde-fa1234567890',
		release_date: '2023-11-03',
		cover_url: 'https://example.com/images/nostalgic-frequencies.jpg',
		release_date: '2023-11-03T00:00:00Z'
	},
	{
		id: uuidv4(),
		title: 'Experimental Soundscapes',
		artist_id: 'c3d4e5f6-a7b8-9012-cdef-ab1234567890',
		release_date: '2023-09-22',
		cover_url: 'https://example.com/images/experimental-soundscapes.jpg',
		release_date: '2023-09-22T00:00:00Z'
	},
	{
		id: uuidv4(),
		title: 'Emotional Journeys',
		artist_id: 'd4e5f6a7-b8c9-0123-defa-bc1234567890',
		release_date: '2023-12-01',
		cover_url: 'https://example.com/images/emotional-journeys.jpg',
		release_date: '2023-12-01T00:00:00Z'
	},
	{
		id: uuidv4(),
		title: 'Bass Architecture',
		artist_id: 'e5f6a7b8-c9d0-1234-efab-cd1234567890',
		release_date: '2023-08-15',
		cover_url: 'https://example.com/images/bass-architecture.jpg',
		release_date: '2023-08-15T00:00:00Z'
	}
];
