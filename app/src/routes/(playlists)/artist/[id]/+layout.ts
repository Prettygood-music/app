import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ params, parent }) => {
	const { supabase, user } = await parent();

	const { data: artist, error: artistError } = await supabase
		.from('artists')
		.select(
			'*, tracks(*), albums(*, tracks(*)), payout_address: users!artists_id_fkey(wallet_address)'
		)
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.single();

	if (artistError) {
		console.error(artistError);
	}

	if (!artist) {
		error(404, 'Artist not found');
	}

	let isUserFollowing = false;
	if (user) {
		const { data: follow } = await supabase
			.from('artist_followers')
			.select('*')
			.eq('artist_id', artist.id)
			.eq('user_id', user.id)
			.maybeSingle();

		if (follow) {
			isUserFollowing = true;
		}
	}

	return { artist, similarArtists: [], isUserFollowing };
}) satisfies LayoutLoad;
