// server/src/controllers/recommendations.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { recommendationsRepository } from '$lib/data/repositories/recommendations/tracks';
import { TrackRecommendationsSchema } from './schema';


// Create Hono router
export const tracksRouter = new Hono()
	// Get track recommendations
	.get('/', zValidator('query', TrackRecommendationsSchema), async (c) => {
		const params = c.req.valid('query');

		// Get user from context if available, but don't require authentication
		// This allows recommendations to work for both logged-in and anonymous users
		const user = c.get('user');

		try {
			// If the recommendation type is 'for-you' but user is not logged in,
			// fall back to a more general recommendation type for anonymous users
			let finalParams = params;
			if (params.type === 'for-you' && !user) {
				console.log('User not authenticated, falling back to popular recommendations');
				finalParams = {
					...params,
					type: 'popular' // Fall back to popular tracks for anonymous users
				};
			}

			const result = await recommendationsRepository.getTrackRecommendations(finalParams, user);
			return c.json(result);
		} catch (err) {
			const error = err as Error;
			console.error('Error fetching track recommendations:', error);

			if (error.message === 'Seed track not found' || error.message === 'Artist not found') {
				return c.json({ error: error.message }, 404);
			}

			if (error.message.includes('required')) {
				return c.json({ error: error.message }, 400);
			}

			return c.json({ error: 'Failed to fetch recommendations' }, 500);
		}
	});

// In the future, similar endpoints could be added for album and playlist recommendations
