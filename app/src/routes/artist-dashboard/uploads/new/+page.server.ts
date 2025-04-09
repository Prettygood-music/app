import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { trackCreationSchema } from '$lib/schemas/trackSchema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	// Get the current user ID from the session
	const userId = locals.user?.id;
	if (!userId) {
		return {
			albums: []
		};
	}

    const form = await superValidate(zod(trackCreationSchema));
  

	return {
		albums: [],
    form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(trackCreationSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.dir(form.data);
		// TODO: implement saving track to database
	}
};
