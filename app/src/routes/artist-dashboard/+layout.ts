import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, parent, data }) => {
	// Return artist data for use in all dashboard pages
	return {
		artist: data.artist
	};
};
