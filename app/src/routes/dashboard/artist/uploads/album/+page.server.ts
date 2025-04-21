import type { PageServerLoad, Actions } from './$types';
import { album } from '$lib/schemas';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { storeFile } from '$lib/server/services/fileStorage';
import { databaseClient } from '$lib/databaseClient';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	const form = await superValidate(zod(album.schema));

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(album.schema));
		if (!form.valid || !event.locals.user || !event.locals.token) {
			return fail(400, {
				form
			});
		}
		const albumData = form.data;
		const coverFile = form.data.cover_image;
		let coverPath: string | undefined = undefined;
		if (coverFile) {
			const imageBuffer = await coverFile.arrayBuffer();
			coverPath = await storeFile(new Uint8Array(imageBuffer), 'image', coverFile.name);
		}
		console.log(coverPath);

		/*
		const { data: insertedAlbum, error: err } = await databaseClient.rpc("create", {
			title: albumData.title,
			artist_id: event.locals.user.id,
			cover_url: coverPath,
			genre: albumData.genre,
			release_date: albumData.release_date,
			description: albumData.description
		});*/

		const { data: insertedAlbum, error: err } = await databaseClient
			.from('albums')
			.insert({
				title: albumData.title,
				artist_id: event.locals.user.id,
				cover_url: coverPath,
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

		return {
			form
		};
	}
};
