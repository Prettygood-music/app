import { trackCreationSchema } from '$lib/schemas/trackSchema';
import { fail } from '@sveltejs/kit';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import mime from 'mime-types';

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
			return fail(
				400,
				withFiles({
					form,
					error: 'Invalid form data'
				})
			);
		}

		const trackData = form.data;

		const audioFile = form.data.audio_file;
		const coverFile = form.data.cover_image;
		
		// TODO: this should be an utility function
		const extension = mime.extension(audioFile.name);
		const uuid = crypto.randomUUID();
		// Filename to save as, including extension
		const fileName = `${uuid}.${extension}`;
		
		// NOTE: be mindful that this will break if we end up creating a dedicated artist ID
		const { data: audioStorageData, error: audioStorageError } = await supabase.storage
			.from('test')
			.upload(`${event.locals.user!.id}/${fileName}`, audioFile, {
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
	}
};
