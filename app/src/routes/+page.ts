import type { PageLoad } from './$types';
import { databaseClient } from '$lib/databaseClient';

export const load = (async () => {
	const { data: recommendedTracks, error } = await databaseClient.rpc('get_recommendations', {
		limit_count: 10
	});
	if (error) {
		console.error(error);
	}

	const relevantAlbumsIDs = [
		...new Set(
			(recommendedTracks || [])
				.map((r) => {
					return r.album_id;
				})
				.filter((id) => id !== null)
		)
	];

	const relevantArtistsID = [
		...new Set(
			(recommendedTracks || [])
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

	// TODO: we need the user's ID to provide his play history
	const { data: play_history } = await databaseClient.from('play_history').select('*').limit(20);
	console.dir(play_history);
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
			tracks: recommendedTracks || [],
			albums: recommendedAlbums || [],
			artists: recommendedArtists || []
		}
	};
}) satisfies PageLoad;
