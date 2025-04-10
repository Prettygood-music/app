/**
 * Genres Service - Core implementation
 */

import type {
	Genre,
	GenreWithContent,
	GenreTrack,
	GenreArtist,
	GenreAlbum,
	GenreContentParams,
	PopularityPeriod
} from './types';
import { getClient, getDateRange, generateRandomColor, slugify } from './utils';

/**
 * Get all available genres
 */
export const getAllGenres = async (): Promise<Genre[]> => {
	const db = getClient();

	try {
		// First, get all genres
		const { data, error } = await db.from('genres').select('*').order('name');

		if (error) throw error;

		if (!data) return [];

		// Enhance genres with additional information
		const enhancedGenres = data.map((genre) => ({
			...genre,
			color: genre.color || generateRandomColor(),
			slug: genre.slug || slugify(genre.name)
		}));

		return enhancedGenres;
	} catch (error) {
		console.error('Error fetching genres:', error);
		throw error;
	}
};

/**
 * Get genre information by ID
 */
export const getGenreById = async (id: string): Promise<Genre | null> => {
	const db = getClient();

	try {
		const { data, error } = await db.from('genres').select('*').eq('id', id).single();

		if (error) throw error;

		if (!data) return null;

		// Enhance genre with additional information
		return {
			...data,
			color: data.color || generateRandomColor(),
			slug: data.slug || slugify(data.name)
		};
	} catch (error) {
		console.error(`Error fetching genre with ID ${id}:`, error);
		throw error;
	}
};

/**
 * Get genre information by slug
 */
export const getGenreBySlug = async (slug: string): Promise<Genre | null> => {
	const db = getClient();

	try {
		// First try to find by slug field
		const { data, error } = await db.from('genres').select('*').eq('slug', slug).maybeSingle();

		if (error) throw error;

		if (data) {
			return {
				...data,
				color: data.color || generateRandomColor(),
				slug: data.slug || slugify(data.name)
			};
		}

		// If not found, try to match by slugifying the name
		const { data: allGenres, error: allGenresError } = await db.from('genres').select('*');

		if (allGenresError) throw allGenresError;

		const matchedGenre = allGenres?.find((g) => slugify(g.name) === slug);

		if (!matchedGenre) return null;

		return {
			...matchedGenre,
			color: matchedGenre.color || generateRandomColor(),
			slug: matchedGenre.slug || slugify(matchedGenre.name)
		};
	} catch (error) {
		console.error(`Error fetching genre with slug ${slug}:`, error);
		throw error;
	}
};

/**
 * Get tracks by genre ID
 */
export const getTracksByGenre = async (genreId: string, params: GenreContentParams = {}) => {
	const db = getClient();
	const { limit = 50, offset = 0, sortBy = 'play_count', sortOrder = 'desc' } = params;

	try {
		// Get tracks in this genre
		const { data, error } = await db
			.from('track_genres')
			.select(
				`
        tracks (
          id,
          title,
          artist_id,
          album_id,
          duration,
          cover_url,
          release_date,
          track_play_counts (play_count),
          artists (name: artist_name),
          albums (title)
        )
      `
			)
			.eq('genre_id', genreId)
			.order(sortBy, {
				ascending: sortOrder === 'asc',
				referencedTable: 'tracks.track_play_counts'
			})
			.range(offset, offset + limit - 1);

		if (error) throw error;

		if (!data) return [];

		// Transform data to expected format
		return data.map((item) => {
			const track = item.tracks;
			return {
				id: track.id,
				title: track.title,
				artist_id: track.artist_id,
				artist_name: track.artists.name || 'Unknown Artist',
				album_id: track.album_id,
				album_title: track.albums?.title || undefined,
				duration: track.duration,
				cover_url: track.cover_url,
				release_date: track.release_date,
				play_count: track.track_play_counts.at(0)?.play_count || 0
			};
		});
	} catch (error) {
		console.error(`Error fetching tracks for genre ${genreId}:`, error);
		throw error;
	}
};

