import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { playlist } from '$lib/schemas';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import mime from 'mime-types';
import { LINKS, STORAGE_KEYS } from '$lib/constants';

export const load: PageServerLoad = async () => {
	// Get the current user ID from the session

	const form = await superValidate(zod(playlist.playlistCreationSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { supabase, user } = event.locals;
		const form = await superValidate(event, zod(playlist.playlistCreationSchema));

		if (!form.valid) {
			return fail(400, withFiles({ form, error: 'Invalid form data' }));
		}

		const playlistData = form.data;
		const coverFile = form.data.cover_image;

		const id = crypto.randomUUID();
		let coverURL = null;
		if (coverFile) {
			const extension = mime.extension(coverFile.name);
			const uuid = crypto.randomUUID();
			const fileName = `${uuid}.${extension}`;

			const { data: coverStorageData, error: coverStorageError } = await supabase.storage
				.from(STORAGE_KEYS.PLAYLISTS)
				.upload(`${event.locals.user!.id}/${fileName}`, coverFile, {
					contentType: 'image/*'
				});

			if (coverStorageError) {
				console.error('cover storage error', coverStorageError);
				return fail(500, withFiles({ form, error: coverStorageError.message }));
			}

			const {
				data: { publicUrl }
			} = await supabase.storage.from('test').getPublicUrl(coverStorageData!.path);
			coverURL = publicUrl;
		}

		const { error } = await supabase.from('playlists').insert({
			id: id,
			name: playlistData.name,
			description: playlistData.description,
			is_public: playlistData.isPublic,
			cover_url: coverURL,
			user_id: event.locals.user!.id
		});

		if (error) {
			console.error('playlist creation error', error);
			return fail(500, withFiles({ form, error: error.message }));
		}
		redirect(303, LINKS.PLAYLISTS.ID(id));
	}
};
