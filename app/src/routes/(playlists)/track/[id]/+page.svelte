<script lang="ts">
	import TrackDetailTemplate from '$lib/components/app/templates/TrackDetailTemplate/TrackDetailTemplate.svelte';

	// Page data from load function
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.track.title} by {data.track.artist_name} | prettygood.music</title>
	<meta
		name="description"
		content="Listen to {data.track.title} by {data.track.artist_name} on prettygood.music"
	/>
</svelte:head>

<TrackDetailTemplate
	track={data.track}
	artist={data.artist}
	album={data.album}
	recommendedTracks={data.recommendedTracks}
	initialIsLiked={data.isLiked}
/>
