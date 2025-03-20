// server/src/services/albumRecommendations.ts
import type { Album, User } from '$lib/types';
import { mockAlbums, mockUsers } from '$lib/data/mocks';
import type { AlbumRecommendationsSchema } from '$lib/api/recommendations/albums/schema';

/**
 * Get album recommendations based on provided parameters
 */
export async function getAlbumRecommendations(
	params: AlbumRecommendationsSchema,
	user?: User
): Promise<{
	albums: Album[];
	total: number;
}> {
	const { type, limit = 20, page = 1, excludeListened = false } = params;
	const offset = (page - 1) * limit;

	let recommendedAlbums: Album[] = [];

	// Apply different recommendation strategies based on type
	switch (type) {
		case 'featured': {
			// Editorial featured albums (in a real app, this would be curated)
			recommendedAlbums = [...mockAlbums]
				.sort(() => 0.5 - Math.random()) // Simple random selection for mock data
				.slice(0, 50); // Get a larger pool before pagination
			break;
		}

		case 'popular': {
			// Most listened albums
			recommendedAlbums = [...mockAlbums].sort((a, b) => b.play_count - a.play_count);
			break;
		}

		case 'new-releases': {
			// Recently released albums
			recommendedAlbums = [...mockAlbums].sort(
				(a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
			);
			break;
		}

		case 'similar': {
			if (!params.seedAlbumId) {
				throw new Error('seedAlbumId is required for similar recommendations');
			}

			// Find the seed album
			const seedAlbum = mockAlbums.find((album) => album.id === params.seedAlbumId);
			if (!seedAlbum) {
				throw new Error('Seed album not found');
			}

			// Find albums with similar genres or same artist
			recommendedAlbums = mockAlbums
				.filter(
					(album) =>
						album.id !== seedAlbum.id &&
						// Same artist
						(album.artist_id === seedAlbum.artist_id ||
							// Genre overlap
							album.genres.some((genre) => seedAlbum.genres.includes(genre)))
				)
				// Sort by relevance (more genre matches = higher relevance)
				.sort((a, b) => {
					const aGenreMatches = a.genres.filter((genre) => seedAlbum.genres.includes(genre)).length;
					const bGenreMatches = b.genres.filter((genre) => seedAlbum.genres.includes(genre)).length;
					return bGenreMatches - aGenreMatches;
				});
			break;
		}

		case 'for-you': {
			// Personalized recommendations based on user's taste
			// In a real implementation, this would use listening history and preferences

			if (!user) {
				// If no user, return popular albums as fallback
				recommendedAlbums = [...mockAlbums].sort((a, b) => b.play_count - a.play_count);
			} else {
				// For mock data, we'll simulate personalization with random selection
				// weighted towards albums with matching genres a user might like

				// In a real app, this would use collaborative filtering, listening history, etc.
				recommendedAlbums = [...mockAlbums].sort(() => 0.5 - Math.random());
			}
			break;
		}

		case 'by-genre': {
			if (!params.genre) {
				throw new Error('genre is required for genre-based recommendations');
			}

			// Find albums in the requested genre
			recommendedAlbums = mockAlbums
				.filter((album) =>
					album.genres.some((g) => g.toLowerCase() === params.genre!.toLowerCase())
				)
				.sort((a, b) => b.play_count - a.play_count);
			break;
		}

		case 'by-artist': {
			if (!params.artistId) {
				throw new Error('artistId is required for artist-based recommendations');
			}

			// Find the artist
			const artist = mockUsers.find((user) => user.id === params.artistId && user.is_artist);
			if (!artist) {
				throw new Error('Artist not found');
			}

			// Get albums by this artist
			recommendedAlbums = mockAlbums
				.filter((album) => album.artist_id === params.artistId)
				.sort((a, b) => b.play_count - a.play_count);
			break;
		}

		case 'critically-acclaimed': {
			// Albums with high ratings
			recommendedAlbums = [...mockAlbums]
				.filter((album) => album.rating >= 4.0) // Only albums with 4+ star ratings
				.sort((a, b) => b.rating - a.rating);
			break;
		}

		case 'complete-collection': {
			// Albums where user has listened to some tracks but not all
			// In a real app, this would check user's play history

			if (!user) {
				// If no user, return popular albums as fallback
				recommendedAlbums = [...mockAlbums].sort((a, b) => b.play_count - a.play_count);
			} else {
				// For mock data, we'll just use a random selection
				recommendedAlbums = [...mockAlbums].sort(() => 0.5 - Math.random());
			}
			break;
		}
	}

	// Apply additional filters
	if (excludeListened && user) {
		// In a real app, we'd filter out albums the user has already played
		// For mock data, we'll just simulate this with random exclusion
		recommendedAlbums = recommendedAlbums.filter(() => Math.random() > 0.3);
	}

	// Paginate results
	const paginatedAlbums = recommendedAlbums.slice(offset, offset + limit);

	return {
		albums: paginatedAlbums,
		total: recommendedAlbums.length
	};
}
