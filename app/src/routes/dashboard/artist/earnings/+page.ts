import { DEPENDS } from '$lib/constants';
import type { PageLoad } from './$types';

export const load = (async ({ parent, data, depends }) => {
	depends(DEPENDS.WALLET);
	const { artist, user, supabase } = await parent();

	const { data: walletData, error: walletError } = await supabase
		.from('users')
		.select('wallet_address')
		.eq("id", user.id)
		.maybeSingle();
	if (walletError) {
		console.error(walletError);
	}
	console.dir(walletData);
	const wallet_address = walletData?.wallet_address;

	const { data: payments, error: err } = await supabase
		.from('payments')
		.select('*')
		.eq('recipient_id', artist.id);
	if (err) {
		console.error(err);
	}

	return {
		...data,
		payments,
		artist,
		user: { ...user!, wallet_address }
	};
}) satisfies PageLoad;
