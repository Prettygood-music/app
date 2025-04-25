import type { PageLoad } from './$types';
import type { Playlist, Track, User } from '$lib/types/player';

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const playlistId = params.id;
  
  try {
    // In a real implementation, you would make API calls like this:
    // const playlistResponse = await fetch(`/api/playlists/${playlistId}`);
    // const playlist = await playlistResponse.json();
    // 
    // const tracksResponse = await fetch(`/api/playlists/${playlistId}/tracks`);
    // const tracks = await tracksResponse.json();
    //
    // const creatorResponse = await fetch(`/api/users/${playlist.creator_id}`);
    // const creator = await creatorResponse.json();
    //
    // const similarResponse = await fetch(`/api/playlists/similar?playlistId=${playlistId}&limit=5`);
    // const similarPlaylists = await similarResponse.json();
    //
    // In a real app, you would get the current user from the session and check if they are the owner
    // const { user } = await parent();
    // const isOwner = user && user.id === playlist.creator_id;
    
    // For now, we'll use placeholder data
    const currentUser: User = {
      id: "user-1",
      username: "music_lover",
      display_name: "Music Lover",
      wallet_address: "0x123456789abcdef",
      avatar_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&dpr=2&q=80",
      is_artist: false
    };
    
    const creator: User = {
      id: "user-2",
      username: "playlist_creator",
      display_name: "Playlist Creator",
      wallet_address: "0x987654321fedcba",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&dpr=2&q=80",
      is_artist: false
    };
    
    const playlist: Playlist = {
      id: playlistId,
      title: "Electronic Essentials",
      creator_id: creator.id,
      creator_name: creator.display_name,
      cover_url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&dpr=2&q=80",
      description: "The best electronic tracks to get you in the zone. Perfect for coding, studying, or just vibing.",
      is_public: true,
      track_count: 8,
      tracks: [],
      created_at: "2023-02-15T12:00:00Z",
      updated_at: "2023-06-20T15:30:00Z"
    };
    
    // Some playlists don't have cover images, so we'll use a generated gradient
    const playlist2: Playlist = {
      id: "playlist-2",
      title: "Chill Vibes",
      creator_id: creator.id,
      creator_name: creator.display_name,
      cover_url: null,
      description: "Relaxing tunes for unwinding after a long day.",
      is_public: true,
      track_count: 12,
      tracks: [],
      created_at: "2023-01-10T09:15:00Z",
      updated_at: "2023-05-05T18:45:00Z"
    };
    
    // Playlist tracks
    const tracks: Track[] = [
      {
        id: "track-1",
        title: "Recursive Rhythms",
        artist_id: "artist-1",
        artist_name: "Nina Netcode",
        album_id: "album-1",
        album_name: "Async Awakenings",
        cover_url: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
        duration: 245,
        playback_url: "#",
        published_at: "2023-05-15",
        genres: ["Electronic", "Ambient"],
        play_count: 1245678
      },
      {
        id: "track-2",
        title: "Binary Sunset",
        artist_id: "artist-1",
        artist_name: "Nina Netcode",
        album_id: "album-1",
        album_name: "Async Awakenings",
        cover_url: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
        duration: 198,
        playback_url: "#",
        published_at: "2023-05-15",
        genres: ["Electronic", "Downtempo"],
        play_count: 987543
      },
      {
        id: "track-3",
        title: "Quantum Leap",
        artist_id: "artist-1",
        artist_name: "Nina Netcode",
        album_id: "album-2",
        album_name: "Digital Dreams",
        cover_url: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
        duration: 274,
        playback_url: "#",
        published_at: "2021-11-03",
        genres: ["Electronic", "Techno"],
        play_count: 876432
      },
      {
        id: "track-4",
        title: "Circuit Dreams",
        artist_id: "artist-2",
        artist_name: "Lena Logic",
        album_id: "album-4",
        album_name: "Silicon Dreams",
        cover_url: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=300&dpr=2&q=80",
        duration: 313,
        playback_url: "#",
        published_at: "2023-01-15",
        genres: ["Electronic", "IDM"],
        play_count: 765321
      },
      {
        id: "track-5",
        title: "Digital Horizon",
        artist_id: "artist-3",
        artist_name: "Beth Binary",
        album_id: "album-5",
        album_name: "Quantum State",
        cover_url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&dpr=2&q=80",
        duration: 287,
        playback_url: "#",
        published_at: "2022-08-10",
        genres: ["Electronic", "Ambient"],
        play_count: 654321
      },
      {
        id: "track-6",
        title: "Cyber Serenity",
        artist_id: "artist-4",
        artist_name: "Ethan Byte",
        album_id: "album-6",
        album_name: "Digital Escape",
        cover_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&dpr=2&q=80",
        duration: 246,
        playback_url: "#",
        published_at: "2022-03-25",
        genres: ["Electronic", "Chillout"],
        play_count: 543210
      },
      {
        id: "track-7",
        title: "Algorithm Dreams",
        artist_id: "artist-1",
        artist_name: "Nina Netcode",
        album_id: "album-3",
        album_name: "Neural Network",
        cover_url: "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
        duration: 328,
        playback_url: "#",
        published_at: "2020-02-28",
        genres: ["Electronic", "Ambient"],
        play_count: 432109
      },
      {
        id: "track-8",
        title: "Floating Point",
        artist_id: "artist-2",
        artist_name: "Lena Logic",
        album_id: "album-4",
        album_name: "Silicon Dreams",
        cover_url: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=300&dpr=2&q=80",
        duration: 294,
        playback_url: "#",
        published_at: "2023-01-15",
        genres: ["Electronic", "Downtempo"],
        play_count: 321098
      }
    ];
    
    // Similar playlists
    const similarPlaylists: Playlist[] = [
      {
        id: "playlist-2",
        title: "Chill Vibes",
        creator_id: creator.id,
        creator_name: creator.display_name,
        cover_url: null, // No cover, will use gradient
        description: "Relaxing tunes for unwinding.",
        is_public: true,
        track_count: 12,
        tracks: [],
        created_at: "2023-01-10T09:15:00Z",
        updated_at: "2023-05-05T18:45:00Z"
      },
      {
        id: "playlist-3",
        title: "Coding Focus",
        creator_id: "user-3",
        creator_name: "Dev Dynamo",
        cover_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&dpr=2&q=80",
        description: "Stay in the zone while coding.",
        is_public: true,
        track_count: 15,
        tracks: [],
        created_at: "2022-11-20T14:30:00Z",
        updated_at: "2023-04-12T10:15:00Z"
      },
      {
        id: "playlist-4",
        title: "Night Drive",
        creator_id: "user-4",
        creator_name: "Midnight Cruiser",
        cover_url: "https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=300&dpr=2&q=80",
        description: "Perfect soundtrack for late night drives.",
        is_public: true,
        track_count: 10,
        tracks: [],
        created_at: "2023-03-05T22:45:00Z",
        updated_at: "2023-07-01T23:10:00Z"
      },
      {
        id: "playlist-5",
        title: "Morning Boost",
        creator_id: "user-5",
        creator_name: "Early Bird",
        cover_url: null, // No cover, will use gradient
        description: "Energizing tracks to start your day.",
        is_public: true,
        track_count: 8,
        tracks: [],
        created_at: "2023-02-18T06:20:00Z",
        updated_at: "2023-06-10T07:30:00Z"
      },
      {
        id: "playlist-6",
        title: "Workout Mix",
        creator_id: "user-6",
        creator_name: "Fitness Fanatic",
        cover_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&dpr=2&q=80",
        description: "High-energy tracks for your workout routine.",
        is_public: true,
        track_count: 14,
        tracks: [],
        created_at: "2023-01-25T16:50:00Z",
        updated_at: "2023-05-30T17:20:00Z"
      }
    ];
    
    // Simulate checking if the current user is the playlist creator
    const isOwner = currentUser.id === playlist.creator_id;
    
    return {
      playlist,
      creator,
      tracks,
      isOwner,
      similarPlaylists
    };
  } catch (error) {
    console.error('Error loading playlist page:', error);
    return {
      playlist: null,
      creator: null,
      tracks: [],
      isOwner: false,
      similarPlaylists: []
    };
  }
};