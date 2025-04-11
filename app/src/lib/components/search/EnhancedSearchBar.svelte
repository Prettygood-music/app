<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';

	// Props
	let {
		showButton = true
	}: {
		showButton?: boolean;
	} = $props();

	// State
	let query = $state('');
	let isFiltersOpen = $state(false);
	let selectedGenres = $state<string[]>([]);

	// Init query from URL params on mount
	onMount(() => {
		query = $page.url.searchParams.get('q') || '';

		// Get genre filters from URL
		const genreParam = $page.url.searchParams.get('genres');
		if (genreParam) {
			selectedGenres = genreParam.split(',');
		}
	});

	// Handle search submission
	function handleSearch(event: Event) {
		// Prevent default form submission
		if (event) {
			event.preventDefault();
		}

		// Build the search URL
		const searchUrl = new URL('/search', window.location.origin);

		// Add query parameter if not empty
		if (query.trim()) {
			searchUrl.searchParams.set('q', query.trim());
		}

		// Add genre filters if selected
		if (selectedGenres.length > 0) {
			searchUrl.searchParams.set('genres', selectedGenres.join(','));
		}

		// Navigate to search page with parameters
		goto(searchUrl.toString());
	}
</script>

<div class="flex w-full flex-col gap-4">
	<form class="flex w-full items-center gap-2" onsubmit={handleSearch}>
		<div class="relative flex-1">
			<!-- 
        <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        -->

			<Input
				type="search"
				placeholder="Search for songs, artists, albums..."
				class="w-full rounded-full pl-10 pr-10"
				bind:value={query}
			/>
		</div>

		{#if showButton}
			<Button type="submit">Search</Button>
		{/if}
	</form>

	{#if selectedGenres.length > 0}
		<div class="flex items-center gap-2">
			<span class="text-muted-foreground text-sm">Filters:</span>
			<Button
				variant="outline"
				size="sm"
				class="h-7 px-2 text-xs"
				onclick={() => (isFiltersOpen = true)}
			>
				{selectedGenres.length} genre{selectedGenres.length > 1 ? 's' : ''}
			</Button>
		</div>
	{/if}
</div>
