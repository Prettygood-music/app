import { databaseClient } from '$lib/databaseClient';
import { trackCreationSchema } from '$lib/schemas/trackSchema';
import { storeFile } from '$lib/server/services/fileStorage';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Get the current user ID from the session
	const userId = locals.user?.id;

	const form = await superValidate(zod(trackCreationSchema));

	return {
		albums: [],
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(trackCreationSchema));

		if (!form.valid || !event.locals.user || !event.locals.token) {
			return fail(400, {
				form
			});
		}

		//const databaseClient = getDatabaseClient(event.locals.token)
		const trackData = form.data;

		const audioBuffer = await form.data.audio_file.arrayBuffer();
		const audioPath = await storeFile(
			new Uint8Array(audioBuffer),
			'audio',
			form.data.audio_file.name
		);

		// Store the cover image if provided
		let coverPath: string | undefined = undefined;
		const coverFile = form.data.cover_image;
		if (coverFile) {
			const imageBuffer = await coverFile.arrayBuffer();
			coverPath = await storeFile(new Uint8Array(imageBuffer), 'image', coverFile.name);
		}

		console.log(audioPath, coverPath);

		// FIXME: We should be handling file deletion if there's an issue with the database

		//databaseClient.rpc("")
		const {data: track, error: err} = await databaseClient.rpc('create_track', {
			title: trackData.title,
			artist_id: event.locals.user.id,
			audio_url: audioPath,
			// Fix duration
			duration: 0,
			cover_url: coverPath,
			album_id: trackData.album_id || undefined,
			explicit: trackData.explicit,
			isrc: trackData.isrc|| undefined,
			genre: trackData.genre,
			lyrics: trackData.lyrics|| undefined,
			release_date: trackData.release_date || undefined,
			track_number: trackData.track_number|| undefined
		});
		/*
		const { data: track, error: err } = await databaseClient
			.from('tracks')
			.insert({
				title: trackData.title,
				artist_id: event.locals.user.id,
				audio_url: audioPath,
				// Fix duration
				duration: 0,
				cover_url: coverPath,
				album_id: trackData.album_id,
				explicit: trackData.explicit,
				isrc: trackData.isrc,
				genre: trackData.genre,
				lyrics: trackData.lyrics,
				release_date: trackData.release_date,
				track_number: trackData.track_number
			})
			.select();
*/
		console.dir(track);
		if (err) {
			console.error(err);
		}
	}
};
