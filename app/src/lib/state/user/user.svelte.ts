import type { Playlist } from '$lib/types';
import type { Database, SupabaseClient, User } from '@prettygood/database';
import { getContext, setContext } from 'svelte';

export class UserState {
	supabase; //: SupabaseClient<Database>;
	user = $state<User | null>(null);
	playlists = $state<(Playlist & { tracks: { id: string }[] })[]>([]);

	constructor(user: User | null, supabase: SupabaseClient<Database>) {
		this.user = user;
		this.supabase = supabase;
	}

	onAuthChange(user: User | null) {
		this.user = user;
	}

	async refreshPlaylists() {
		const { data: playlists } = await this.supabase.from('playlists').select('*, tracks(id)');
		this.playlists = playlists || [];
	}

	async addTrackToPlaylist(playlistId: string, trackId: string) {
		//this.supabase.from('playlist_tracks').select("*").eq('playlist_id', playlistId).eq('track_id', trackId);

		const { error: err } = await this.supabase.from('playlist_tracks').insert({
			playlist_id: playlistId,
			track_id: trackId,
			added_by: this.user!.id,
			position: 0
		});
		if (err) {
			console.error(err);
		}

		await this.refreshPlaylists();
	}
	async removeTrackFromPlaylist(playlistId: string, trackId: string) {
		const { data } = await this.supabase
			.from('playlist_tracks')
			.delete()
			.eq('playlist_id', playlistId)
			.eq('track_id', trackId);

		await this.refreshPlaylists();
	}
}

const USER_CONTEXT_KEY = Symbol('userContext');

export function setUserContext(user: UserState) {
	return setContext(USER_CONTEXT_KEY, user);
}

export function getUserContext() {
	return getContext<ReturnType<typeof setUserContext>>(USER_CONTEXT_KEY);
}
