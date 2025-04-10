import { databaseClient, getDatabaseClient } from '$lib/databaseClient.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export function load({ locals }) {
	// Redirect to login if user is not authenticated
	if (!locals.user) {
		throw redirect(302, '/login');
	}

	return {
		user: locals.user
	};
}

export const actions: Actions = {
	registerArtist: async (event) => {
		const user = event.locals.user;

		if (!user) {
			return fail(404);
		}
		/*const form = await superValidate(event, zod(registerSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}*/
  

		const { data: rpcArtistData, error: rpcError } = await databaseClient.rpc(
			'register_as_artist_with_id',
			{
				artist_name: 'deez nutters',
				bio: "They tried to stop him, they couldn't",
				genre: ['Soul frog'],
				location: 'America',
				social_links: {
					twitter: 'tweet'
				},
				user_id: user.id
			}
		);
		if (rpcError) {
			console.error(rpcError);
		}
		console.dir(rpcArtistData);

		return {};
	}
};
