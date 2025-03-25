import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	/*
	const { apiClient } = await parent();

	const artistId = params.id;
	const artistResponse = await apiClient.api.artists[':id'].$get({
		param: {
			id: artistId
		}
	});
	const artistJson = await artistResponse.json();
	if ('error' in artistJson) {
		console.error('Error loading track page:', artistJson.error);
		error(404, artistJson.error);
	}

	const albumsResponse = await apiClient.api.artists[':id'].albums.$get(
		{
			query: {},
			param: {
				id: artistId
			}
		},
		{}
	);
	const albumsJson = await albumsResponse.json();
	if ('error' in albumsJson) {
		console.error('Error loading artist page, fetching albums:', albumsJson.error);
		error(404, albumsJson.error);
	}

	const topTracks = await (async () => {
		const topTracksResponse = await apiClient.api.artists[':id'].tracks.top.$get({
			param: {
				id: artistId
			}
		});
		const topTracksJson = await topTracksResponse.json();
		return 'tracks' in topTracksJson ? topTracksJson.tracks : [];
	})();

	return {
		artist: artistJson.artist,
		albums: albumsJson.albums,
		topTracks: topTracks,
		similarArtists: [
			{
				id: 'artist-2',
				display_name: 'Lena Logic',
				avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&dpr=2&q=80'
			},
			{
				id: 'artist-3',
				display_name: 'Beth Binary',
				avatar_url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&dpr=2&q=80'
			},
			{
				id: 'artist-4',
				display_name: 'Ethan Byte',
				avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&dpr=2&q=80'
			},
			{
				id: 'artist-5',
				display_name: 'Data Dave',
				avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&dpr=2&q=80'
			}
		]
	};*/

	// NOTE: we'd want to have the actual top albums and tracks here
	const { data: artist } = await databaseClient
		.from('artists')
		.select('*, tracks(*), albums(*)')
		.eq('id', params.id)
		.order('created_at', { ascending: false, referencedTable: 'tracks' })
		.limit(10, { referencedTable: 'tracks' })
		.single();

	/*
	databaseClient.rpc('get_recommendations', {
		limit_count: 10
	});
*/

	if (!artist) {
		error(404, 'Artist not found');
	}
	return {
		artist,
		similarArtists: []
	};
};
