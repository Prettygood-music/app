// server/src/repositories/artists.ts
import type { User, Track, Album, Artist } from '$lib/types';
import { mockUsers, mockTracks, mockAlbums } from '$lib/data/mocks';
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
	async getById(id: string): Promise<Artist | null> {
		//const artist = mockUsers.find((user) => user.id === id && user.is_artist);
		const { data: artist } = await databaseClient
			.from('artists')
			.select('*, tracks(*)')
			.eq('id', id)
			.single();
		if (!artist) return null;

		return artist;
	}

	/**
	 * Get artist profile with track and album count
	 */
	async getArtistProfile(id: string): Promise<{
		artist: User;
		trackCount: number;
		albumCount: number;
		recentTracks: Track[];
	} | null> {
		const artist = await this.getById(id);

		if (!artist) return null;

		// Get tracks for this artist
		const artistTracks = mockTracks.filter((track) => track.artist_id === id);
		const artistAlbums = mockAlbums.filter((album) => album.artist_id === id);

		// Take 5 most recent tracks
		const recentTracks = artistTracks
			.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
			.slice(0, 5);

		return {
			artist,
			trackCount: artistTracks.length,
			albumCount: artistAlbums.length,
			recentTracks
		};
	}

	/**
	 * Get artist's tracks with pagination
	 */
	async getTracks(
		artistId: string,
		page = 1,
		limit = 20
	): Promise<{
		tracks: Track[];
		total: number;
	}> {
		const artistTracks = mockTracks.filter((track) => track.artist_id === artistId);
		const offset = (page - 1) * limit;
		const paginatedTracks = artistTracks
			.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
			.slice(offset, offset + limit);

		return {
			tracks: paginatedTracks,
			total: artistTracks.length
		};
	}

	/**
	 * Get artist's albums with pagination
	 */
	async getAlbums(
		artistId: string,
		page = 1,
		limit = 20
	): Promise<{
		albums: Album[];
		total: number;
	}> {
		const artistAlbums = mockAlbums.filter((album) => album.artist_id === artistId);
		const offset = (page - 1) * limit;
		const paginatedAlbums = artistAlbums
			.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
			.slice(offset, offset + limit);

		return {
			albums: paginatedAlbums,
			total: artistAlbums.length
		};
	}

	/**
	 * Search artists by name
	 */
	async search(query: string, limit = 10): Promise<User[]> {
		const searchQuery = query.toLowerCase();

		return mockUsers
			.filter(
				(user) =>
					user.is_artist &&
					(user.display_name.toLowerCase().includes(searchQuery) ||
						user.username.toLowerCase().includes(searchQuery))
			)
			.slice(0, limit);
	}

	/**
	 * Create or update artist profile
	 */
	async upsert(artistData: {
		userId: string;
		displayName: string;
		avatarUrl?: string;
	}): Promise<User> {
		const { userId, displayName, avatarUrl } = artistData;

		// Check if user exists
		const userIndex = mockUsers.findIndex((user) => user.id === userId);

		if (userIndex === -1) {
			// In a real application, we'd throw an error if user doesn't exist
			throw new Error('User not found');
		}

		// Update user and mark as artist
		mockUsers[userIndex] = {
			...mockUsers[userIndex],
			display_name: displayName,
			avatar_url: avatarUrl || mockUsers[userIndex].avatar_url,
			is_artist: true
		};

		return mockUsers[userIndex];
	}

	/**
	 * Get featured artists
	 */
	async getFeatured(limit = 6): Promise<User[]> {
		// For mock data, just return artists sorted by play counts of their tracks
		const artists = mockUsers.filter((user) => user.is_artist);

		// Calculate total play counts for each artist
		const artistPlayCounts = new Map<string, number>();

		for (const artist of artists) {
			const artistTracks = mockTracks.filter((track) => track.artist_id === artist.id);
			const totalPlays = artistTracks.reduce((sum, track) => sum + track.play_count, 0);
			artistPlayCounts.set(artist.id, totalPlays);
		}

		// Sort artists by play count
		return artists
			.sort((a, b) => {
				const playsA = artistPlayCounts.get(a.id) || 0;
				const playsB = artistPlayCounts.get(b.id) || 0;
				return playsB - playsA;
			})
			.slice(0, limit);
	}

	/**
	 * Get top tracks for an artist
	 */
	async getTopTracks(artistId: string, limit = 5): Promise<Track[]> {
		return mockTracks
			.filter((track) => track.artist_id === artistId)
			.sort((a, b) => b.play_count - a.play_count)
			.slice(0, limit);
	}
}

export const artistRepository = new ArtistRepository();
