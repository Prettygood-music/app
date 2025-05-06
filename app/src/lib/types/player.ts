import type { Database } from '@prettygood/database';

export type Track = Database['public']['Tables']['tracks']['Row'];
export type Playlist = Database['public']['Tables']['playlists']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type TrackWithDetails = Database['public']['Views']['tracks_with_details']['Row'];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
/*
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
  }*/

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
