// server/src/controllers/tracks.ts
import { Hono } from 'hono';
import { trackRepository } from '$lib/data/repositories/tracks';

// Create Hono router
export const tracksRouter = new Hono()

	// Get track by ID
	.get('/:id', async (c) => {
		const id = c.req.param('id');

		try {
			const track = await trackRepository.getById(id);

			if (!track) {
				return c.json({ error: 'Track not found' }, 404);
			}

			return c.json({ track });
		} catch (error) {
			console.error('Error fetching track:', error);
			return c.json({ error: 'Failed to fetch track' }, 500);
		}
	});
