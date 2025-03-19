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
	if ('tracks' in json) {
		return {
			recommendations: {
				tracks: json.tracks
			}
		};
	}

	error(500, "Something went wrong, couldn't fetch recommended tracks");
}) satisfies PageLoad;
