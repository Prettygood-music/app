import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { artistData } from './data';

type ExpectedOut = (typeof artistData)['stats']['day'];

export const load: PageLoad = async ({ parent }) => {
	const { artist } = await parent();
	const { data, err } = await databaseClient
		.from('artists')
		.select('id, payments(*),artist_play_counts(*)')
		.eq('artist.id', artist.id)
		.single();

	const { data: followerCountData, error: followerError } = await databaseClient.rpc(
		'get_artist_followers_count',
		{
			artist_id: artist.id
		}
	);
	if (followerError) {
		console.error(followerError);
	} else {
		console.log('followersCount', followerCountData);
	}

	const { data: totalEarningsData } = await databaseClient.rpc('get_artist_total_earnings', {
		artist_id: artist.id
	});
	console.log('earnings', totalEarningsData);

	const { data: artistPaymentStats } = await databaseClient.rpc('get_artist_payment_stats', {
		artist_id: artist.id
	});
	console.log('payments', artistPaymentStats);

	if (err) {
		console.dir(err);
	}

	console.dir(data);
	return {};
};
