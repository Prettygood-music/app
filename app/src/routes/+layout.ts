import { DEPENDS } from '$lib/constants';
import { databaseClient } from '$lib/databaseClient';
import type { LayoutLoad } from './$types';

export const load = (async ({ depends, data }) => {
	depends(DEPENDS.AUTH);
	// Handle auth in here desu
	//databaseClient()

	return {
		user: data.user
	};
}) satisfies LayoutLoad;
