import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();

	const { data: album } = await supabase
		.from('albums')
		.select('*, tracks(*), artist: artists(*, artist_name, albums(*, tracks(id)))')
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.neq('artist.albums.id', params.id)
		.single();

	if (!album) {
		error(404, 'Album not found');
	}

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
		artist: album.artist,
		tracks: album.tracks,
		relatedAlbums: album.artist.albums,
		isLiked
	};
};
