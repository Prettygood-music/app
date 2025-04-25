import type { PageLoad } from './$types';

export const load = (async ({ params, parent }) => {
	const { supabase } = await parent();

	// We'd want to order by plays / clicks and so on
	const { data: albums } = await supabase
		.from('albums')
		.select('*, artist: artists(*)')
		.limit(10);
	return { albums: albums || [] };
}) satisfies PageLoad;