/**
 * Get artists by genre ID
 */
export const getArtistsByGenre = async (
	genreId: string,
	params: GenreContentParams = {}
): Promise<GenreArtist[]> => {
	const db = getClient();
	const { limit = 20, offset = 0, sortBy = 'artist_name', sortOrder = 'asc' } = params;

	try {
		// Get artists in this genre
		const { data, error } = await db
			.from('artist_genres')
			.select(
				`
        artists (
          id,
          name: artist_name,
          verified,
          follower_count: artist_followers(count())
          )
          `
			)
			//profile_image_url,
			.eq('genre_id', genreId)
			.order(sortBy, { ascending: sortOrder === 'asc', referencedTable: 'artists' })
			.range(offset, offset + limit - 1);

		if (error) throw error;

		if (!data) return [];

		// Transform data to expected format
		return data.map((item) => {
			const artist = item.artists;
			return {
				id: artist.id,
				name: artist.name,
				profile_image_url: '', //artist.profile_image_url,
				verified: artist.verified || false,
				follower_count: artist.follower_count.at(0)?.count || 0
			};
		});
	} catch (error) {
		console.error(`Error fetching artists for genre ${genreId}:`, error);
		throw error;
	}
};

/**
 * Get albums by genre ID
 */
export const getAlbumsByGenre = async (genreId: string, params: GenreContentParams = {}) => {
	const db = getClient();
	const { limit = 20, offset = 0, sortBy = 'release_date', sortOrder = 'desc' } = params;

	try {
		// Get albums in this genre
		const { data, error } = await db
			.from('album_genres')
			.select(
				`
        albums (
          id,
          title,
          artist_id,
          cover_url,
          release_date,
          artist: artists ( name: artist_name),
          track_count: count()
        )
      `
			)
			.eq('genre_id', genreId)
			.order(sortBy, { ascending: sortOrder === 'asc', referencedTable: 'albums' })
			.range(offset, offset + limit - 1);

		if (error) throw error;

		if (!data) return [];

		// Transform data to expected format
		return data.map((item) => {
			const album = item.albums;
			return {
				id: album.id,
				title: album.title,
				artist_id: album.artist_id,
				artist_name: album.artist.name || 'Unknown Artist',
				cover_url: album.cover_url,
				release_date: album.release_date,
				track_count: album?.track_count || 0
			};
		});
	} catch (error) {
		console.error(`Error fetching albums for genre ${genreId}:`, error);
		throw error;
	}
};

/**
 * Get full genre details with associated content
 */
export const getGenreWithContent = async (
	genreId: string,
	trackParams: GenreContentParams = {},
	artistParams: GenreContentParams = {},
	albumParams: GenreContentParams = {}
): Promise<GenreWithContent | null> => {
	try {
		// Get genre information
		const genre = await getGenreById(genreId);
		if (!genre) return null;

		// Get tracks, artists, and albums in parallel
		const [tracks, artists, albums] = await Promise.all([
			getTracksByGenre(genreId, trackParams),
			getArtistsByGenre(genreId, artistParams),
			getAlbumsByGenre(genreId, albumParams)
		]);

		// Get related genres (optional, can be null if not available)
		let relatedGenres: Genre[] | undefined;
		try {
			relatedGenres = await getRelatedGenres(genreId);
		} catch (error) {
			console.error(`Error fetching related genres for ${genreId}:`, error);
			// Continue without related genres
		}

		return {
			genre,
			tracks,
			artists,
			albums,
			relatedGenres
		};
	} catch (error) {
		console.error(`Error fetching genre content for ${genreId}:`, error);
		throw error;
	}
};

/**
 * Get related genres for a given genre ID
 */
