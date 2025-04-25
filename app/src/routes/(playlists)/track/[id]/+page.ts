import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();
	const { data: trackDB } = await supabase
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
