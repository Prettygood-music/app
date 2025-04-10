/**
 * Types for the Genres Service
 */

/**
 * Basic Genre information
 */
export interface Genre {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
  color?: string;
  popularity?: number;
  track_count?: number;
  artist_count?: number;
}

/**
 * Simplified Track information for genre listings
 */
export interface GenreTrack {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  album_id?: string;
  album_title?: string;
  duration: number;
  cover_url?: string;
  release_date?: string;
  play_count?: number;
}

/**
 * Simplified Artist information for genre listings
 */
export interface GenreArtist {
  id: string;
  name: string;
  profile_image_url?: string;
  verified: boolean;
  follower_count?: number;
}

/**
 * Simplified Album information for genre listings
 */
export interface GenreAlbum {
  id: string;
  title: string;
  artist_id: string;
  artist_name: string;
  cover_url?: string;
  release_date?: string;
  track_count: number;
}

/**
 * Genre with associated content
 */
export interface GenreWithContent {
  genre: Genre;
  tracks: GenreTrack[];
  artists: GenreArtist[];
  albums: GenreAlbum[];
  relatedGenres?: Genre[];
}

/**
 * Parameters for genre content queries
 */
export interface GenreContentParams {
  limit?: number;
  offset?: number;
  sortBy?: 'popularity' | 'release_date' | 'name' | 'play_count';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Time period for popularity metrics
 */
export type PopularityPeriod = 'day' | 'week' | 'month' | 'year' | 'all';
