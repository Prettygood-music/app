<script lang="ts">
	//import type { Playlist } from '$lib/data/playlists.js';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as DropdownMenu from '../ui/dropdown-menu';
	import { PlusIcon } from 'lucide-svelte';
	import { LINKS } from '$lib/constants';

	let className: string | null | undefined = undefined;
	type Playlist = {
		id: string;
		name: string;
		cover_url?: string;
	};
	export let playlists: Playlist[];
	export { className as class };
</script>

<div class={cn('bg-card h-full rounded-md pb-12', className)}>
	<div class="space-y-4 py-4">
		<div class="px-3 py-2">
			<h2 class="mb-2 px-4 text-lg font-semibold tracking-tight">Playlists</h2>
			<div class="space-y-1">
				<Button
					href={LINKS.PLAYLISTS.NEW}
					class="{buttonVariants({
						variant: 'ghost'
					})} bg-muted hover:bg-primary group"
				>
					Create Playlist
					<PlusIcon class=" duration-300 group-hover:rotate-45" />
				</Button>

				<ScrollArea class="h-[300px] px-1">
					<div class="space-y-1 p-2">
						{#each playlists as playlist}
							<Button variant="ghost" class="w-full justify-start font-normal">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="mr-2 h-4 w-4"
								>
									<path d="M21 15V6" />
									<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
									<path d="M12 12H3" />
									<path d="M16 6H3" />
									<path d="M12 18H3" />
								</svg>
								{playlist}
							</Button>
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>
	</div>
</div>
