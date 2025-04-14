// server/src/repositories/artists.ts
import type { Artist } from '$lib/types';
import { databaseClient } from '$lib/databaseClient';

/**
 * Artist repository using mock data for development
 */
export class ArtistRepository {
	/**
	 * Get all artists with pagination
	 */
	async getAll(page = 1, limit = 20): Promise<{ artists: Artist[]; total: number }> {
		const offset = (page - 1) * limit;
		const { data: artists, count } = await databaseClient
			.from('artists')
			.select('*', { count: 'exact', head: false })
			.range(offset, offset + limit);
		//const artists = mockUsers.filter((user) => user.is_artist);
		//const paginatedArtists = artists.slice(offset, offset + limit);

		return {
			//artists: paginatedArtists,
			//total: artists.length
			artists: artists || [],
			total: count!
		};
	}

	/**
	 * Get artist by ID with detailed information
	 */
	async getById(id: string) {
		//const artist = mockUsers.find((user) => user.id === id && user.is_artist);
		const { data: artist } = await databaseClient
			.from('artists')
			.select('*, tracks(*)')
			.eq('id', id)
			.single();
		if (!artist) return null;

		return artist;
	}
}

export const artistRepository = new ArtistRepository();
