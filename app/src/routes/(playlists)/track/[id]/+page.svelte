<script lang="ts">
	import TrackDetailTemplate from '$lib/components/app/templates/TrackDetailTemplate/TrackDetailTemplate.svelte';
	import { getPlayerContext } from '$lib/state/player.svelte.js';
	
	// Page data from load function
	let { data } = $props();
	const playerState = getPlayerContext();
	
	// Initial state
	let isPlaying = $state(false);
	let isLiked = $state(false);
	
	// Event handlers
	function handleTogglePlay(playing, track) {
		console.log(`${playing ? 'Playing' : 'Paused'} track: ${track.title}`);
		playerState.togglePlayPause();
		// In a real app, this would trigger the audio player
	}
	
	function handleToggleLike(liked, track) {
		console.log(`${liked ? 'Liked' : 'Unliked'} track: ${track.title}`);
		// In a real app, this would update the database
		// TODO: handle like track
	}
	
	function handleShare(track) {
		console.log(`Sharing track: ${track.title}`);
		// Implement share functionality
	}
	
	function handleMoreOptions(track) {
		console.log(`Showing more options for track: ${track.title}`);
		// Show options menu
	}
	
	// Calculate recommended tracks
	let recommendedTracks = $derived.by(() => {
		if (data.recommendedTracks && data.recommendedTracks.length > 0) {
			return data.recommendedTracks;
		} else {
			return data.track.album?.tracks || [];
		}
	});
</script>

<svelte:head>
	<title>{data.track.title} by {data.track.artist.artist_name} | prettygood.music</title>
	<meta
		name="description"
		content="Listen to {data.track.title} by {data.track.artist.artist_name} on prettygood.music"
	/>
</svelte:head>

<TrackDetailTemplate 
	track={data.track}
	recommendedTracks={recommendedTracks}
	initialIsPlaying={isPlaying}
	initialIsLiked={data.isLiked}
	onTogglePlay={handleTogglePlay}
	onToggleLike={handleToggleLike}
	onShare={handleShare}
	onMoreOptions={handleMoreOptions}
/>
