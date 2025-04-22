import { databaseClient } from '$lib/databaseClient';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ data, parent }) => {
	const { artist, supabase } = await parent();

	const { data: tracksData, error: tracksError } = await supabase
		.from('tracks')
		.select('*, track_play_counts(*)')
		.eq('artist_id', artist.id);

	console.dir(tracksData);

	if (tracksError) {
		console.error(tracksError);
		error(500, tracksError);
	}

	const { data: albumsData, error: albumsError } = await supabase
		.from('albums')
		.select('*, tracks(count)')
		.eq('artist_id', artist.id);

	/*
	const { data: albumsData, error: albumsError } = await databaseClient
		.from('albums')
		.select('*, tracks(count)')
		.eq('artist_id', artist.id);
*/
	const tracks = tracksData.map((t) => {
		return {
			...t,
			plays: t.track_play_counts[0]?.play_count || 0,
			status: 'published'
		};
	});

	return {
		tracks,
		albums: (albumsData || []).map((a) => {
			return {
				...a,
				plays: 0
			};
		})
	};
}) satisfies PageLoad;
