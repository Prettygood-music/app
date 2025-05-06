import { error, redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { LINKS } from '$lib/constants';

export const load: LayoutLoad = async ({ data, parent }) => {
	// Return artist data for use in all dashboard pages
	const { supabase, user } = await parent();

	const { data: artist, error: artist_error } = await supabase
		.from('artists')
		.select('*, artist_followers(*), play_count: artist_play_counts!artist_id(*)', {})
		.eq('id', user!.id)
		.single();

	if (!artist) {
		redirect(307, LINKS.ARTISTS.CREATE)
		//error(404, "Couldn't find artist");
	}
	return {
		artist: artist
	};
};
