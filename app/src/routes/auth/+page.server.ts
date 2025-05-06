import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { registerSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { MINTER } from '$lib/services/nft/minter';
import { LINKS } from '$lib/constants';

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

		if (!data || !data.user) {
			console.error(error);
			return fail(500, {
				form
			});
		}

		if (form.data.address) {
			const { error: setAddressError } = await event.locals.supabase
				.from('users')
				.update({ wallet_address: form.data.address })
				.eq('id', data.user.id);
			if (setAddressError) {
				console.error("Couldn't set wallet address");
			} else {
				const { data: earlySupporterData, error: earlySupporterError } = await event.locals.supabase
					.from('achievements')
					.select('*')
					.eq('title', 'Early Supporter')
					.single();
				if (!earlySupporterData) {
					console.error('earlySupporter: ', earlySupporterError);
				} else {
					await MINTER.mintAchievement(earlySupporterData.id, form.data.address);
				}
			}
		}

		return {
			form
		};
	}
};

// Provide any page data needed
export async function load({ locals }) {
	// If user is already logged in, redirect to dashboard
	if (locals.user) {
		throw redirect(302, LINKS.USERS.ID(locals.user.id));
	}

	const form = await superValidate(zod(registerSchema));

	return { form };
}
