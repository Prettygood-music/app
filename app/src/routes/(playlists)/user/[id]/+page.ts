import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Achievement } from './types';

export const load: PageLoad = async ({ params, parent }) => {
	const userId = params.id;

	const { supabase, user } = await parent();

	if (!user) {
		error(404, 'User was not found');
	}

	// TODO: query owned achievements
	const { data: userProfile, error: err } = await supabase
		.from('users')
		.select(
			'*, playlists!playlists_user_id_fkey(*, tracks(id)), following: artist_followers(count), play_history(tracks(*)), track_likes(tracks(*))'
		)
		.eq('id', userId)
		.order('played_at', { ascending: false, referencedTable: 'play_history' })

		.limit(5, { referencedTable: 'play_history' })
		.single();

	const { data: ownedAchievements } = await supabase
		.from('user_achievement_details')
		.select('*')
		.eq('user_id', user.id);

	const { data: achievements } = await supabase.from('achievements').select('*');

	if (!userProfile) {
		throw error(404, 'User not found');
	}
	const recenlyPlayedTracks = userProfile.play_history.flatMap((track) => track.tracks);
	const recentlyPlayedTracksIDs = [...new Set(recenlyPlayedTracks.map((t) => t.id))];
	/*
	const uniqueRecentlyPlayedTracks = recentlyPlayedTracksIDs.map((id) =>
		recenlyPlayedTracks.find((t) => t.id === id)
	);*/

	const { data: uniqueRecentlyPlayedTracks } = await supabase
		.from('tracks_with_details')
		.select('*')
		.in('id', recentlyPlayedTracksIDs);

	// Is this the current user's profile?
	const isCurrentUser = user && userId === user.id;

	// User's liked tracks
	const { data: likedTracksID } = await supabase
		.from('track_likes')
		.select('track_id')
		.eq('user_id', userId);

	const { data: likedTracks } = await supabase
		.from('tracks_with_details')
		.select('*')
		.in(
			'id',
			(likedTracksID || []).map((track) => track.track_id)
		);

	// User stats and additional info
	const followers = 0;
	const joinDate = userProfile.created_at;

	// Additional stats for the About tab
	const stats = {
		listeningHours: 0,
		topGenre: 'Unknown',
		recentActivity: [
			/*
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
			}*/
		]
	};

	return {
		user: userProfile,
		isCurrentUser,
		latestTracks: uniqueRecentlyPlayedTracks || [],
		playlists: userProfile?.playlists,
		likedTracks: likedTracks || [],
		followers,
		joinDate,
		stats,
		achievements: achievements || [],
		ownedAchievements: ownedAchievements || []
	};
};
