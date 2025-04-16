<script lang="ts">
	import type { Album } from '$lib/types/player';
	import { cn } from '$lib/utils.js';
	import Thumbnail from '$lib/components/app/atoms/thumbnail/thumbnail.svelte';
	import PlayCircle from 'lucide-svelte/icons/play-circle';

	// Props
	let {
		album,
		size = 'default',
		aspectRatio = 'square',
		className = ''
	}: {
		album: Omit<Album, 'track_count'>;
		size?: 'default' | 'sm' | 'lg';
		aspectRatio?: 'square' | 'portrait' | 'video';
		className?: string;
	} = $props();

	// Size configuration
	const thumbnailSizes = {
		default: '',
		sm: 'max-w-[150px]',
		lg: 'max-w-[250px]'
	};
	let trackCount = $derived(album.tracks.length);

	// Get formatted year
	const releaseYear = new Date(album.release_date).getFullYear();

	// Handle play click
	function onPlayClick() {
		console.log(`Playing album: ${album.title}`);
	}
</script>

<div class={cn('space-y-3', thumbnailSizes[size], className)}>
	<div class="overflow-hidden rounded-md">
		<button
			class={cn(
				'group relative cursor-pointer overflow-hidden rounded-md',
				aspectRatio === 'portrait'
					? 'aspect-[3/4]'
					: aspectRatio === 'video'
						? 'aspect-video'
						: 'aspect-square'
			)}
			onclick={onPlayClick}
		>
			{#if album.cover_url}
				<img
					src={album.cover_url}
					alt={album.title}
					class="h-auto w-full object-cover transition-all group-hover:scale-105"
				/>
			{:else}
				<div class="bg-muted flex h-full w-full items-center justify-center">
					<PlayCircle class="text-muted-foreground h-10 w-10" />
				</div>
			{/if}

			<!-- Play overlay -->
			<div
				class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<PlayCircle class="h-12 w-12 text-white" />
			</div>
		</button>
	</div>

	<a href="/album/{album.id}" class="group block">
		<h3 class="group-hover:text-primary truncate font-medium">{album.title}</h3>
		<p class="text-muted-foreground text-sm">{releaseYear} • {trackCount} tracks</p>
	</a>
</div>
