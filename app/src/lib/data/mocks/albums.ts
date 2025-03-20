import type { Album } from '$lib/types';
import {
	bassArchitectureId,
	digitalHorizonsId,
	emotionalJourneysId,
	experimentalSoundscapesId,
	nostalgicFrequenciesId
} from './common';
import { mockTracks } from './tracks';

const digitalHorizonsTracks = mockTracks.filter((track) => track.album_id === digitalHorizonsId);
const nostalgicFrequenciesTracks = mockTracks.filter(
	(track) => track.album_id === nostalgicFrequenciesId
);
const experimentalSoundscapesTracks = mockTracks.filter(
	(track) => track.album_id === experimentalSoundscapesId
);
const emotionalJourneysTracks = mockTracks.filter(
	(track) => track.album_id === emotionalJourneysId
);
const bassArchitectureTracks = mockTracks.filter((track) => track.album_id === bassArchitectureId);

// Mock albums
export const mockAlbums: Album[] = [
	{
		id: digitalHorizonsId,
		title: 'Digital Horizons',
		artist_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		artist_name: 'Electric Symphony',
		cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
		release_date: '2023-10-05T00:00:00Z',
		track_count: digitalHorizonsTracks.length,
		tracks: digitalHorizonsTracks
	},
	{
		id: nostalgicFrequenciesId,
		title: 'Nostalgic Frequencies',
		artist_id: 'b2c3d4e5-f6a7-8901-bcde-fa1234567890',
		artist_name: 'Vintage Echoes',
		cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
		release_date: '2023-11-03T00:00:00Z',
		track_count: nostalgicFrequenciesTracks.length,
		tracks: nostalgicFrequenciesTracks
	},
	{
		id: experimentalSoundscapesId,
		title: 'Experimental Soundscapes',
		artist_id: 'c3d4e5f6-a7b8-9012-cdef-ab1234567890',
		artist_name: 'Sonic Wanderer',
		cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
		release_date: '2023-09-22T00:00:00Z',
		track_count: experimentalSoundscapesTracks.length,
		tracks: experimentalSoundscapesTracks
	},
	{
		id: emotionalJourneysId,
		title: 'Emotional Journeys',
		artist_id: 'd4e5f6a7-b8c9-0123-defa-bc1234567890',
		artist_name: 'Melodic Journey',
		cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
		release_date: '2023-12-01T00:00:00Z',
		track_count: emotionalJourneysTracks.length,
		tracks: emotionalJourneysTracks
	},
	{
		id: bassArchitectureId,
		title: 'Bass Architecture',
		artist_id: 'e5f6a7b8-c9d0-1234-efab-cd1234567890',
		artist_name: 'Bass Architect',
		cover_url: 'https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80',
		release_date: '2023-08-15T00:00:00Z',
		track_count: bassArchitectureTracks.length,
		tracks: bassArchitectureTracks
	}
];
