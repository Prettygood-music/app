
// Types
export interface User {
    id: string;
    username: string;
    wallet_address: string | null;
    display_name: string;
    avatar_url: string | null;
    is_artist: boolean;
  }
  
  
  export interface Track {
    id: string;
    title: string;
    artist_id: string;
    artist_name: string;
    album_id: string | null;
    album_name: string | null;
    cover_url: string | null;
    duration: number; // in seconds
    playback_url: string;
    published_at: string; // ISO date
    genres: string[];
    play_count: number;
  }
  
  export interface Album {
    id: string;
    title: string;
    artist_id: string;
    artist_name: string;
    cover_url: string | null;
    release_date: string; // ISO date
    track_count: number;
    tracks: Track[];
  }
  
  export interface Playlist {
    id: string;
    title: string;
    creator_id: string;
    creator_name: string;
    cover_url: string | null;
    description: string | null;
    is_public: boolean;
    track_count: number;
    tracks: Track[];
    created_at: string; // ISO date
    updated_at: string; // ISO date
  }
  