import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();

	const { data: album, error: albumError } = await supabase
		.from('albums')
		.select(
			'*, tracks(*), artist: artists(*, payout:users!artists_id_fkey(wallet_address), artist_name, albums(*, tracks(id)))'
		)
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.neq('artist.albums.id', params.id)
		.single();

	if (albumError) {
		console.error(albumError);
		throw error(500, "Couldn't find album");
	}

	if (!album) {
		error(404, 'Album not found');
	}
	const { data: trackDetails } = await supabase
		.from('tracks_with_details')
		.select('*')
		.eq('album_id', album.id);

	let isLiked = false;
	if (user) {
		const { data: likeData, error } = await supabase
			.from('album_likes')
			.select('*')
			.eq('album_id', album.id)
			.eq('user_id', user?.id)
			.maybeSingle();

		if (likeData) {
			isLiked = true;
		}
	}
	return {
		album: album,
		artist: { ...album.artist, payout_address: album.artist.payout.wallet_address },
		tracks: trackDetails!, //album.tracks,
		relatedAlbums: album.artist.albums,
		isLiked
	};
};
