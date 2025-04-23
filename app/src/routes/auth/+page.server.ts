import { fail, redirect } from '@sveltejs/kit';
import { databaseClient } from '$lib/databaseClient';
import type { Actions } from './$types';
import { registerSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { data, error } = await event.locals.supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					username: form.data.username,
					display_name: form.data.displayName
				}
			}
		});
		if (error) {
			console.error(error);
			return fail(500, {
				form
			});
		}
		/*
		// Call the register_user RPC function
		const { data, error } = await databaseClient.rpc('register_user', {
			_username: form.data.username,
			_email: form.data.email,
			_password: form.data.password,
			_display_name: form.data.displayName
		});

		console.dir(data);

		// Extract data from the response
		//const { user_id, verification_token } = data;
		if (error) {
			console.error(error);
			return fail(500, {
				form: { ...form, error: error }
			});
		}
*/
		return {
			form
		};
	}
};

// Provide any page data needed
export async function load({ locals }) {
	// If user is already logged in, redirect to dashboard
	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	const form = await superValidate(zod(registerSchema));

	return { form };
}
