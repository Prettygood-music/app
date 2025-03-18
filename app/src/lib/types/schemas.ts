import { z } from 'zod';

/**
 * Schema for pagination parameters
 *
 * @example
 * // Valid inputs
 * { page: 1, limit: 20 }
 * { page: "2", limit: "10" } // Strings are coerced to numbers
 * { } // Uses defaults
 *
 * // Invalid inputs
 * { page: 0 } // Page must be >= 1
 * { limit: 101 } // Limit must be <= 100
 * { page: "abc" } // Not a valid number
 */
export const PaginationSchema = z.object({
	/**
	 * Page number (1-based)
	 * @default 1
	 */
	page: z.coerce
		.number()
		.int()
		.min(1, { message: 'Page must be at least 1' })
		.optional()
		.default(1),

	/**
	 * Number of items per page
	 * @default 20
	 */
	limit: z.coerce
		.number()
		.int()
		.min(1, { message: 'Limit must be at least 1' })
		.max(100, { message: 'Limit cannot exceed 100' })
		.optional()
		.default(20)
});

/**
 * Schema for search parameters
 *
 * @example
 * // Valid inputs
 * { query: "music", limit: 10 }
 * { query: "artist name" }
 *
 * // Invalid inputs
 * { query: "" } // Query must not be empty
 * { query: "a" } // Query must be at least 2 characters
 */
export const SearchSchema = z.object({
	/**
	 * Search query string
	 * @min 2 characters
	 * @max 100 characters
	 */
	query: z
		.string()
		.min(2, { message: 'Search query must be at least 2 characters' })
		.max(100, { message: 'Search query cannot exceed 100 characters' }),

	/**
	 * Number of search results to return
	 * @default 20
	 */
	limit: z.coerce
		.number()
		.int()
		.min(1, { message: 'Limit must be at least 1' })
		.max(50, { message: 'Limit cannot exceed 50' })
		.optional()
		.default(20),

	/**
	 * Optional search type to filter results
	 */
	type: z.enum(['all', 'track', 'album', 'artist', 'playlist']).optional().default('all')
});

// Export types derived from the schemas
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type SearchParams = z.infer<typeof SearchSchema>;
