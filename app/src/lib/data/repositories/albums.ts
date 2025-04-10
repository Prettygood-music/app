// server/src/repositories/albums.ts
import { v4 as uuidv4 } from 'uuid';
import type { Album, Track } from '$lib/types';
import { mockAlbums, mockTracks } from '$lib/data/mocks';
// import { createClient as createApiClient } from '@prettygood/database';

/**
 * Album repository using mock data for development
 */
export class AlbumRepository {
	/**
	 * Get all albums with pagination
	 */
	async getAll(page = 1, limit = 20): Promise<{ albums: Album[]; total: number }> {
		const offset = (page - 1) * limit;
		const paginatedAlbums = mockAlbums.slice(offset, offset + limit);
		//const client = createApiClient('http://localhost:3000');
		//const albums = await client.from('albums').select('*');
		return {
			albums: paginatedAlbums, //albums.data || [], // ,
			total: mockAlbums.length
		};
	}

	/**
	 * Get album by ID
	 */
	async getById(id: string): Promise<Album | null> {
		const album = mockAlbums.find((a) => a.id === id);

		if (!album) return null;

		return album;
	}

	/**
	 * Get tracks for an album
	 */
	async getTracks(
		albumId: string,
		page = 1,
		limit = 20
	): Promise<{
		tracks: Track[];
		total: number;
	}> {
		const album = await this.getById(albumId);

		if (!album) {
			throw new Error('Album not found');
		}

		const tracks = album.tracks;
		const offset = (page - 1) * limit;
		const paginatedTracks = tracks.slice(offset, offset + limit);

		return {
			tracks: paginatedTracks,
			total: tracks.length
		};
	}

	/**
	 * Get featured albums (newest or most popular)
	 */
	async getFeatured(limit = 6): Promise<Album[]> {
		// For mock data, just return the newest albums based on release date
		return [...mockAlbums]
			.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
			.slice(0, limit);
	}

	/**
	 * Search albums by title or artist name
	 */
	async search(query: string, limit = 10): Promise<Album[]> {
		const searchQuery = query.toLowerCase();

		return mockAlbums
			.filter(
				(album) =>
					album.title.toLowerCase().includes(searchQuery) ||
					album.artist_name.toLowerCase().includes(searchQuery)
			)
			.slice(0, limit);
	}

	/**
	 * Create a new album
	 */
	async create(albumData: {
		title: string;
		artistId: string;
		artistName: string;
		coverUrl?: string | null;
		releaseDate: string;
		tracks: Track[];
	}): Promise<Album> {
		const { title, artistId, artistName, coverUrl, releaseDate, tracks } = albumData;

		const newAlbum: Album = {
			id: uuidv4(),
			title,
			artist_id: artistId,
			artist_name: artistName,
			cover_url: coverUrl || null,
			release_date: releaseDate,
			track_count: tracks.length,
			tracks: tracks
		};

		// Add to mock database
		mockAlbums.push(newAlbum);

		// Update tracks to include album info
		for (const track of tracks) {
			const trackIndex = mockTracks.findIndex((t) => t.id === track.id);
			if (trackIndex !== -1) {
				mockTracks[trackIndex] = {
					...mockTracks[trackIndex],
					album_id: newAlbum.id,
					album_name: newAlbum.title
				};
			}
		}

		return newAlbum;
	}

	/**
	 * Update an existing album
	 */
	async update(
		id: string,
		albumData: {
			title?: string;
			coverUrl?: string | null;
			releaseDate?: string;
		}
	): Promise<Album | null> {
		const albumIndex = mockAlbums.findIndex((a) => a.id === id);

		if (albumIndex === -1) return null;

		const album = mockAlbums[albumIndex];

		// Update album
		const updatedAlbum: Album = {
			...album,
			title: albumData.title || album.title,
			cover_url: albumData.coverUrl !== undefined ? albumData.coverUrl : album.cover_url,
			release_date: albumData.releaseDate || album.release_date
		};

		mockAlbums[albumIndex] = updatedAlbum;

		// If title was updated, update all tracks referencing this album
		if (albumData.title && albumData.title !== album.title) {
			for (let i = 0; i < mockTracks.length; i++) {
				if (mockTracks[i].album_id === id) {
					mockTracks[i] = {
						...mockTracks[i],
						album_name: albumData.title
					};
				}
			}
		}

		return updatedAlbum;
	}

	/**
	 * Delete an album
	 */
	async delete(id: string): Promise<boolean> {
		const albumIndex = mockAlbums.findIndex((a) => a.id === id);

		if (albumIndex === -1) return false;

		// Remove album
		mockAlbums.splice(albumIndex, 1);

		// Update tracks to remove album reference
		for (let i = 0; i < mockTracks.length; i++) {
			if (mockTracks[i].album_id === id) {
				mockTracks[i] = {
					...mockTracks[i],
					album_id: null,
					album_name: null
				};
			}
		}

		return true;
	}

	/**
	 * Get albums by artist ID
	 */
	async getByArtistId(
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
}

export const albumRepository = new AlbumRepository();
