import type { PageLoad } from '../../../../dashboard/artist/earnings/$types';

export const load = (async ({ parent }) => {
	const { artist, user, supabase } = await parent();
	const { data: payments, error: err } = await supabase
		.from('payments')
		.select('*')
		.eq('recipient_id', artist.id);
	if (err) {
		console.error(err);
	}

	return {
		payments,
		artist,
		user: user!
	};
}) satisfies PageLoad;
