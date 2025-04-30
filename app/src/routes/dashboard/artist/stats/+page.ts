import type { PageLoad } from './$types';

export const load = (async ({ parent, data }) => {
	const { artist, user, supabase } = await parent();
	const { data: tracks_with_details, error: err } = await supabase
		.from('tracks_with_details')
		.select('*')
		.order('play_count', { ascending: false })
		.eq('artist_id', artist.id)
		.limit(10);
	if (err) {
		console.error(err);
	}

	console.dir(tracks_with_details);

	return {
		tracks_with_details: tracks_with_details || [],
		artist,
		user: user!
	};
}) satisfies PageLoad;
