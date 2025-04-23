import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(308, '/dashboard');
	}

	const { data: artist, error: artistError } = await locals.supabase
		.from('artists')
		.select('*')
		.eq('id', locals.user.id)
		.single();
	if (!artist) {
		error(404, "Couldn't find artist");
	}

	return {
		artist
	};
};
