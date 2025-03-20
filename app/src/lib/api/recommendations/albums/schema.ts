// lib/api/recommendations/albums/schema.ts
import { z } from 'zod';

/**
 * Album recommendation types
 */
export const albumRecommendationTypes = [
	'featured',
	'popular',
	'new-releases',
	'similar',
	'for-you',
	'by-genre',
	'by-artist',
	'critically-acclaimed',
	'complete-collection'
] as const;

/**
 * Schema for album recommendation parameters
 */
export const albumRecommendationsSchema = z.object({
	type: z.enum(albumRecommendationTypes),

	// Pagination
	limit: z.number().int().positive().default(20),
	page: z.number().int().positive().default(1),

	// Filter
	excludeListened: z.boolean().default(false),

	// Optional parameters for specific recommendation types
	seedAlbumId: z.string().uuid().optional(),
	genre: z.string().optional(),
	artistId: z.string().uuid().optional()
});

/**
 * Type for album recommendation parameters
 */
export type AlbumRecommendationsSchema = z.infer<typeof albumRecommendationsSchema>;

/**
 * Schema for album recommendation response
 */
export const albumRecommendationsResponseSchema = z.object({
	albums: z.array(
		z.object({
			id: z.string().uuid(),
			title: z.string(),
			artist_id: z.string().uuid(),
			artist_name: z.string(),
			cover_image: z.string().url().optional(),
			release_date: z.string().datetime(),
			genres: z.array(z.string()),
			track_count: z.number().int().positive(),
			play_count: z.number().int().nonnegative(),
			rating: z.number().min(0).max(5).optional(),
			duration_ms: z.number().int().positive().optional()
		})
	),
	total: z.number().int().nonnegative()
});

/**
 * Type for album recommendation response
 */
export type AlbumRecommendationsResponse = z.infer<typeof albumRecommendationsResponseSchema>;
