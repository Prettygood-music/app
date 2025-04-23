import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	// NOTE: we'd want to have the actual top albums and tracks here
	const { artist } = await parent();
	return {
		artist
	};
};
