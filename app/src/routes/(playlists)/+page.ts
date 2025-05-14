import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { supabase } = await parent();

	const [
		{ data: recommendedArtists },
		{ data: recommendedTracks },
		{ data: recommendedAlbums },
		{ data: recommendedPlaylists }
	] = await Promise.all([
		supabase.from('artists').select('*').limit(10),
		supabase
			.from('tracks')
			.select('*, artist: artists(artist_name), album: albums(cover_url)')
			.limit(10),
		supabase.from('albums').select('*').limit(10),
		supabase
			.from('playlists')
			.select('*, tracks(*), creator:users!playlists_user_id_fkey(*)')
			.limit(10)
	]);

	return {
		recommendations: {
			tracks: recommendedTracks || [],
			albums: recommendedAlbums || [],
			artists: recommendedArtists || [],
			playlists: recommendedPlaylists || []
		}
	};
}) satisfies PageLoad;
