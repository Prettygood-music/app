import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	/*
	const { apiClient } = await parent();
	const albumId = params.id;

	const album = await (async () => {
		const albumResponse = await apiClient.api.albums[':id'].$get({
			param: {
				id: albumId
			}
		});
		const albumJson = await albumResponse.json();
		return 'album' in albumJson ? albumJson.album : null;
	})();

	if (!album) {
		error(404, 'Album not found');
	}

	const artist = await (async () => {
		const artistResponse = await apiClient.api.artists[':id'].$get({
			param: {
				id: album.artist_id
			}
		});
		const artistJson = await artistResponse.json();
		return 'artist' in artistJson ? artistJson.artist : null;
	})();

	if (!artist) {
		error(404, 'Artist not found');
	}

	const relatedAlbums = await (async () => {
		const albumResponse = await apiClient.api.artists[':id'].albums.$get({
			query: {},
			param: {
				id: albumId
			}
		});
		const albumJson = await albumResponse.json();
		return 'albums' in albumJson ? albumJson.albums : [];
	})();

	return {
		album: {
			...album,
			genres: [...new Set(album.tracks.flatMap((t) => t.genres))]
		},
		artist,
		tracks: album.tracks,
		relatedAlbums
	};*/

	const { data: album } = await databaseClient
		.from('albums')
		.select('*, tracks(*), artist: artists(*, artist_name, albums(*, tracks(id)))')
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.neq('artist.albums.id', params.id)
		.single();

	console.dir(album);
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
