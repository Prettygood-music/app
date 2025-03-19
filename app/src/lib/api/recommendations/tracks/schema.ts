import { z } from 'zod';
import { PaginationSchema } from '$lib/types/schemas';

/**
 * Schema for track recommendations request parameters
 */
export const TrackRecommendationsSchema = z
	.object({
		// Extend the pagination schema for limit and paging
		...PaginationSchema.shape,

		/**
		 * Type of recommendation to retrieve
		 */
		type: z.enum([
			'featured', // Editorially featured tracks
			'popular', // Most played tracks
			'new-releases', // Recently released tracks
			'similar', // Similar to a specified track
			'for-you', // Personalized recommendations
			'by-genre', // Tracks from a specific genre
			'by-mood', // Tracks matching a specific mood
			'by-artist' // More tracks from a specific artist
		]),

		/**
		 * Optional seed track ID for similar recommendations
		 * Required when type is 'similar'
		 */
		seedTrackId: z.string().uuid().optional(),

		/**
		 * Optional artist ID for artist-based recommendations
		 * Required when type is 'by-artist'
		 */
		artistId: z.string().uuid().optional(),

		/**
		 * Optional genre for genre-based recommendations
		 * Required when type is 'by-genre'
		 */
		genre: z.string().optional(),

		/**
		 * Optional mood for mood-based recommendations
		 * Required when type is 'by-mood'
		 */
		mood: z.string().optional(),

		/**
		 * Optional time range for some recommendation types
		 */
		timeRange: z.enum(['short_term', 'medium_term', 'long_term']).optional(),

		/**
		 * Optional flag to exclude tracks the user has already played
		 */
		excludePlayed: z.boolean().optional().default(false)
	})
	.refine((data) => !(data.type === 'similar' && !data.seedTrackId), {
		message: "seedTrackId is required when type is 'similar'",
		path: ['seedTrackId']
	})
	.refine((data) => !(data.type === 'by-artist' && !data.artistId), {
		message: "artistId is required when type is 'by-artist'",
		path: ['artistId']
	})
	.refine((data) => !(data.type === 'by-genre' && !data.genre), {
		message: "genre is required when type is 'by-genre'",
		path: ['genre']
	})
	.refine((data) => !(data.type === 'by-mood' && !data.mood), {
		message: "mood is required when type is 'by-mood'",
		path: ['mood']
	});

// Export the type for TypeScript usage
export type TrackRecommendationsParams = z.infer<typeof TrackRecommendationsSchema>;
