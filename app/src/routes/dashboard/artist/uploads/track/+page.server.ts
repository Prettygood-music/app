import { databaseClient } from '$lib/databaseClient';
import { trackCreationSchema } from '$lib/schemas/trackSchema';
import { storeFile } from '$lib/server/services/fileStorage';
import { fail } from '@sveltejs/kit';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Get the current user ID from the session
	const { supabase } = locals;

	const form = await superValidate(zod(trackCreationSchema));
	const { data: albums } = await supabase
		.from('albums')
		.select('*')
		.eq('artist_id', locals.user!.id);

	return {
		albums: albums || [],
		form
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { supabase } = event.locals;

		const form = await superValidate(event, zod(trackCreationSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const trackData = form.data;

		const audioFile = form.data.audio_file;
		const coverFile = form.data.cover_image;
		// NOTE: be mindful that this will break if we end up creating a dedicated artist ID

		const { data: audioStorageData, error: audioStorageError } = await supabase.storage
			.from('test')
			.upload(`${event.locals.user!.id}/${audioFile.name}`, audioFile, {
				contentType: 'audio/*'
			});

		if (audioStorageError) {
			console.error('audio storage error', audioStorageError);
			return fail(500, withFiles({ form, error: audioStorageError }));
		}
		console.log('audio storage data', audioStorageData);
		const {
			data: { publicUrl: audioURL }
		} = await supabase.storage.from('test').getPublicUrl(audioStorageData!.path);
		console.log(audioURL);

		//return { form };
		//return message(form, 'Track created successfully');

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

		const { data: trackInsert, error: trackError } = await supabase.from('tracks').insert({
			title: trackData.title,
			artist_id: event.locals.user!.id,
			audio_url: audioURL,
			// FIXME: we need to compute duration
			duration: 0,
			cover_url: coverURL,
			album_id: trackData.album_id || undefined,
			explicit: trackData.explicit,
			isrc: trackData.isrc || undefined,
			genre: trackData.genre,
			lyrics: trackData.lyrics || undefined,
			release_date: trackData.release_date || undefined,
			track_number: trackData.track_number || undefined
		});
		if (trackError) {
			console.error(trackError);
			fail(500, { form });
		}

		console.dir(trackInsert);
		return message(form, 'Track created successfully');
		/*

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

		const { data: track, error: err } = await databaseClient.rpc('create_track', {
			title: trackData.title,
			artist_id: event.locals.user.id,
			audio_url: audioPath,
			// Fix duration
			duration: 0,
			cover_url: coverPath,
			album_id: trackData.album_id || undefined,
			explicit: trackData.explicit,
			isrc: trackData.isrc || undefined,
			genre: trackData.genre,
			lyrics: trackData.lyrics || undefined,
			release_date: trackData.release_date || undefined,
			track_number: trackData.track_number || undefined
		});

		console.dir(track);
		if (err) {
			console.error(err);
		}*/
	}
};
