import type { PageServerLoad, Actions } from './$types';
import { album } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { STORAGE_KEYS } from '$lib/constants';
import { makeUniqueName } from '$lib/utils';

export const load = (async () => {
	const form = await superValidate(zod(album.schema));

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const { supabase } = event.locals;

		const form = await superValidate(event, zod(album.schema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const albumData = form.data;
		const coverFile = form.data.cover_image;
		let coverURL: null | string = null;
		if (coverFile) {
			const fileName = await makeUniqueName(coverFile);

			const { data, error: storageError } = await supabase.storage
				.from(STORAGE_KEYS.ALBUMS)
				.upload(`${event.locals.user!.id}/${fileName}`, coverFile, {});
			if (storageError) {
				console.error(storageError);
			} else {
				const {
					data: { publicUrl: coverPublicURL }
				} = await supabase.storage.from(STORAGE_KEYS.ALBUMS).getPublicUrl(data!.path);
				coverURL = coverPublicURL;
			}
		}

		const { data: insertedAlbum, error: err } = await supabase
			.from('albums')
			.insert({
				title: albumData.title,
				artist_id: event.locals.user!.id,
				cover_url: coverURL,
				genre: albumData.genre,
				release_date: albumData.release_date,
				description: albumData.description
			})
			.select()
			.single();

		if (err) {
			console.log(err);
			return fail(500, {
				form
			});
		}

		console.dir(insertedAlbum);

		return message(form, {
			type: 'success',
			text: `Album ${albumData.title} created successfully`
		});
	}
};
