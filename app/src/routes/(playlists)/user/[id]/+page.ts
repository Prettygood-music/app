import type { PageLoad } from './$types';
import type { User, Playlist, Track } from '$lib/types/player';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const userId = params.id;

	const { supabase, user } = await parent();
	const { data: userProfile, error: err } = await supabase
		.from('users')
		.select('*, playlists!playlists_user_id_fkey(*, tracks(id)), following: artist_followers(count)')
		.eq('id', userId)
		.single();

	if (!userProfile) {
		throw error(404, 'User not found');
	}

	// Is this the current user's profile?
	const isCurrentUser = user && userId === user.id;

	// User's liked tracks
	const likedTracks: Track[] = [
		{
			id: 'track-1',
			title: 'Recursive Rhythms',
			artist_id: 'artist-1',
			artist_name: 'Nina Netcode',
			album_id: 'album-1',
			album_name: 'Async Awakenings',
			cover_url: 'https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80',
			duration: 245,
			playback_url: '#',
			published_at: '2023-05-15',
			genres: ['Electronic', 'Ambient'],
			play_count: 1245678
		},
		{
			id: 'track-2',
			title: 'Binary Sunset',
			artist_id: 'artist-1',
			artist_name: 'Nina Netcode',
			album_id: 'album-1',
			album_name: 'Async Awakenings',
			cover_url: 'https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80',
			duration: 198,
			playback_url: '#',
			published_at: '2023-05-15',
			genres: ['Electronic', 'Downtempo'],
			play_count: 987543
		},
		{
			id: 'track-3',
			title: 'Quantum Leap',
			artist_id: 'artist-1',
			artist_name: 'Nina Netcode',
			album_id: 'album-2',
			album_name: 'Digital Dreams',
			cover_url: 'https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80',
			duration: 274,
			playback_url: '#',
			published_at: '2021-11-03',
			genres: ['Electronic', 'Techno'],
			play_count: 876432
		},
		{
			id: 'track-4',
			title: 'Circuit Dreams',
			artist_id: 'artist-2',
			artist_name: 'Lena Logic',
			album_id: 'album-4',
			album_name: 'Silicon Dreams',
			cover_url: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=300&dpr=2&q=80',
			duration: 313,
			playback_url: '#',
			published_at: '2023-01-15',
			genres: ['Electronic', 'IDM'],
			play_count: 765321
		},
		{
			id: 'track-5',
			title: 'Digital Horizon',
			artist_id: 'artist-3',
			artist_name: 'Beth Binary',
			album_id: 'album-5',
			album_name: 'Quantum State',
			cover_url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&dpr=2&q=80',
			duration: 287,
			playback_url: '#',
			published_at: '2022-08-10',
			genres: ['Electronic', 'Ambient'],
			play_count: 654321
		},
		{
			id: 'track-6',
			title: 'Cyber Serenity',
			artist_id: 'artist-4',
			artist_name: 'Ethan Byte',
			album_id: 'album-6',
			album_name: 'Digital Escape',
			cover_url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&dpr=2&q=80',
			duration: 246,
			playback_url: '#',
			published_at: '2022-03-25',
			genres: ['Electronic', 'Chillout'],
			play_count: 543210
		}
	];

	// User's recently played tracks
	const recentlyPlayed: Track[] = [
		{
			id: 'track-5',
			title: 'Digital Horizon',
			artist_id: 'artist-3',
			artist_name: 'Beth Binary',
			album_id: 'album-5',
			album_name: 'Quantum State',
			cover_url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&dpr=2&q=80',
			duration: 287,
			playback_url: '#',
			published_at: '2022-08-10',
			genres: ['Electronic', 'Ambient'],
			play_count: 654321
		},
		{
			id: 'track-1',
			title: 'Recursive Rhythms',
			artist_id: 'artist-1',
			artist_name: 'Nina Netcode',
			album_id: 'album-1',
			album_name: 'Async Awakenings',
			cover_url: 'https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80',
			duration: 245,
			playback_url: '#',
			published_at: '2023-05-15',
			genres: ['Electronic', 'Ambient'],
			play_count: 1245678
		},
		{
			id: 'track-7',
			title: 'Floating Point',
			artist_id: 'artist-2',
			artist_name: 'Lena Logic',
			album_id: 'album-4',
			album_name: 'Silicon Dreams',
			cover_url: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=300&dpr=2&q=80',
			duration: 294,
			playback_url: '#',
			published_at: '2023-01-15',
			genres: ['Electronic', 'Downtempo'],
			play_count: 321098
		},
		{
			id: 'track-8',
			title: 'Neural Waves',
			artist_id: 'artist-1',
			artist_name: 'Nina Netcode',
			album_id: 'album-2',
			album_name: 'Digital Dreams',
			cover_url: 'https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80',
			duration: 326,
			playback_url: '#',
			published_at: '2021-11-03',
			genres: ['Electronic', 'Ambient'],
			play_count: 210987
		},
		{
			id: 'track-9',
			title: 'Static Memories',
			artist_id: 'artist-3',
			artist_name: 'Beth Binary',
			album_id: 'album-5',
			album_name: 'Quantum State',
			cover_url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&dpr=2&q=80',
			duration: 218,
			playback_url: '#',
			published_at: '2022-08-10',
			genres: ['Electronic', 'Experimental'],
			play_count: 198765
		}
	];

	// User stats and additional info
	const followers = 237;
	const joinDate = '2022-06-15T08:30:00Z';

	// Additional stats for the About tab
	const stats = {
		listeningHours: 483,
		topGenre: 'Electronic',
		recentActivity: [
			{
				type: 'like',
				description: "Liked 'Digital Horizon' by Beth Binary",
				time: '2 hours ago'
			},
			{
				type: 'playlist',
				description: "Created playlist 'Late Night Coding'",
				time: 'Yesterday'
			},
			{
				type: 'play',
				description: "Listened to 'Recursive Rhythms' by Nina Netcode",
				time: 'Yesterday'
			},
			{
				type: 'like',
				description: "Liked 'Quantum Leap' by Nina Netcode",
				time: '3 days ago'
			},
			{
				type: 'playlist',
				description: "Added 3 tracks to 'Coding Focus' playlist",
				time: '1 week ago'
			}
		]
	};

	return {
		user: userProfile,
		isCurrentUser,
		playlists: userProfile?.playlists,
		likedTracks,
		recentlyPlayed,
		followers,
		joinDate,
		stats
	};
};
