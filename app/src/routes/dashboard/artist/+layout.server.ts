import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { databaseClient } from '$lib/databaseClient';

export const load: LayoutServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(308, '/dashboard');
	}

	const { data, error: artistError } = await databaseClient
		.from('artists')
		.select('*')
		.eq('id', locals.user.id)
		.single();

	if (artistError) {
		console.error(artistError);
	}

	if (!data) {
		// Should redirect to artist creation
		error(404, "Couldn't find artist info");
	}

	//const {} = databaseClient.from("")
	//const {} =databaseClient.rpc("")

	return {
		artist: data
	};
};
