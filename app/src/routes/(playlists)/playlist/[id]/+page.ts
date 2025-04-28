import type { PageLoad } from './$types';
import type { Playlist, Track, User } from '$lib/types/player';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch, parent }) => {
	const { supabase } = await parent();
	const playlistId = params.id;

	const { data: playlist, error: err } = await supabase
		.from('playlists')
		.select('*, tracks(*), creator:users!playlists_user_id_fkey(*)')
		.eq('id', playlistId)
		.single();

	if (err) {
		console.error('Error fetching playlist:', err);
		error(404, 'Playlist not found');
	}

	const creator = playlist.creator;

	// For now, we'll use placeholder data
	const currentUser: User = {
		id: 'user-1',
		username: 'music_lover',
		display_name: 'Music Lover',
		wallet_address: '0x123456789abcdef',
		avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&dpr=2&q=80',
		is_artist: false
	};

  
	// Similar playlists
	const similarPlaylists: Playlist[] = [
		{
			id: 'playlist-2',
			title: 'Chill Vibes',
			creator_id: creator.id,
			creator_name: creator.display_name || creator.username,
			cover_url: null, // No cover, will use gradient
			description: 'Relaxing tunes for unwinding.',
			is_public: true,
			track_count: 12,
			tracks: [],
			created_at: '2023-01-10T09:15:00Z',
			updated_at: '2023-05-05T18:45:00Z'
		},
		{
			id: 'playlist-3',
			title: 'Coding Focus',
			creator_id: 'user-3',
			creator_name: 'Dev Dynamo',
			cover_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&dpr=2&q=80',
			description: 'Stay in the zone while coding.',
			is_public: true,
			track_count: 15,
			tracks: [],
			created_at: '2022-11-20T14:30:00Z',
			updated_at: '2023-04-12T10:15:00Z'
		},
		{
			id: 'playlist-4',
			title: 'Night Drive',
			creator_id: 'user-4',
			creator_name: 'Midnight Cruiser',
			cover_url: 'https://images.unsplash.com/photo-1566228015668-4c45dbc4e2f5?w=300&dpr=2&q=80',
			description: 'Perfect soundtrack for late night drives.',
			is_public: true,
			track_count: 10,
			tracks: [],
			created_at: '2023-03-05T22:45:00Z',
			updated_at: '2023-07-01T23:10:00Z'
		},
		{
			id: 'playlist-5',
			title: 'Morning Boost',
			creator_id: 'user-5',
			creator_name: 'Early Bird',
			cover_url: null, // No cover, will use gradient
			description: 'Energizing tracks to start your day.',
			is_public: true,
			track_count: 8,
			tracks: [],
			created_at: '2023-02-18T06:20:00Z',
			updated_at: '2023-06-10T07:30:00Z'
		},
		{
			id: 'playlist-6',
			title: 'Workout Mix',
			creator_id: 'user-6',
			creator_name: 'Fitness Fanatic',
			cover_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&dpr=2&q=80',
			description: 'High-energy tracks for your workout routine.',
			is_public: true,
			track_count: 14,
			tracks: [],
			created_at: '2023-01-25T16:50:00Z',
			updated_at: '2023-05-30T17:20:00Z'
		}
	];

	// Simulate checking if the current user is the playlist creator
	const isOwner = currentUser.id === playlist.creator.id;

	return {
		playlist,
		creator: playlist.creator,
		tracks: playlist.tracks,
		isOwner,
		similarPlaylists
	};
};
