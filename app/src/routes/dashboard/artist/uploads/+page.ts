import { databaseClient } from '$lib/databaseClient';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ data, parent }) => {
	const { artist } = await parent();
	const { data: tracksData, error: tracksError } = await databaseClient
		.from('tracks')
		.select('*')
		.eq('artist_id', artist.id);

	if (tracksError) {
		console.error(tracksError);
		error(500, tracksError);
	}
	const { data: tracksPlayCount, error: tracksPlayCountError } = await databaseClient
		.from('track_play_counts')
		.select('*')
		.in(
			'track_id',
			tracksData.map((t) => t.id)
		);

	if (tracksPlayCountError) {
		console.error(tracksPlayCountError);
		error(500, tracksPlayCountError);
	}

	console.dir(tracksData);

	console.dir(tracksPlayCount);

	const tracks = tracksData.map((t) => {
		return {
			...t,
			plays: 0,
            status: "published"
		};
	});
	return { tracks };
}) satisfies PageLoad;
