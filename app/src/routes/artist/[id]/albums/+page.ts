import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	// NOTE: we'd want to have the actual top albums and tracks here
	const { artist } = await parent();

	return {
		albums: artist.albums
	};
}) satisfies PageLoad;
