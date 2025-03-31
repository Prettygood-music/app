<script lang="ts">
	// Import dependencies
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Check, X } from 'lucide-svelte';
	import type { Genre } from '$lib/services/genres';
	import { searchGenres, getAllGenres } from '$lib/services/genres';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Props
	let { selectedGenres = $bindable<string[]>([]) } = $props();

	// Component state
	let allGenres = $state<Genre[]>([]);
	let commonGenres = $state<Genre[]>([]);
	let isLoading = $state(true);
	let error = $state<Error | null>(null);

	// Create a map to easily look up genres by ID
	let genreMap = $derived.by(() => {
		const map = new Map<string, Genre>();
		allGenres.forEach((genre) => map.set(genre.id, genre));
		return map;
	});

	// Selected genre objects
	let selectedGenreObjects = $derived.by(() => {
		return selectedGenres.map((id) => genreMap.get(id)).filter(Boolean) as Genre[];
	});

	// Load genres on mount
	onMount(async () => {
		try {
			isLoading = true;

			// Load all genres
			const genres = await getAllGenres();
			allGenres = genres;

			// Get the most common genres (first 8)
			commonGenres = genres.slice(0, 8);

			// Sync with URL if needed
			syncWithUrl();
		} catch (err) {
			error = err as Error;
			console.error('Error loading genres:', err);
		} finally {
			isLoading = false;
		}
	});

	// Toggle genre selection
	function toggleGenre(genreId: string) {
		if (selectedGenres.includes(genreId)) {
			selectedGenres = selectedGenres.filter((id) => id !== genreId);
		} else {
			selectedGenres = [...selectedGenres, genreId];
		}
		updateUrlParams();
	}

	// Clear all selected genres
	function clearGenres() {
		selectedGenres = [];
		updateUrlParams();
	}

	// Update URL parameters when genres change
	function updateUrlParams() {
		// Get current URL params
		const url = new URL(window.location.href);

		// Remove old genre params
		url.searchParams.delete('genres');

		// Add new genre params if any are selected
		if (selectedGenres.length > 0) {
			url.searchParams.set('genres', selectedGenres.join(','));
		}

		// Navigate to new URL without reloading the page
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// Sync with URL parameters
	function syncWithUrl() {
		const genreParam = $page.url.searchParams.get('genres');
		if (genreParam) {
			selectedGenres = genreParam.split(',');
		}
	}
</script>

<div class="genre-filter space-y-4">
	<div class="flex flex-col space-y-2">
		<div class="flex items-center justify-between">
			<h3 class="text-sm font-semibold">Filter by Genre</h3>
			{#if selectedGenres.length > 0}
				<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={clearGenres}>
					Clear
				</Button>
			{/if}
		</div>

		{#if isLoading}
			<div class="grid grid-cols-2 gap-2">
				{#each Array(6) as _}
					<div class="bg-muted h-8 animate-pulse rounded"></div>
				{/each}
			</div>
		{:else if error}
			<p class="text-destructive text-sm">Error loading genres</p>
		{:else}
			<div class="flex flex-wrap gap-2">
				{#each selectedGenreObjects as genre}
					<Badge variant="outline" class="flex cursor-pointer items-center gap-1">
						<span>{genre.name}</span>
						<button
							class="inline-flex h-3 w-3 items-center justify-center"
							aria-label={`Remove ${genre.name} filter`}
							onclick={() => toggleGenre(genre.id)}
						>
							<X class="h-3 w-3" />
						</button>
					</Badge>
				{/each}
			</div>

			<div class="mt-2 grid grid-cols-2 gap-2">
				{#each commonGenres as genre}
					<Badge
						variant={selectedGenres.includes(genre.id) ? 'default' : 'outline'}
						class="cursor-pointer justify-between"
						onclick={() => toggleGenre(genre.id)}
					>
						{genre.name}
						{#if selectedGenres.includes(genre.id)}
							<Check class="ml-1 h-3 w-3" />
						{/if}
					</Badge>
				{/each}
			</div>
		{/if}
	</div>
</div>
