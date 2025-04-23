import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schemas';
import { LINKS } from '$lib/constants';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { error: signInError } = await event.locals.supabase.auth.signInWithPassword({
			email: form.data.emailOrUsername,
			password: form.data.password
		});

		if (signInError) {
			console.error(signInError);
			return fail(401, {
				error: true,
				message: 'Invalid email/username or password',
				authError: true,
				form
			});
		} else {
			redirect(303, LINKS.HOME);
		}
	}
};
// Provide any page data needed
export async function load({ locals }) {
	// If user is already logged in, redirect to dashboard

	if (locals.user) {
		throw redirect(302, '/dashboard');
	}

	const form = await superValidate(zod(loginSchema));

	return { form };
}
