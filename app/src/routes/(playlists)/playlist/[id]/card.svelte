<script lang="ts">
	import { LINKS } from '$lib/constants';
	import type { Playlist, Track, User } from '$lib/types';
	import { generateGradient } from '$lib/utils';
	import ImageFallback from './imageFallback.svelte';

	//export let data;
	let {
		playlist,
		tracks,
		creator
	}: { playlist: Playlist; tracks: Partial<Track>[]; creator: User } = $props();
	// Get albums from the server load function
</script>

<a href={LINKS.PLAYLISTS.ID(playlist.id)} class="group">
	<div class="overflow-hidden rounded-md">
		<!--  
		{#if playlist.cover_url}
			<img
				src={playlist.cover_url}
				alt={playlist.name}
				class="aspect-square w-full object-cover transition-transform group-hover:scale-105"
			/>
		{:else}
			<div
				class="flex aspect-square w-full items-center justify-center text-4xl font-bold text-white transition-transform group-hover:scale-105"
				style="background: {generateGradient(playlist.name)};"
			>
				{playlist.name.substring(0, 1).toUpperCase()}
			</div>
		{/if}
        -->
		<ImageFallback src={playlist.cover_url} name={playlist.name}></ImageFallback>
	</div>
	<div class="mt-2">
		<h3 class="group-hover:text-primary line-clamp-1 font-medium group-hover:underline">
			{playlist.name}
		</h3>
		<p class="text-muted-foreground text-xs">
			By {creator.display_name} • {tracks.length} tracks
		</p>
	</div>
</a>
