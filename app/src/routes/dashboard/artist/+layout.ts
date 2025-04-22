import { redirect } from '@sveltejs/kit';

export const load = async ({ data }) => {
	// Return artist data for use in all dashboard pages

	return {
		artist: data.artist
	};
};
