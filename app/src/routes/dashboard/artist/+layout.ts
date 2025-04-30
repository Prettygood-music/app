import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, parent }) => {
	// Return artist data for use in all dashboard pages
	const { supabase, user } = await parent();

	const { data: artist, error: artist_error } = await supabase
		.from('artists')
		.select('*, artist_followers(*), play_count: artist_play_counts!artist_id(*)', {})
		.eq('id', user!.id)
		.single();

	if (!artist) {
		error(404, "Couldn't find artist");
	}
	return {
		artist: artist
	};
};
