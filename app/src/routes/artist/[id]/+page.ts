import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	// NOTE: we'd want to have the actual top albums and tracks here
	const { data: artist } = await databaseClient
		.from('artists')
		.select('*, tracks(*), albums(*)')
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.single();

	if (!artist) {
		error(404, 'Artist not found');
	}
	return {
		artist,
		similarArtists: []
	};
};
