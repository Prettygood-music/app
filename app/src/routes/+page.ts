import { makeClient } from '$lib/api';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const client = makeClient(fetch);

	const recommendedTracksResponse = await client.api.recommendations.tracks.$get({
		query: {
			type: 'for-you'
		}
	});
	// FIXME: We'll need a way to discriminate between success and failure.
	const json = await recommendedTracksResponse.json();

	/*
	const albums = await client.api.albums.$get({query:{}});
	console.dir(await albums.json());
*/
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
	}

	error(500, "Something went wrong, couldn't fetch recommended tracks");
}) satisfies PageLoad;
