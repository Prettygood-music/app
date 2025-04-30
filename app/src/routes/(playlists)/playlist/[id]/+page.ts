import type { PageLoad } from './$types';
import type { Playlist, Track, User } from '$lib/types/player';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, parent }) => {
	const { supabase, user } = await parent();
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

	const { data: trackDetails } = await supabase
		.from('tracks_with_details')
		.select('*')
		.in(
			'id',
			playlist.tracks.map((track: Track) => track.id)
		);

	const creator = playlist.creator;

	const { data: similarPlaylists } = await supabase
		.from('playlists')
		.select('*, tracks(*), creator:users!playlists_user_id_fkey(*)')
		.neq('id', playlistId)
		.limit(5);

	// Simulate checking if the current user is the playlist creator
	const isOwner = user?.id === playlist.creator.id;

	return {
		playlist: playlist,
		tracks: trackDetails || [],
		creator: playlist.creator,
		// tracks: playlist.tracks,
		isOwner,
		similarPlaylists
	};
};
