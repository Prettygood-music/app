// server/src/controllers/recommendations.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getAlbumRecommendations } from '$lib/data/repositories/recommendations/albums';
import { albumRecommendationsSchema } from './schema';

export const albumsRouter = new Hono().get(
	'/',
	zValidator('query', albumRecommendationsSchema),
	async (c) => {
		const params = c.req.valid('query');
		const user = c.get('user');

		try {
			let finalParams = params;
			if (params.type === 'for-you' && !user) {
				console.log('User not authenticated, falling back to popular recommendations');
				finalParams = {
					...params,
					type: 'popular' // Fall back to popular tracks for anonymous users
				};
			}

			const result = await getAlbumRecommendations(finalParams, user);
			return c.json(result);
		} catch (err) {
			const error = err as Error;
			console.error('Error fetching album recommendations:', error);

			if (error.message === 'Seed track not found' || error.message === 'Artist not found') {
				return c.json({ error: error.message }, 404);
			}

			if (error.message.includes('required')) {
				return c.json({ error: error.message }, 400);
			}

			return c.json({ error: 'Failed to fetch recommendations' }, 500);
		}
	}
);
