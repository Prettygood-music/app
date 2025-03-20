import { makeClient } from '$lib/api';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
	const apiClient = makeClient(fetch);

	return {
		apiClient
	};
}) satisfies LayoutLoad;
