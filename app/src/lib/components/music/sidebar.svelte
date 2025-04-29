<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { LINKS } from '$lib/constants';
	import type { Playlist, User } from '$lib/types';
	import { cn } from '$lib/utils.js';
	import { PlusIcon } from 'lucide-svelte';
	import ImageFallback from '../../../routes/(playlists)/playlist/[id]/imageFallback.svelte';

	let {
		playlists,
		class: className
	}: { playlists: (Playlist & { creator: User })[]; class?: string } = $props();
</script>

<div class={cn('bg-card h-full overflow-y-auto rounded-md', className)}>
	<div class="space-y-4 py-4">
		<div class="px-3 py-2">
			<h2 class="mb-2 text-lg font-semibold tracking-tight">Playlists</h2>
			<div class="space-y-4">
				<Button
					href={LINKS.PLAYLISTS.NEW}
					class="{buttonVariants({
						variant: 'ghost'
					})} bg-muted hover:bg-primary group w-full"
				>
					Create Playlist
					<PlusIcon class=" duration-300 group-hover:rotate-45" />
				</Button>

				<ScrollArea class="h-[300px]" orientation="vertical">
					<div class="space-y-2 overflow-x-hidden">
						{#each playlists as playlist}
							<a
								class={'flex w-full items-center justify-start hover:bg-muted p-2 space-x-3 overflow-hidden font-normal'}
								href={LINKS.PLAYLISTS.ID(playlist.id)}
								aria-label="Playlist - {playlist.name}"
							>
								<div class="h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded">
									<ImageFallback src={playlist.cover_url} name={playlist.name}></ImageFallback>
								</div>
								<!-- <div class="aspect-square bg-red-500">H</div> -->
								<div class=" text-ellipsis">
									<div class="text-sm">
										{playlist.name}
									</div>
									<div class="text-muted-foreground mt-1 text-xs">
										{playlist.creator.display_name}
									</div>
								</div>
							</a>
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>
	</div>
</div>
