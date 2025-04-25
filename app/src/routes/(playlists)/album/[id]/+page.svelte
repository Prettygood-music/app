<script lang="ts">
	import AlbumDetailTemplate from '$lib/components/app/templates/AlbumDetailTemplate/AlbumDetailTemplate.svelte';

	// Page data from load function
	let { data } = $props();

	// Initial state
	let isPlaying = $state(false);
	let isLiked = $state(false);

	// Event handlers
	function handleTogglePlay(playing, album) {
		console.log(`${playing ? 'Playing' : 'Paused'} album: ${album.title}`);
		// In a real app, this would trigger the audio player
	}

	function handleShufflePlay(album) {
		console.log(`Shuffle playing album: ${album.title}`);
		isPlaying = true;
	}

	function handleToggleLike(liked, album) {
		console.log(`${liked ? 'Liked' : 'Unliked'} album: ${album.title}`);
		// In a real app, this would update the database
	}

	function handleShare(album) {
		console.log(`Sharing album: ${album.title}`);
		// Implement share functionality, e.g., using Web Share API
	}

	function handleMoreOptions(album) {
		console.log(`Showing more options for album: ${album.title}`);
		// In a real app, this would open a context menu or modal
	}
</script>

<AlbumDetailTemplate
	album={data.album}
	artist={data.artist}
	tracks={data.tracks}
	relatedAlbums={data.relatedAlbums}
	initialIsLiked={isLiked}
	onTogglePlay={handleTogglePlay}
	onShufflePlay={handleShufflePlay}
	onToggleLike={handleToggleLike}
	onShare={handleShare}
	onMoreOptions={handleMoreOptions}
/>
