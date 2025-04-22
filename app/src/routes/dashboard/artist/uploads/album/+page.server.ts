import type { PageServerLoad, Actions } from './$types';
import { album } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { storeFile } from '$lib/server/services/fileStorage';
import { databaseClient } from '$lib/databaseClient';
import { fail } from '@sveltejs/kit';

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
			const { data } = await supabase.storage
				.from('test')
				.upload(`${event.locals.user!.id}/${coverFile.name}`, coverFile, {});

			const {
				data: { publicUrl: coverPublicURL }
			} = await supabase.storage.from('test').getPublicUrl(data!.path);
			coverURL = coverPublicURL;
		}

		/*
		const { data: insertedAlbum, error: err } = await databaseClient.rpc("create", {
			title: albumData.title,
			artist_id: event.locals.user.id,
			cover_url: coverPath,
			genre: albumData.genre,
			release_date: albumData.release_date,
			description: albumData.description
		});*/

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

		return message(form, 'Album created successfully');
		
	}
};
