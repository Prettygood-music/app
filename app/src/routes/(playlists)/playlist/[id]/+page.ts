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

	const { data: similarPlaylists } = await supabase
		.from('playlists')
		.select('*, tracks(*), creator:users!playlists_user_id_fkey(*)')
		.neq('id', playlistId)
		.limit(5);

	// For now, we'll use placeholder data
	const currentUser: User = {
		id: 'user-1',
		username: 'music_lover',
		display_name: 'Music Lover',
		wallet_address: '0x123456789abcdef',
		avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&dpr=2&q=80',
		is_artist: false
	};

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
