import type { PageLoad } from './$types';
import type { Artist, Album, Track } from '$lib/types/player';

export const load: PageLoad = async ({ params, fetch }) => {
  const artistId = params.id;
  
  try {
    // In a real implementation, you would make API calls like this:
    // const [artistResponse, albumsResponse, tracksResponse] = await Promise.all([
    //   fetch(`/api/artists/${artistId}`),
    //   fetch(`/api/artists/${artistId}/albums`),
    //   fetch(`/api/artists/${artistId}/tracks?limit=5`)
    // ]);
    
    // const artist = await artistResponse.json();
    // const albums = await albumsResponse.json();
    // const topTracks = await tracksResponse.json();
    
    // For now, we'll use placeholder data
    const artist: Artist = {
      id: artistId,
      artist_name: "Nina Netcode",
      bio: "Nina Netcode is an electronic music producer known for her innovative sound design and immersive soundscapes. Blending elements of ambient, techno, and glitch, her music creates a unique digital atmosphere that reflects her background in computer science and audio engineering.",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&dpr=2&q=80",
      cover_url: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=1200&dpr=2&q=80",
      socials: {
        website: "https://ninanetcode.com",
        twitter: "ninanetcode",
        instagram: "ninanetcode"
      }
    };
    
    const albums: Album[] = [
      {
        id: "album-1",
        title: "Async Awakenings",
        artist_id: artist.id,
        artist_name: artist.artist_name,
        cover_url: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
        release_date: "2023-05-15",
        track_count: 12,
        tracks: []
      },
      {
        id: "album-2",
        title: "Digital Dreams",
        artist_id: artist.id,
        artist_name: artist.artist_name,
        cover_url: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
        release_date: "2021-11-03",
        track_count: 9,
        tracks: []
      },
      {
        id: "album-3",
        title: "Neural Network",
        artist_id: artist.id,
        artist_name: artist.artist_name,
        cover_url: "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
        release_date: "2020-02-28",
        track_count: 8,
        tracks: []
      }
    ];
    
    // Simulate fetching the top tracks
    const topTracks: Track[] = [
      {
        id: "track-1",
        title: "Recursive Rhythms",
        artist_id: artist.id,
        artist_name: artist.artist_name,
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
        artist_id: artist.id,
        artist_name: artist.artist_name,
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
        artist_id: artist.id,
        artist_name: artist.artist_name,
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
        title: "Algorithmic Ascension",
        artist_id: artist.id,
        artist_name: artist.artist_name,
        album_id: "album-2",
        album_name: "Digital Dreams",
        cover_url: "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
        duration: 323,
        playback_url: "#",
        published_at: "2021-11-03",
        genres: ["Electronic", "IDM"],
        play_count: 765321
      },
      {
        id: "track-5",
        title: "Synaptic Symphony",
        artist_id: artist.id,
        artist_name: artist.artist_name,
        album_id: "album-3",
        album_name: "Neural Network",
        cover_url: "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
        duration: 287,
        playback_url: "#",
        published_at: "2020-02-28",
        genres: ["Electronic", "Glitch"],
        play_count: 654321
      }
    ];
    
    // Return all the data needed for the page
    return {
      artist,
      albums,
      topTracks,
      similarArtists: [
        {
          id: "artist-2",
          artist_name: "Lena Logic",
          avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&dpr=2&q=80"
        },
        {
          id: "artist-3",
          artist_name: "Beth Binary",
          avatar_url: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&dpr=2&q=80"
        },
        {
          id: "artist-4",
          artist_name: "Ethan Byte",
          avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&dpr=2&q=80"
        },
        {
          id: "artist-5",
          artist_name: "Data Dave",
          avatar_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&dpr=2&q=80"
        }
      ]
    };
  } catch (error) {
    console.error('Error loading artist page:', error);
    return {
      artist: null,
      albums: [],
      topTracks: [],
      similarArtists: []
    };
  }
};