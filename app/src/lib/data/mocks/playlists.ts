import type { Playlist } from '$lib/types';
import { v4 as uuidv4 } from 'uuid';
import { mockTracks } from './tracks';

export const mockPlaylists: Playlist[] = [
	{
		id: uuidv4(),
		title: 'Electronic Essentials',
		creator_id: 'f6a7b8c9-d0e1-2345-6789-ef0123456789',
		creator_name: 'Music Lover',
		cover_url: 'https://example.com/images/electronic-essentials.jpg',
		description: 'The best electronic tracks from various artists',
		is_public: true,
		track_count: 4,
		tracks: [
			mockTracks[0], // Digital Dawn
			mockTracks[1], // Neon Nights
			mockTracks[8], // Deep Foundations
			mockTracks[9] // Structural Bass
		],
		created_at: '2023-10-15T08:30:45Z',
		updated_at: '2023-12-12T14:25:30Z'
	},
	{
		id: uuidv4(),
		title: 'Chill Vibes',
		creator_id: 'a7b8c9d0-e1f2-3456-789a-bc0123456789',
		creator_name: 'Beat Enthusiast',
		cover_url: 'https://example.com/images/chill-vibes.jpg',
		description: 'Perfect playlist for relaxation and focus',
		is_public: true,
		track_count: 3,
		tracks: [
			mockTracks[2], // Retro Recall
			mockTracks[3], // Analog Dreams
			mockTracks[6] // Emotional Voyage
		],
		created_at: '2023-11-05T16:42:18Z',
		updated_at: '2023-12-10T09:15:22Z'
	},
	{
		id: uuidv4(),
		title: 'Experimental Sounds',
		creator_id: 'f6a7b8c9-d0e1-2345-6789-ef0123456789',
		creator_name: 'Music Lover',
		cover_url: 'https://example.com/images/experimental-sounds.jpg',
		description: 'Pushing the boundaries of music',
		is_public: false,
		track_count: 2,
		tracks: [
			mockTracks[4], // Sonic Exploration IV
			mockTracks[5] // Dissonant Harmony
		],
		created_at: '2023-09-28T12:15:33Z',
		updated_at: '2023-10-20T18:05:42Z'
	}
];
