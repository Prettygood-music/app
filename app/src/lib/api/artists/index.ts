// server/src/controllers/artists.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { artistRepository } from '$lib/data/repositories/artists';
import { PaginationSchema } from '$lib/types/schemas';

// Create Hono router
export const artistsRouter = new Hono()
	// Get all artists with pagination
	.get('/', zValidator('query', PaginationSchema), async (c) => {
		const { page, limit } = c.req.valid('query');

		try {
			const result = await artistRepository.getAll(page, limit);
			return c.json(result);
		} catch (error) {
			console.error('Error fetching artists:', error);
			return c.json({ error: 'Failed to fetch artists' }, 500);
		}
	});
