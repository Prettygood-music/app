<script lang="ts">
	import { LINKS } from '$lib/constants';
	import type { Album, Track } from '$lib/types';
	import ImageFallback from '../../../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';

	//export let data;
	let { album, tracks, date }: { album: Album; tracks: Partial<Track>[]; date: string } = $props();
	// Get albums from the server load function
</script>

<a href={LINKS.ALBUMS.ID(album.id)} class="group flex flex-col">
	<div class=" flex-grow">
		<ImageFallback class="rounded-md" src={album.cover_url} name={album.title}></ImageFallback>
	</div>
	<div class="mt-2">
		<h3 class="group-hover:text-primary line-clamp-1 font-medium group-hover:underline">
			{album.title}
		</h3>
		<p class="text-muted-foreground text-xs">
			{date} • {tracks.length} tracks
		</p>
	</div>
</a>
