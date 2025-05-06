import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	// NOTE: we'd want to have the actual top albums and tracks here
	const { artist, supabase } = await parent();

	const { data: trackDetails } = await supabase
		.from('tracks_with_details')
		.select('*')
		.eq('artist_id', artist.id);
	return {
		artist,
		tracks: trackDetails || []
	};
};
