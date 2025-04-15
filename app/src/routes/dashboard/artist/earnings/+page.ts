import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { artist, user } = await parent();
	const { data: payments, error: err } = await databaseClient
		.from('payments')
		.select('*')
		.eq('recipient_id', artist.id);
	if (err) {
		console.error(err);
	}

	console.dir(payments);
	return {
		payments,
		artist,
		user: user!
	};
}) satisfies PageLoad;
