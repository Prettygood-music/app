import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ params, parent }) => {
	const { supabase } = await parent();

	const { data: artist } = await supabase
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
