import type { PageServerLoad, Actions } from './$types';
import { updateAddress } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const form = await superValidate(zod(updateAddress.schema));

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		console.log('triggered');
		const { user, supabase } = event.locals;

		const form = await superValidate(event, zod(updateAddress.schema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { error: updateAddressError } = await supabase
			.from('users')
			.update({
				wallet_address: form.data.address
			})
			.eq('id', user!.id);
		if (updateAddressError) {
			console.error(updateAddressError);
		}

		return { form, walletAddress: form.data.address };
	}
};
