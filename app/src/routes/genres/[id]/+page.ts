import type { PageLoad } from './$types';
import { getGenreById, getGenreBySlug, getGenreWithContent } from '$lib/services/genres';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	let genre: Awaited<ReturnType<typeof getGenreById>> | null = null;
	try {
		// Try to load genre by ID first

		genre = await getGenreById(params.id);
	} catch (error) {
		// If not found by ID, try as a slug
		genre = await getGenreBySlug(params.id);
		// console.log(genre);
	}

	// If still not found, return 404
	if (!genre) {
		error(404, {
			message: `Genre not found: ${params.id}`,
			code: 'GENRE_NOT_FOUND'
		});
	}

	console.log(genre.id);
	try {
		// Load genre with content
		const genreWithContent = await getGenreWithContent(
			genre.id,
			{ limit: 50, sortBy: 'play_count' }, // Tracks params
			{ limit: 20 }, // Artists params
			{ limit: 12 } // Albums params
		);
		console.log('genreWithContent', genreWithContent);

		return {
			genreWithContent,
			status: 'success'
		};
	} catch (err) {
		console.error('Error loading genre details:', err);

		if (err.status === 404) {
			throw err; // Pass through 404 errors
		}

		return {
			genreWithContent: null,
			status: 'error',
			error: err instanceof Error ? err.message : 'Unknown error'
		};
	}
}) satisfies PageLoad;
