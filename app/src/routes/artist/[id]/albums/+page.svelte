<script lang="ts">
	import { AlbumCard } from '$lib/components/music';
	import type { Album } from '$lib/types';

	let { data } = $props();
</script>

<h2 class="mb-4 text-2xl font-bold">Albums</h2>

<div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each data.albums || [] as album}
		<AlbumCard album={{ ...album, artist_name: data.artist.artist_name, tracks: album.tracks }} />
	{/each}
</div>
