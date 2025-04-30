import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { artistData } from './data';

type ExpectedOut = (typeof artistData)['stats']['day'];

export const load: PageLoad = async ({ parent, data }) => {
	const { artist, supabase } = await parent();
	const { data: artistData, error: err } = await supabase
		.from('artists')
		.select('id, payments(*), tipCount:payments(count), artist_play_counts(*), followerCount:artist_followers(count)')
		.eq('id', artist.id)
		.single();
	
	console.dir(artistData);

	if (err) {
		console.log('artist error', err);
		throw error(500, 'Failed to load artist data');
	}

	return { artistData };
};
