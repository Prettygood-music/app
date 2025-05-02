import type { Database, SupabaseClient } from '@prettygood/database';
import { setContext, getContext } from 'svelte';

class FrontendAnalytics {
	private userId = $state<null | string>(null);
	private supabase;

	get isAuthenticated() {
		return this.userId;
	}

	constructor(userID: string | null, supabase: SupabaseClient<Database>) {
		this.userId = userID;
		this.supabase = supabase;
	}

	changeUserId(userId: string | null) {
		this.userId = userId;
	}

	// TRACKS
	async onTrackPlay(trackId: string) {
		// TODO: Implement track play event
		console.log(`Track played: ${trackId}`);
		const { data, error } = await this.supabase
			.from('play_history')
			.insert({ user_id: this.userId, track_id: trackId });
	}

	async onTrackLike(trackId: string) {
		console.log(`Track liked: ${trackId}`);
		const { data, error } = await this.supabase
			.from('track_likes')
			.upsert({ user_id: this.userId, track_id: trackId });
	}

	async onTrackUnlike(trackId: string) {
		console.log(`Track unliked: ${trackId}`);
		const { data, error } = await this.supabase
			.from('track_likes')
			.delete()
			.eq('user_id', this.userId)
			.eq('track_id', trackId);
	}

	async onTrackShare(trackId: string) {
		throw new Error('Not implemented');

		console.log(`Track shared: ${trackId}`);
	}

	// ALBUMS
	async onAlbumPlay(albumId: string) {
		throw new Error('Not implemented, prefer using onTrackPlay');

		console.log(`Album played: ${albumId}`);
	}

	async onAlbumLike(albumId: string) {
		const { data, error } = await this.supabase
			.from('album_likes')
			.insert({ user_id: this.userId, album_id: albumId });
		console.log(`Album liked: ${albumId}`);
	}

	async onAlbumUnlike(albumId: string) {
		await this.supabase
			.from('album_likes')
			.delete()
			.eq('user_id', this.userId)
			.eq('album_id', albumId);
		console.log(`Album unliked: ${albumId}`);
	}

	async onAlbumShare(albumId: string) {
		throw new Error('Not implemented');

		console.log(`Album shared: ${albumId}`);
	}

	// Playlist
	async onPlaylistPlay(albumId: string) {
		console.log(`Album played: ${albumId}`);
	}

	async onPlaylistLike(albumId: string) {
		console.log(`Album liked: ${albumId}`);
	}

	async onPlaylistUnlike(albumId: string) {
		console.log(`Album unliked: ${albumId}`);
	}

	async onPlaylistShare(albumId: string) {
		throw new Error('Not implemented');

		console.log(`Album shared: ${albumId}`);
	}

	// ARTISTS
	async onArtistFollow(artistId: string) {
		const { data, error } = await this.supabase
			.from('artist_followers')
			.insert({ user_id: this.userId, artist_id: artistId });
		console.log(`Artist followed: ${artistId}`);
	}
	async onArtistUnfollow(artistId: string) {
		const { data, error } = await this.supabase
			.from('artist_followers')
			.delete()
			.eq('user_id', this.userId)
			.eq('artist_id', artistId);
		console.log(`Artist unfollowed: ${artistId}`);
	}
	async onArtistShare(artistId: string) {
		throw new Error('Not implemented');

		console.log(`Artist shared: ${artistId}`);
	}

	// MISCELLANEOUS
	async onSearch(query: string) {
		console.log(`Search performed: ${query}`);
	}

	async onAppInstall() {
		console.log(`App installed`);
	}
	async onAppUninstall() {
		console.log(`App uninstalled`);
	}
}

const FRONTEND_ANALYTICS_CONTEXT_KEY = Symbol('FrontendAnalytics');

export function setAnalyticsContext(userID: string | null, supabase: SupabaseClient<Database>) {
	return setContext(FRONTEND_ANALYTICS_CONTEXT_KEY, new FrontendAnalytics(userID, supabase));
}

export function getAnalyticsContext() {
	return getContext<ReturnType<typeof setAnalyticsContext>>(FRONTEND_ANALYTICS_CONTEXT_KEY);
}
