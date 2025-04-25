import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { playlist } from '$lib/schemas';

export const load: PageServerLoad = async () => {
	// Get the current user ID from the session

	const form = await superValidate(zod(playlist.playlistCreationSchema));
	

	return {
		form
	};
};
