import { LINKS } from '$lib/constants.js';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';

export async function load({ locals }) {
	// Redirect to login if user is not authenticated
	if (!locals.user) {
		throw redirect(302, LINKS.LOGIN);
	}

	const { data: artist, error: err } = await locals.supabase
		.from('artists')
		.select('*')
		.eq('id', locals.user.id)
		.maybeSingle();

	if (err) {
		error(404, err);
	}

	return {
		user: locals.user,
		artist
	};
}

export const actions: Actions = {
	registerArtist: async (event) => {
		const user = event.locals.user;

		if (!user) {
			return fail(404);
		}
		const { supabase } = event.locals;
		const { error } = await supabase.rpc('apply_for_artist_account', {
			artist_name: 'deez nutters',
			bio: "They tried to stop him, they couldn't",
			genre: ['Soul frog'],
			location: 'America',
			social_links: {
				twitter: 'tweet'
			}
		});
		if (error) {
			console.error(error);
			return fail(500, { error });
		} else {
			redirect(302, LINKS.ARTIST_DASHBOARD);
		}
	}
};
