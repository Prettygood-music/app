import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase } = await parent();

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
	return {
		album: album,
		artist: album.artist,
		tracks: album.tracks,
		relatedAlbums: album.artist.albums
	};
};
