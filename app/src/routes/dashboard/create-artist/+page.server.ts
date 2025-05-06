import { LINKS, STORAGE_KEYS } from '$lib/constants.js';
import { artist } from '$lib/schemas';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { makeUniqueName } from '$lib/utils';
import { createClientV2 } from '@prettygood/database';
import { SUPABASE_ADMIN_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

export async function load() {
	const form = await superValidate(zod(artist.schema));
	return {
		form
	};
}

export const actions: Actions = {
	default: async (event) => {
		const { supabase, user } = event.locals;

		const form = await superValidate(event, zod(artist.schema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		console.dir(form.data);
		const { data } = form;

		let avatarURL: string | null = null;
		if (data.avatar) {
			const uniqueName = await makeUniqueName(data.avatar);
			const { data: storageData } = await supabase.storage
				.from(STORAGE_KEYS.ARTISTS)
				.upload(`${user!.id}/${uniqueName}`, data.avatar);

			const {
				data: { publicUrl: avatarPublicURL }
			} = await supabase.storage.from(STORAGE_KEYS.ARTISTS).getPublicUrl(storageData!.path);
			avatarURL = avatarPublicURL;
		}

		const { data: applied } = await supabase.rpc('apply_for_artist_account', {
			artist_name: data.name,
			avatar: avatarURL || undefined,
			bio: data.bio,
			genre: data.genre,
			location: data.location,
			social_links: {
				twitter: data.twitter,
				instagram: data.instagram
			},
			website: data.website
		});

		// FIXME: We're cheating a bit here so we can showcase for the demo without having to manually accept artist applications
		const adminClient = createClientV2(PUBLIC_SUPABASE_URL, SUPABASE_ADMIN_KEY);

		const { error: approveError } = await adminClient.rpc('approve_artist_application', {
			artist_id: user!.id,
			approved: true
		});

		if (approveError) {
			console.error(approveError);
			error(500, "Couldn't approve artist");
		}

		redirect(303, LINKS.ARTIST_DASHBOARD);
	}
};
