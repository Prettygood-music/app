import type { Artist, ArtistWithDetails } from '$lib/types';
import { mockArtists, mockTracks, mockAlbums } from '$lib/data/mocks/index';

/**
 * Artist repository using mock data for development
 */
export class ArtistRepository {
	/**
	 * Get all artists with pagination
	 */
	async getAll(page = 1, limit = 20): Promise<{ artists: Artist[]; total: number }> {
		const offset = (page - 1) * limit;
		const paginatedArtists = mockArtists.slice(offset, offset + limit);

		// Add track count to each artist
		const artists = paginatedArtists.map((artist) => {
			const trackCount = mockTracks.filter((track) => track.artistId === artist.id).length;
			return {
				...artist,
				trackCount
			};
		});

		return {
			artists,
			total: mockArtists.length
		};
	}

	/**
	 * Get artist by ID with detailed information
	 */
	async getById(id: string): Promise<ArtistWithDetails | null> {
		const artist = mockArtists.find((a) => a.id === id);

		if (!artist) return null;

		// Get tracks for this artist
		const artistTracks = mockTracks.filter((track) => track.artistId === id);
		const albums = mockAlbums.filter((album) => album.artistId === id);

		// Take 5 most recent tracks
		const recentTracks = artistTracks
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 5)
			.map(({ id, title, duration, coverImage }) => ({
				id,
				title,
				duration,
				coverImage
			}));

		return {
			...artist,
			trackCount: artistTracks.length,
			albumCount: albums.length,
			recentTracks
		};
	}

	/**
	 * Get artist's tracks with pagination
	 */
	async getTracks(artistId: string, page = 1, limit = 20) {
		const artistTracks = mockTracks.filter((track) => track.artistId === artistId);
		const offset = (page - 1) * limit;
		const paginatedTracks = artistTracks
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(offset, offset + limit);

		return {
			tracks: paginatedTracks,
			total: artistTracks.length
		};
	}

	/**
	 * Get artist's albums with pagination
	 */
	async getAlbums(artistId: string, page = 1, limit = 20) {
		const artistAlbums = mockAlbums.filter((album) => album.artistId === artistId);
		const offset = (page - 1) * limit;
		const paginatedAlbums = artistAlbums
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(offset, offset + limit);

		// Add track count to each album
		const albums = paginatedAlbums.map((album) => {
			const trackCount = mockTracks.filter((track) => track.albumId === album.id).length;
			return {
				...album,
				trackCount
			};
		});

		return {
			albums,
			total: artistAlbums.length
		};
	}

	/**
	 * Search artists by name
	 */
	async search(query: string, limit = 10): Promise<Artist[]> {
		const searchQuery = query.toLowerCase();
		return mockArtists
			.filter((artist) => artist.artistName.toLowerCase().includes(searchQuery))
			.slice(0, limit);
	}

	/**
	 * Create or update artist profile
	 */
	async upsert(artistData: {
		userId: string;
		artistName: string;
		bio?: string;
		profileImage?: string;
	}) {
		const { userId, artistName, bio, profileImage } = artistData;

		// Check if artist already exists
		const existingArtistIndex = mockArtists.findIndex((a) => a.id === userId);

		if (existingArtistIndex === -1) {
			// Create new artist
			const newArtist = {
				id: userId,
				artistName,
				bio: bio || null,
				profileImage: profileImage || null,
				walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
				createdAt: new Date().toISOString()
			};

			// In a real app, we'd insert into database
			// For mock data, we'll just add to our array
			mockArtists.push(newArtist);

			return newArtist;
		} else {
			// Update existing artist
			mockArtists[existingArtistIndex] = {
				...mockArtists[existingArtistIndex],
				artistName,
				bio: bio || mockArtists[existingArtistIndex].bio,
				profileImage: profileImage || mockArtists[existingArtistIndex].profileImage
			};

			return mockArtists[existingArtistIndex];
		}
	}

	/**
	 * Get featured artists
	 */
	async getFeatured(limit = 6): Promise<Artist[]> {
		// For mock data, just return some random artists
		const shuffled = [...mockArtists].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, limit);
	}
}

export const artistRepository = new ArtistRepository();
