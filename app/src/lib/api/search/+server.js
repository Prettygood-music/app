import { createClient } from '@prettygood/database';
import { json } from '@sveltejs/kit';

/**
 * Search API endpoint
 * Handles search queries with filtering by genre and other parameters
 */
export async function GET({ url, fetch }) {
  try {
    // Get query parameters
    const query = url.searchParams.get('q') || '';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const type = url.searchParams.get('type') || 'all'; // 'tracks', 'artists', 'albums' or 'all'
    
    // Get genre filters (comma-separated list of genre IDs)
    const genreParam = url.searchParams.get('genres');
    const genreIds = genreParam ? genreParam.split(',') : [];
    
    // Initialize PostgREST client
    const postgrestUrl = import.meta.env.VITE_POSTGREST_URL;
    const db = createClient(postgrestUrl);
    
    // Prepare search results object
    let results = {
      tracks: [],
      artists: [],
      albums: [],
      playlists: []
    };
    
    // If query is empty and no genres specified, return empty results
    if (!query && genreIds.length === 0) {
      return json({ results, query });
    }
    
    // Build search queries based on type
    const promises = [];
    
    // Search tracks
    if (type === 'all' || type === 'tracks') {
      const tracksPromise = async () => {
        // Start building the query
        let trackQuery = db
          .from('tracks')
          .select(`
            id,
            title,
            artist_id,
            album_id,
            duration,
            cover_url,
            release_date,
            artists (name),
            albums (title)
          `);
        
        // Add search condition if query is not empty
        if (query) {
          trackQuery = trackQuery.ilike('title', `%${query}%`);
        }
        
        // Add genre filter if specified
        if (genreIds.length > 0) {
          // Get tracks that belong to any of the specified genres
          const { data: trackGenres, error: genreError } = await db
            .from('track_genres')
            .select('track_id')
            .in('genre_id', genreIds);
          
          if (genreError) throw genreError;
          
          if (trackGenres && trackGenres.length > 0) {
            const trackIds = trackGenres.map(tg => tg.track_id);
            trackQuery = trackQuery.in('id', trackIds);
          } else {
            // If no tracks found for these genres, return empty result
            return [];
          }
        }
        
        // Finalize the query with limit and offset
        const { data, error } = await trackQuery
          .limit(limit)
          .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        return data || [];
      };
      
      promises.push(tracksPromise().then(data => results.tracks = data));
    }
    
    // Search artists
    if (type === 'all' || type === 'artists') {
      const artistsPromise = async () => {
        // Start building the query
        let artistQuery = db
          .from('artists')
          .select(`
            id,
            name,
            profile_image_url,
            verified
          `);
        
        // Add search condition if query is not empty
        if (query) {
          artistQuery = artistQuery.ilike('name', `%${query}%`);
        }
        
        // Add genre filter if specified
        if (genreIds.length > 0) {
          // Get artists that belong to any of the specified genres
          const { data: artistGenres, error: genreError } = await db
            .from('artist_genres')
            .select('artist_id')
            .in('genre_id', genreIds);
          
          if (genreError) throw genreError;
          
          if (artistGenres && artistGenres.length > 0) {
            const artistIds = artistGenres.map(ag => ag.artist_id);
            artistQuery = artistQuery.in('id', artistIds);
          } else {
            // If no artists found for these genres, return empty result
            return [];
          }
        }
        
        // Finalize the query with limit and offset
        const { data, error } = await artistQuery
          .limit(limit)
          .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        return data || [];
      };
      
      promises.push(artistsPromise().then(data => results.artists = data));
    }
    
    // Search albums
    if (type === 'all' || type === 'albums') {
      const albumsPromise = async () => {
        // Start building the query
        let albumQuery = db
          .from('albums')
          .select(`
            id,
            title,
            artist_id,
            cover_url,
            release_date,
            artists (name)
          `);
        
        // Add search condition if query is not empty
        if (query) {
          albumQuery = albumQuery.ilike('title', `%${query}%`);
        }
        
        // Add genre filter if specified
        if (genreIds.length > 0) {
          // Get albums that belong to any of the specified genres
          const { data: albumGenres, error: genreError } = await db
            .from('album_genres')
            .select('album_id')
            .in('genre_id', genreIds);
          
          if (genreError) throw genreError;
          
          if (albumGenres && albumGenres.length > 0) {
            const albumIds = albumGenres.map(ag => ag.album_id);
            albumQuery = albumQuery.in('id', albumIds);
          } else {
            // If no albums found for these genres, return empty result
            return [];
          }
        }
        
        // Finalize the query with limit and offset
        const { data, error } = await albumQuery
          .limit(limit)
          .range(offset, offset + limit - 1);
        
        if (error) throw error;
        
        return data || [];
      };
      
      promises.push(albumsPromise().then(data => results.albums = data));
    }
    
    // Execute all search queries in parallel
    await Promise.all(promises);
    
    // Return the results
    return json({
      results,
      query,
      filters: {
        genres: genreIds
      }
    });
  } catch (error) {
    console.error('Error in search API:', error);
    
    return json(
      {
        error: 'Search failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