export const getRelatedGenres = async (genreId: string, limit: number = 5): Promise<Genre[]> => {
	const db = getClient();

	try {
		// Get related genres using an RPC function
		// This assumes there's a database function called get_related_genres
		const { data, error } = await db.rpc('get_related_genres', {
			p_genre_id: genreId,
			p_limit: limit
		});

		if (error) throw error;

		if (!data) return [];

		// Enhance genres with additional information
		return data.map((genre: Genre) => ({
			...genre,
			color: genre.color || generateRandomColor(),
			slug: genre.slug || slugify(genre.name)
		}));
	} catch (error) {
		console.error(`Error fetching related genres for ${genreId}:`, error);

		// Fallback: if the RPC function doesn't exist, return empty array
		// In a real implementation, you might want to implement an alternative algorithm
		return [];
	}
};

/**
 * Get popular genres based on track plays in a given period
 */
export const getPopularGenres = async (
	period: PopularityPeriod = 'month',
	limit: number = 10
): Promise<Genre[]> => {
	const db = getClient();
	const { startDate, endDate } = getDateRange(period);

	try {
		// Get popular genres using an RPC function
		// This assumes there's a database function called get_popular_genres
		const { data, error } = await db.rpc('get_popular_genres', {
			p_start_date: startDate,
			p_end_date: endDate,
			p_limit: limit
		});

		if (error) throw error;

		if (!data) return [];

		// Enhance genres with additional information
		return data.map((genre: Genre) => ({
			...genre,
			color: genre.color || generateRandomColor(),
			slug: genre.slug || slugify(genre.name)
		}));
	} catch (error) {
		console.error('Error fetching popular genres:', error);

		// Fallback: if the RPC function doesn't exist, return basic genres
		try {
			const { data, error } = await db.from('genres').select('*').order('name').limit(limit);

			if (error) throw error;

			if (!data) return [];

			return data.map((genre) => ({
				...genre,
				color: genre.color || generateRandomColor(),
				slug: genre.slug || slugify(genre.name)
			}));
		} catch (fallbackError) {
			console.error('Error in fallback genre fetch:', fallbackError);
			return [];
		}
	}
};

/**
 * Search for genres by name
 */
export const searchGenres = async (query: string, limit: number = 10): Promise<Genre[]> => {
	const db = getClient();

	try {
		// Search genres using pattern matching
		const { data, error } = await db
			.from('genres')
			.select('*')
			.ilike('name', `%${query}%`)
			.order('name')
			.limit(limit);

		if (error) throw error;

		if (!data) return [];

		// Enhance genres with additional information
		return data.map((genre) => ({
			...genre,
			color: genre.color || generateRandomColor(),
			slug: genre.slug || slugify(genre.name)
		}));
	} catch (error) {
		console.error(`Error searching genres with query "${query}":`, error);
		throw error;
	}
};

/**
 * Get content counts for a genre (tracks, artists, albums)
 */
export const getGenreContentCounts = async (
	genreId: string
): Promise<{
	trackCount: number;
	artistCount: number;
	albumCount: number;
}> => {
	const db = getClient();

	try {
		// Get counts using parallel queries
		const [tracksResponse, artistsResponse, albumsResponse] = await Promise.all([
			db.from('track_genres').select('*', { count: 'exact', head: true }).eq('genre_id', genreId),
			db.from('artist_genres').select('*', { count: 'exact', head: true }).eq('genre_id', genreId),
			db.from('album_genres').select('*', { count: 'exact', head: true }).eq('genre_id', genreId)
		]);

		if (tracksResponse.error) throw tracksResponse.error;
		if (artistsResponse.error) throw artistsResponse.error;
		if (albumsResponse.error) throw albumsResponse.error;

		return {
			trackCount: tracksResponse.count || 0,
			artistCount: artistsResponse.count || 0,
			albumCount: albumsResponse.count || 0
		};
	} catch (error) {
		console.error(`Error fetching genre content counts for ${genreId}:`, error);
		throw error;
	}
};
