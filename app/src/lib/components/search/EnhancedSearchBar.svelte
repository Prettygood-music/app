<script lang="ts">
	import SlidersHorizontal from 'lucide-svelte/icons/sliders-horizontal';
	import X from 'lucide-svelte/icons/x';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { GenreFilter } from '$lib/components/search';
	import { onMount } from 'svelte';

	// Props
	let { showButton = true } = $props<{
		showButton?: boolean;
	}>();

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

	// Clear search input
	function clearSearch() {
		query = '';
	}

	// Handle clear all filters
	function clearAllFilters() {
		selectedGenres = [];
		isFiltersOpen = false;
	}

	// Count active filters
	let activeFiltersCount = $derived.by(() => {
		let count = 0;
		if (selectedGenres.length > 0) count += 1;
		return count;
	});
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

			{#if query}
				<button
					type="button"
					class="hover:bg-muted absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full"
					aria-label="Clear search"
					onclick={clearSearch}
				>
					<X class="h-3 w-3" />
				</button>
			{/if}
		</div>

		<Sheet bind:open={isFiltersOpen}>
			<SheetTrigger>
				<Button variant="outline" size="icon" class="relative rounded-full" type="button">
					<SlidersHorizontal class="h-4 w-4" />
					{#if activeFiltersCount > 0}
						<span
							class="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-xs"
						>
							{activeFiltersCount}
						</span>
					{/if}
				</Button>
			</SheetTrigger>

			<SheetContent>
				<SheetHeader>
					<SheetTitle>Search Filters</SheetTitle>
					<SheetDescription>Refine your search results</SheetDescription>
				</SheetHeader>

				<div class="space-y-6 py-4">
					<GenreFilter bind:selectedGenres />

					{#if activeFiltersCount > 0}
						<div class="flex items-center justify-between border-t pt-4">
							<p class="text-sm font-medium">Active filters: {activeFiltersCount}</p>
							<Button variant="ghost" size="sm" onclick={clearAllFilters}>Clear All</Button>
						</div>
					{/if}
				</div>

				<div class="mt-4 flex gap-2">
					<Button
						class="flex-1"
						onclick={(e) => {
							isFiltersOpen = false;
							handleSearch(e);
						}}
					>
						Apply Filters
					</Button>
					<Button variant="outline" onclick={() => (isFiltersOpen = false)}>Cancel</Button>
				</div>
			</SheetContent>
		</Sheet>

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
