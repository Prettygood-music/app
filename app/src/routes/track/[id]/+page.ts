import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
	const { data: trackDB } = await databaseClient
		.from('tracks')
		.select('*, artist: artists(*), album: albums(*, tracks(*))')
		.eq('id', params.id)
		.single();

	if (!trackDB) {
		error(404, 'Track not found');
	}
	return {
		track: trackDB
	};
};
