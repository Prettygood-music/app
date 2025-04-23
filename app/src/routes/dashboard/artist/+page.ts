import type { PageLoad } from './$types';
import { artistData } from './data';

type ExpectedOut = (typeof artistData)['stats']['day'];

export const load: PageLoad = async ({ parent, data }) => {
	const { artist, supabase } = await parent();
	const { data: artistData, error: err } = await supabase
		.from('artists')
		.select('id, payments(*), artist_play_counts(*), artist_followers(*)')
		.eq('id', artist.id)
		.single();

	if (err) {
		console.log('artist error', err);
	}

	return { artistData };
};
