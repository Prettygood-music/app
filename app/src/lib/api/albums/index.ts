// server/src/controllers/albums.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { albumRepository } from '$lib/data/repositories/albums';
import { authMiddleware } from '$lib/hono/middlewares/access';
import { PaginationSchema, SearchSchema } from '$lib/types/schemas';

// Define validation schemas
const AlbumCreateSchema = z.object({
	title: z.string().min(1).max(100),
	coverUrl: z.string().url().nullable().optional(),
	releaseDate: z.string(), // ISO date string
	trackIds: z.array(z.string()).optional()
});

const AlbumUpdateSchema = z.object({
	title: z.string().min(1).max(100).optional(),
	coverUrl: z.string().url().nullable().optional(),
	releaseDate: z.string().optional() // ISO date string
});

// Create Hono router
export const albumsRouter = new Hono()
	// Get all albums with pagination
	.get('/', zValidator('query', PaginationSchema), async (c) => {
		const { page, limit } = c.req.valid('query');

		try {
			const result = await albumRepository.getAll(page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching albums:', error);
			return c.json({ error: 'Failed to fetch albums' }, 500);
		}
	})

	// Get featured albums
	.get('/featured', async (c) => {
		try {
			const albums = await albumRepository.getFeatured();
			return c.json({ albums });
		} catch (error) {
			console.error('Error fetching featured albums:', error);
			return c.json({ error: 'Failed to fetch featured albums' }, 500);
		}
	})

	// Search albums
	.get('/search', zValidator('query', SearchSchema), async (c) => {
		const { query, limit } = c.req.valid('query');

		try {
			const albums = await albumRepository.search(query, limit);
			return c.json({ albums });
		} catch (error) {
			console.error('Error searching albums:', error);
			return c.json({ error: 'Failed to search albums' }, 500);
		}
	})

	// Get album by ID
	.get('/:id', async (c) => {
		const id = c.req.param('id');

		try {
			const album = await albumRepository.getById(id);

			if (!album) {
				return c.json({ error: 'Album not found' }, 404);
			}

			return c.json({ album });
		} catch (error) {
			console.error('Error fetching album:', error);
			return c.json({ error: 'Failed to fetch album' }, 500);
		}
	})

	// Get album tracks
	.get('/:id/tracks', zValidator('query', PaginationSchema), async (c) => {
		const id = c.req.param('id');
		const { page, limit } = c.req.valid('query');

		try {
			const result = await albumRepository.getTracks(id, page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching album tracks:', error);

			if (error.message === 'Album not found') {
				return c.json({ error: 'Album not found' }, 404);
			}

			return c.json({ error: 'Failed to fetch album tracks' }, 500);
		}
	})

	// Create a new album (protected - requires artist)
	.post(
		'/',
		authMiddleware({ requireArtist: true }),
		zValidator('json', AlbumCreateSchema),
		async (c) => {
			const { title, coverUrl, releaseDate, trackIds = [] } = c.req.valid('json');
			const user = c.get('user');

			if (!user) {
				return c.json({ error: 'Authentication required' }, 401);
			}

			if (!user.is_artist) {
				return c.json({ error: 'Artist account required' }, 403);
			}

			try {
				// In a real app, we'd validate that trackIds belong to the artist
				// For mock data, we'll get tracks from our mock data

				// Import mockTracks directly here to avoid circular dependencies
				const { mockTracks } = await import('../data/mocks/mockData');

				// Filter tracks by artist and IDs if provided
				const tracks =
					trackIds.length > 0
						? mockTracks.filter(
								(track) => track.artist_id === user.id && trackIds.includes(track.id)
							)
						: [];

				const album = await albumRepository.create({
					title,
					artistId: user.id,
					artistName: user.display_name,
					coverUrl,
					releaseDate,
					tracks
				});

				return c.json({ message: 'Album created successfully', album }, 201);
			} catch (error) {
				console.error('Error creating album:', error);
				return c.json({ error: 'Failed to create album' }, 500);
			}
		}
	)

	// Update an album (protected - requires artist ownership)
	.patch(
		'/:id',
		authMiddleware({ requireArtist: true }),
		zValidator('json', AlbumUpdateSchema),
		async (c) => {
			const id = c.req.param('id');
			const updateData = c.req.valid('json');
			const user = c.get('user');

			if (!user) {
				return c.json({ error: 'Authentication required' }, 401);
			}

			try {
				// Check if album exists and belongs to the artist
				const album = await albumRepository.getById(id);

				if (!album) {
					return c.json({ error: 'Album not found' }, 404);
				}

				if (album.artist_id !== user.id) {
					return c.json({ error: 'You can only update your own albums' }, 403);
				}

				const updatedAlbum = await albumRepository.update(id, {
					title: updateData.title,
					coverUrl: updateData.coverUrl,
					releaseDate: updateData.releaseDate
				});

				return c.json({
					message: 'Album updated successfully',
					album: updatedAlbum
				});
			} catch (error) {
				console.error('Error updating album:', error);
				return c.json({ error: 'Failed to update album' }, 500);
			}
		}
	)

	// Delete an album (protected - requires artist ownership)
	.delete('/:id', authMiddleware({ requireArtist: true }), async (c) => {
		const id = c.req.param('id');
		const user = c.get('user');

		if (!user) {
			return c.json({ error: 'Authentication required' }, 401);
		}

		try {
			// Check if album exists and belongs to the artist
			const album = await albumRepository.getById(id);

			if (!album) {
				return c.json({ error: 'Album not found' }, 404);
			}

			if (album.artist_id !== user.id) {
				return c.json({ error: 'You can only delete your own albums' }, 403);
			}

			const success = await albumRepository.delete(id);

			if (success) {
				return c.json({ message: 'Album deleted successfully' });
			} else {
				return c.json({ error: 'Failed to delete album' }, 500);
			}
		} catch (error) {
			console.error('Error deleting album:', error);
			return c.json({ error: 'Failed to delete album' }, 500);
		}
	})

	// Get albums by artist ID (convenience endpoint)
	.get('/by-artist/:artistId', zValidator('query', PaginationSchema), async (c) => {
		const artistId = c.req.param('artistId');
		const { page, limit } = c.req.valid('query');

		try {
			const result = await albumRepository.getByArtistId(artistId, page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching artist albums:', error);
			return c.json({ error: 'Failed to fetch artist albums' }, 500);
		}
	});
