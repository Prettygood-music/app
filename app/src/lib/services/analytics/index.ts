import { setContext, getContext } from 'svelte';

class FrontendAnalytics {
	private userId = $state<null | string>(null);

	constructor(userID: string | null) {
		this.userId = userID;
	}

	changeUserId(userId: string | null) {
		this.userId = userId;
	}

	// TRACKS
	async onTrackPlay(trackId: string) {
		// TODO: Implement track play event
		console.log(`Track played: ${trackId}`);
	}

	async onTrackLike(trackId: string) {
		console.log(`Track liked: ${trackId}`);
	}

	async onTrackUnlike(trackId: string) {
		console.log(`Track unliked: ${trackId}`);
	}

	async onTrackShare(trackId: string) {
		console.log(`Track shared: ${trackId}`);
	}

	// ALBUMS
	async onAlbumPlay(albumId: string) {
		console.log(`Album played: ${albumId}`);
	}

	async onAlbumLike(albumId: string) {
		console.log(`Album liked: ${albumId}`);
	}

	async onAlbumUnlike(albumId: string) {
		console.log(`Album unliked: ${albumId}`);
	}

	async onAlbumShare(albumId: string) {
		console.log(`Album shared: ${albumId}`);
	}

	// ARTISTS
	async onArtistFollow(artistId: string) {
		console.log(`Artist followed: ${artistId}`);
	}
	async onArtistUnfollow(artistId: string) {
		console.log(`Artist unfollowed: ${artistId}`);
	}
	async onArtistShare(artistId: string) {
		console.log(`Artist shared: ${artistId}`);
	}
}

const FRONTEND_ANALYTICS_CONTEXT_KEY = Symbol('FrontendAnalytics');

export function setAnalyticsContext(userID: string | null) {
	return setContext(FRONTEND_ANALYTICS_CONTEXT_KEY, new FrontendAnalytics(userID));
}

export function getAnalyticsContext() {
	return getContext<ReturnType<typeof setAnalyticsContext>>(FRONTEND_ANALYTICS_CONTEXT_KEY);
}
