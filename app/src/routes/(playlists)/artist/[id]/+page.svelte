<script lang="ts">
	import ArtistProfileTemplate from '$lib/components/app/templates/ArtistProfileTemplate/ArtistProfileTemplate.svelte';

	// Page data from load function
	let { data } = $props();

	// Initial state
	let isFollowing = $state(false);

	// Event handlers
	function handleToggleFollow(following) {
		console.log(`User ${following ? 'followed' : 'unfollowed'} artist: ${data.artist.id}`);
		// Here you would typically call an API to update the follow status
	}

	function handleTipArtist(artist) {
		// This would integrate with the Sui wallet functionality
		console.log(`User wants to tip artist: ${artist.id}`);
		alert('Tipping functionality would integrate with Sui wallet');
	}

	function handleShare(artist) {
		console.log(`User wants to share artist: ${artist.id}`);
		alert(`Sharing artist: ${artist.artist_name}`);
		// Implement share functionality, e.g., using Web Share API
	}

	function handleSeeAllTracks(artist) {
		console.log(`Navigating to all tracks by artist: ${artist.id}`);
		// Navigation could be implemented here
	}

	function handleSeeAllAlbums(artist) {
		console.log(`Navigating to all albums by artist: ${artist.id}`);
		// Navigation could be implemented here
	}

	function handleSeeAllSimilarArtists() {
		console.log(`Navigating to similar artists`);
		// Navigation could be implemented here
	}
</script>

<ArtistProfileTemplate
	artist={data.artist}
	similarArtists={data.similarArtists}
	initialIsFollowing={isFollowing}
	initialSelectedTab="overview"
	onToggleFollow={handleToggleFollow}
	onTipArtist={handleTipArtist}
	onShare={handleShare}
	onSeeAllTracks={handleSeeAllTracks}
	onSeeAllAlbums={handleSeeAllAlbums}
	onSeeAllSimilarArtists={handleSeeAllSimilarArtists}
	pageTitle={`${data.artist.artist_name} | prettygood.music`}
	pageDescription={data.artist.bio?.substring(0, 160) || `Music by ${data.artist.artist_name}`}
/>
