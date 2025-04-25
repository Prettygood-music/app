import type { PageLoad } from './$types';
import { getAllGenres, getPopularGenres } from '$lib/services/genres';

export const load = (async () => {
  try {
    // Load all genres and popular genres in parallel
    const [allGenres, popularGenres] = await Promise.all([
      getAllGenres(),
      getPopularGenres('month', 8)
    ]);

    return {
      allGenres,
      popularGenres,
      status: 'success'
    };
  } catch (error) {
    console.error('Error loading genres:', error);
    return {
      allGenres: [],
      popularGenres: [],
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}) satisfies PageLoad;
