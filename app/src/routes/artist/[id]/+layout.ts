import type { LayoutLoad } from './$types';
import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { data: artist } = await databaseClient
		.from('artists')
		.select('*, tracks(*), albums(*, tracks(*))')
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.single();

	if (!artist) {
		error(404, 'Artist not found');
	}

	return { artist, similarArtists: [] };
}) satisfies LayoutLoad;
