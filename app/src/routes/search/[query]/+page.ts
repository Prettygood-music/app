import { databaseClient } from '$lib/databaseClient';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
  const query = params?.query || "";
  
  if (!query) {
    throw error(400, 'Search query is required');
  }

  try {
    // Search for tracks
    const { data: tracks, error: tracksError } = await databaseClient
      .from('tracks')
      .select('*, artist:artists(id, artist_name)')
      .or(`title.ilike.%${query}%, genre.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (tracksError) {
      console.error('Error fetching tracks:', tracksError);
    }

    // Search for artists
    const { data: artists, error: artistsError } = await databaseClient
      .from('artists')
      .select('*')
      .or(`artist_name.ilike.%${query}%, genre.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (artistsError) {
      console.error('Error fetching artists:', artistsError);
    }

    // Search for albums
    const { data: albums, error: albumsError } = await databaseClient
      .from('albums')
      .select('*, artist:artists(id, artist_name)')
      .or(`title.ilike.%${query}%, genre.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (albumsError) {
      console.error('Error fetching albums:', albumsError);
    }

    // Record search query if available
    try {
      await databaseClient.rpc('record_search', { query });
    } catch (recordError) {
      // Ignore errors in recording search, this is non-critical
      console.log('Error recording search:', recordError);
    }

    return {
      query,
      results: {
        tracks: tracks || [],
        artists: artists || [],
        albums: albums || []
      }
    };
  } catch (e) {
    console.error('Search error:', e);
    throw error(500, 'Failed to search, please try again later');
  }
};
