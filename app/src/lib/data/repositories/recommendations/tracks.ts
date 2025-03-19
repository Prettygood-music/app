// server/src/repositories/recommendations.ts
import type { Track, User } from '$lib/types';
import { mockTracks, mockUsers } from '$lib/data/mocks';
import type { TrackRecommendationsParams } from '$lib/api/recommendations/tracks/schema';

/**
 * Recommendations repository for getting various types of content recommendations
 */
export class RecommendationsRepository {
	/**
	 * Get track recommendations based on provided parameters
	 */
	async getTrackRecommendations(
		params: TrackRecommendationsParams,
		user?: User
	): Promise<{
		tracks: Track[];
		total: number;
	}> {
		const { type, limit = 20, page = 1, excludePlayed = false } = params;
		const offset = (page - 1) * limit;

		let recommendedTracks: Track[] = [];

		// Apply different recommendation strategies based on type
		switch (type) {
			case 'featured': {
				// Editorial featured tracks (in a real app, this would be curated)
				recommendedTracks = [...mockTracks]
					.sort(() => 0.5 - Math.random()) // Simple random selection for mock data
					.slice(0, 50); // Get a larger pool before pagination
				break;
			}

			case 'popular': {
				// Most played tracks
				recommendedTracks = [...mockTracks].sort((a, b) => b.play_count - a.play_count);
				break;
			}

			case 'new-releases': {
				// Recently released tracks
				recommendedTracks = [...mockTracks].sort(
					(a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
				);
				break;
			}

			case 'similar': {
				if (!params.seedTrackId) {
					throw new Error('seedTrackId is required for similar recommendations');
				}

				// Find the seed track
				const seedTrack = mockTracks.find((track) => track.id === params.seedTrackId);
				if (!seedTrack) {
					throw new Error('Seed track not found');
				}

				// Find tracks with similar genres, same artist, or same album
				recommendedTracks = mockTracks
					.filter(
						(track) =>
							track.id !== seedTrack.id &&
							// Same artist
							(track.artist_id === seedTrack.artist_id ||
								// Same album
								(track.album_id && track.album_id === seedTrack.album_id) ||
								// Genre overlap
								track.genres.some((genre) => seedTrack.genres.includes(genre)))
					)
					// Sort by relevance (more genre matches = higher relevance)
					.sort((a, b) => {
						const aGenreMatches = a.genres.filter((genre) =>
							seedTrack.genres.includes(genre)
						).length;
						const bGenreMatches = b.genres.filter((genre) =>
							seedTrack.genres.includes(genre)
						).length;
						return bGenreMatches - aGenreMatches;
					});
				break;
			}

			case 'for-you': {
				// Personalized recommendations based on user's taste
				// In a real implementation, this would use listening history and preferences

				if (!user) {
					// If no user, return popular tracks as fallback
					recommendedTracks = [...mockTracks].sort((a, b) => b.play_count - a.play_count);
				} else {
					// For mock data, we'll simulate personalization with random selection
					// weighted towards tracks with matching genres a user might like

					// In a real app, this would use collaborative filtering, listening history, etc.
					recommendedTracks = [...mockTracks].sort(() => 0.5 - Math.random());
				}
				break;
			}

			case 'by-genre': {
				if (!params.genre) {
					throw new Error('genre is required for genre-based recommendations');
				}

				// Find tracks in the requested genre
				recommendedTracks = mockTracks
					.filter((track) =>
						track.genres.some((g) => g.toLowerCase() === params.genre!.toLowerCase())
					)
					.sort((a, b) => b.play_count - a.play_count);
				break;
			}

			case 'by-mood': {
				if (!params.mood) {
					throw new Error('mood is required for mood-based recommendations');
				}

				// In a real app, tracks would have mood tags or analysis
				// For mock data, we'll map certain genres to moods as a simple approximation
				const moodGenreMap: Record<string, string[]> = {
					energetic: ['Electronic', 'Bass', 'Dubstep'],
					chill: ['Lo-Fi', 'Ambient', 'Chillwave'],
					focus: ['Ambient', 'Downtempo', 'Melodic'],
					upbeat: ['Electronic', 'Synthwave'],
					melancholy: ['Ambient', 'Cinematic']
				};

				const genresForMood = moodGenreMap[params.mood.toLowerCase()] || [];

				if (genresForMood.length === 0) {
					// Unknown mood
					recommendedTracks = [];
				} else {
					recommendedTracks = mockTracks
						.filter((track) => track.genres.some((g) => genresForMood.includes(g)))
						.sort((a, b) => b.play_count - a.play_count);
				}
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

				// Get tracks by this artist
				recommendedTracks = mockTracks
					.filter((track) => track.artist_id === params.artistId)
					.sort((a, b) => b.play_count - a.play_count);
				break;
			}
		}

		// Apply additional filters
		if (excludePlayed && user) {
			// In a real app, we'd filter out tracks the user has already played
			// For mock data, we'll just simulate this with random exclusion
			recommendedTracks = recommendedTracks.filter(() => Math.random() > 0.3);
		}

		// Paginate results
		const paginatedTracks = recommendedTracks.slice(offset, offset + limit);

		return {
			tracks: paginatedTracks,
			total: recommendedTracks.length
		};
	}
}

export const recommendationsRepository = new RecommendationsRepository();
