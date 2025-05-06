import type { PageLoad } from './$types';

export const load = (async ({ params, parent }) => {
	const { supabase } = await parent();

	// We'd want to order by plays / clicks and so on
	const { data: tracks } = await supabase
		.from('tracks')
		.select('*, artist: artists(*), album: albums(*, tracks(id))')
		.limit(10);

	

	return { tracks: tracks || [] };
}) satisfies PageLoad;
