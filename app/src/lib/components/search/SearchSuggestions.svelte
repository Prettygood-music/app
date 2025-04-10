<script lang="ts">
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import Music from 'lucide-svelte/icons/music';
	import Mic from 'lucide-svelte/icons/mic';
	import Disc from 'lucide-svelte/icons/disc';
	import Search from 'lucide-svelte/icons/search';

	let {
		query = '',
		visible = false,
		recentSearches = [],
		suggestionArtists = [],
		suggestionTracks = [],
		suggestionAlbums = [],
		loading = false
	}: {
		query?: string;
		visible?: boolean;
		recentSearches?: string[];
		suggestionArtists?: Array<{ id: string; artist_name: string }>;
		suggestionTracks?: Array<{ id: string; title: string; artist?: { artist_name: string } }>;
		suggestionAlbums?: Array<{ id: string; title: string; artist?: { artist_name: string } }>;
		loading?: boolean;
	} = $props();

	const dispatch = createEventDispatcher();

	function handleSelectSuggestion(suggestion: string) {
		dispatch('select', suggestion);
		goto(`/search/${encodeURIComponent(suggestion)}`);
	}

	function handleNavigate(path: string) {
		dispatch('close');
		goto(path);
	}
</script>

{#if visible && query.length > 0}
	<div
		class="bg-popover border-border absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-md border shadow-md"
	>
		{#if loading}
			<div class="p-4 text-center">
				<div
					class="border-primary mx-auto h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
				></div>
				<p class="text-muted-foreground mt-2 text-sm">Searching...</p>
			</div>
		{:else}
			<div class="p-2">
				<!-- Direct search suggestion -->
				<button
					class="hover:bg-muted flex w-full items-center gap-2 rounded-md p-2 text-left"
					onclick={() => handleSelectSuggestion(query)}
				>
					<Search class="text-muted-foreground h-4 w-4 flex-shrink-0" />
					<span>Search for "<strong>{query}</strong>"</span>
				</button>

				<!-- Track suggestions -->
				{#if suggestionTracks.length > 0}
					<div class="border-border mt-2 border-t pt-2">
						<p class="text-muted-foreground mb-1 px-2 text-xs">TRACKS</p>
						{#each suggestionTracks as track}
							<button
								class="hover:bg-muted flex w-full items-center gap-2 rounded-md p-2 text-left"
								onclick={() => handleNavigate(`/track/${track.id}`)}
							>
								<Music class="text-muted-foreground h-4 w-4 flex-shrink-0" />
								<div class="overflow-hidden">
									<p class="truncate">{track.title}</p>
									{#if track.artist}
										<p class="text-muted-foreground truncate text-xs">
											{track.artist.artist_name}
										</p>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}

				<!-- Artist suggestions -->
				{#if suggestionArtists.length > 0}
					<div class="border-border mt-2 border-t pt-2">
						<p class="text-muted-foreground mb-1 px-2 text-xs">ARTISTS</p>
						{#each suggestionArtists as artist}
							<button
								class="hover:bg-muted flex w-full items-center gap-2 rounded-md p-2 text-left"
								onclick={() => handleNavigate(`/artist/${artist.id}`)}
							>
								<Mic class="text-muted-foreground h-4 w-4 flex-shrink-0" />
								<div class="overflow-hidden">
									<p class="truncate">{artist.artist_name}</p>
								</div>
							</button>
						{/each}
					</div>
				{/if}

				<!-- Album suggestions -->
				{#if suggestionAlbums.length > 0}
					<div class="border-border mt-2 border-t pt-2">
						<p class="text-muted-foreground mb-1 px-2 text-xs">ALBUMS</p>
						{#each suggestionAlbums as album}
							<button
								class="hover:bg-muted flex w-full items-center gap-2 rounded-md p-2 text-left"
								onclick={() => handleNavigate(`/album/${album.id}`)}
							>
								<Disc class="text-muted-foreground h-4 w-4 flex-shrink-0" />
								<div class="overflow-hidden">
									<p class="truncate">{album.title}</p>
									{#if album.artist}
										<p class="text-muted-foreground truncate text-xs">
											{album.artist.artist_name}
										</p>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}

				<!-- Recent searches -->
				{#if recentSearches.length > 0 && query.length < 2}
					<div class="border-border mt-2 border-t pt-2">
						<p class="text-muted-foreground mb-1 px-2 text-xs">RECENT SEARCHES</p>
						{#each recentSearches as search}
							<button
								class="hover:bg-muted flex w-full items-center gap-2 rounded-md p-2 text-left"
								onclick={() => handleSelectSuggestion(search)}
							>
								<Search class="text-muted-foreground h-4 w-4 flex-shrink-0" />
								<span>{search}</span>
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
