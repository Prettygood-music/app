import { makeClient } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { databaseClient } from '$lib/databaseClient';

export const load = (async ({ fetch }) => {
	const client = makeClient(fetch);

	const { data: recommendedTracks } = await databaseClient.rpc('get_recommendations', {
		limit_count: 10
	});

	const relevantAlbumsIDs = [
		...new Set(
			recommendedTracks!
				.map((r) => {
					return r.album_id;
				})
				.filter((id) => id !== null)
		)
	];

	const relevantArtistsID = [
		...new Set(
			recommendedTracks!
				.map((r) => {
					return r.artist_id;
				})
				.filter((id) => id !== null)
		)
	];

	const { data: recommendedArtists } = await databaseClient
		.from('artists')
		.select('*')
		.in('id', relevantArtistsID);
		
	const { data: recommendedAlbums } = await databaseClient
		.from('albums')
		.select('*')
		.in('id', relevantAlbumsIDs);

	/*
	const recommendedTracksResponse = await client.api.recommendations.tracks.$get({
		query: {
			type: 'for-you'
		}
	});
	// FIXME: We'll need a way to discriminate between success and failure.
	const json = await recommendedTracksResponse.json();

	const recommendedAlbumsResponse = await client.api.recommendations.albums.$get({
		query: {
			type: 'for-you'
		}
	});
	const albumJson = await recommendedAlbumsResponse.json();

	if ('tracks' in json && 'albums' in albumJson) {
		return {
			recommendations: {
				tracks: json.tracks,
				albums: albumJson.albums
			}
		};
	}*/

	return {
		recommendations: {
			tracks: recommendedTracks,
			albums: recommendedAlbums,
			artists: recommendedArtists
		}
	};

	error(500, "Something went wrong, couldn't fetch recommended tracks");
}) satisfies PageLoad;
