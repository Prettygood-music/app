// server/src/repositories/tracks.ts
import { databaseClient } from '$lib/databaseClient';

/**
 * Track repository using mock data for development
 */
export class TrackRepository {
	/**
	 * Get track by ID
	 */
	async getById(id: string) {
		const { data: track } = await databaseClient
			.schema('prettygood')
			.from('tracks')
			.select('id, artist:artists(*)')
			.eq('id', id)
			.single();

		if (!track) return null;

		return track;
	}
}

export const trackRepository = new TrackRepository();
