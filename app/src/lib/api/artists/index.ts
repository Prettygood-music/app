// server/src/controllers/artists.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { artistRepository } from '$lib/data/repositories/artists';
import { authMiddleware } from '$lib/hono/middlewares/access';

// Define validation schemas
const QuerySchema = z.object({
	page: z.coerce.number().optional().default(1),
	limit: z.coerce.number().min(1).max(100).optional().default(20)
});

const SearchQuerySchema = z.object({
	query: z.string().min(1).max(100),
	limit: z.coerce.number().min(1).max(20).optional().default(10)
});

const ArtistUpdateSchema = z.object({
	displayName: z.string().min(2).max(100),
	avatarUrl: z.string().url().optional()
});

// Create Hono router
export const artistsRouter = new Hono()
	// Get all artists with pagination
	.get('/', zValidator('query', QuerySchema), async (c) => {
		const { page, limit } = c.req.valid('query');

		try {
			const result = await artistRepository.getAll(page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching artists:', error);
			return c.json({ error: 'Failed to fetch artists' }, 500);
		}
	})

	// Get featured artists
	.get('/featured', async (c) => {
		try {
			const artists = await artistRepository.getFeatured();
			return c.json({ artists });
		} catch (error) {
			console.error('Error fetching featured artists:', error);
			return c.json({ error: 'Failed to fetch featured artists' }, 500);
		}
	})

	// Search artists
	.get('/search', zValidator('query', SearchQuerySchema), async (c) => {
		const { query, limit } = c.req.valid('query');

		try {
			const artists = await artistRepository.search(query, limit);
			return c.json({ artists });
		} catch (error) {
			console.error('Error searching artists:', error);
			return c.json({ error: 'Failed to search artists' }, 500);
		}
	})

	// Get artist by ID
	.get('/:id', async (c) => {
		const id = c.req.param('id');

		try {
			const profile = await artistRepository.getArtistProfile(id);

			if (!profile) {
				return c.json({ error: 'Artist not found' }, 404);
			}

			return c.json(profile);
		} catch (error) {
			console.error('Error fetching artist:', error);
			return c.json({ error: 'Failed to fetch artist' }, 500);
		}
	})

	// Get artist's tracks
	.get('/:id/tracks', zValidator('query', QuerySchema), async (c) => {
		const id = c.req.param('id');
		const { page, limit } = c.req.valid('query');

		try {
			// First check if artist exists
			const artist = await artistRepository.getById(id);

			if (!artist) {
				return c.json({ error: 'Artist not found' }, 404);
			}

			const result = await artistRepository.getTracks(id, page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching artist tracks:', error);
			return c.json({ error: 'Failed to fetch artist tracks' }, 500);
		}
	})

	// Get artist's top tracks
	.get('/:id/tracks/top', async (c) => {
		const id = c.req.param('id');

		try {
			// First check if artist exists
			const artist = await artistRepository.getById(id);

			if (!artist) {
				return c.json({ error: 'Artist not found' }, 404);
			}

			const tracks = await artistRepository.getTopTracks(id);
			return c.json({ tracks });
		} catch (error) {
			console.error('Error fetching artist top tracks:', error);
			return c.json({ error: 'Failed to fetch artist top tracks' }, 500);
		}
	})

	// Get artist's albums
	.get('/:id/albums', zValidator('query', QuerySchema), async (c) => {
		const id = c.req.param('id');
		const { page, limit } = c.req.valid('query');

		try {
			// First check if artist exists
			const artist = await artistRepository.getById(id);

			if (!artist) {
				return c.json({ error: 'Artist not found' }, 404);
			}

			const result = await artistRepository.getAlbums(id, page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching artist albums:', error);
			return c.json({ error: 'Failed to fetch artist albums' }, 500);
		}
	})

	// Become an artist (update user to artist)
	.post('/', authMiddleware(), zValidator('json', ArtistUpdateSchema), async (c) => {
		const { displayName, avatarUrl } = c.req.valid('json');
		const user = c.get('user');

		if (!user) {
			return c.json({ error: 'User not authenticated' }, 401);
		}

		try {
			const artist = await artistRepository.upsert({
				userId: user.id,
				displayName,
				avatarUrl
			});

			return c.json(
				{
					message: 'Artist profile created successfully',
					artist
				},
				201
			);
		} catch (error) {
			console.error('Error creating artist profile:', error);
			return c.json({ error: 'Failed to create artist profile' }, 500);
		}
	})

	// Update artist profile (for existing artists)
	.patch('/:id', authMiddleware(), zValidator('json', ArtistUpdateSchema), async (c) => {
		const id = c.req.param('id');
		const { displayName, avatarUrl } = c.req.valid('json');
		const user = c.get('user');

		if (!user) {
			return c.json({ error: 'User not authenticated' }, 401);
		}

		// Check if user is the artist
		if (id !== user.id) {
			return c.json({ error: 'You can only update your own artist profile' }, 403);
		}

		try {
			const artist = await artistRepository.upsert({
				userId: user.id,
				displayName,
				avatarUrl
			});

			return c.json({
				message: 'Artist profile updated successfully',
				artist
			});
		} catch (error) {
			console.error('Error updating artist profile:', error);
			return c.json({ error: 'Failed to update artist profile' }, 500);
		}
	});
