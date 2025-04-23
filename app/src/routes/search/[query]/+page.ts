import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const query = params?.query || '';
	const { supabase } = await parent();

	if (!query) {
		throw error(400, 'Search query is required');
	}

	try {
		// Search for tracks
		const { data: tracks, error: tracksError } = await supabase
			.from('tracks')
			.select('*, artist:artists(id, artist_name)')
			.or(`title.ilike.%${query}%, genre.cs.{${query}}`)
			.order('created_at', { ascending: false })
			.limit(10);

		if (tracksError) {
			console.error('Error fetching tracks:', tracksError);
		}

		// Search for artists
		const { data: artists, error: artistsError } = await supabase
			.from('artists')
			.select('*')
			.or(`artist_name.ilike.%${query}%, genre.cs.{${query}}`)
			.order('created_at', { ascending: false })
			.limit(10);

		if (artistsError) {
			console.error('Error fetching artists:', artistsError);
		}

		// Search for albums
		const { data: albums, error: albumsError } = await supabase
			.from('albums')
			.select('*, artist:artists(id, artist_name)')
			.or(`title.ilike.%${query}%, genre.cs.{${query}}`)
			.order('created_at', { ascending: false })
			.limit(10);

		if (albumsError) {
			console.error('Error fetching albums:', albumsError);
		}

		return {
			query,
			results: {
				tracks: tracks || [],
				artists: artists || [],
				albums: albums || []
			}
		};
	} catch (e) {
		console.error('Search error:', e);
		throw error(500, 'Failed to search, please try again later');
	}
};
