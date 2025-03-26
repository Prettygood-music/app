<script lang="ts">
	import { goto } from '$app/navigation';
	import { databaseClient } from '$lib/databaseClient';
	import { onMount, onDestroy } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Search } from 'lucide-svelte';
	import SearchSuggestions from './SearchSuggestions.svelte';

	let {
		initialValue = '',
		placeholder = 'Search for songs, artists, or albums',
		buttonText = 'Search',
		showButton = true,
		fullWidth = true,
		size = 'default'
	} = $props<{
		initialValue?: string;
		placeholder?: string;
		buttonText?: string;
		showButton?: boolean;
		fullWidth?: boolean;
		size?: 'default' | 'sm' | 'lg';
	}>();

	// Define classes based on size
	let inputClasses = $derived.by(() =>
		size === 'sm' ? 'h-8 pl-8' : size === 'lg' ? 'h-12 pl-12 text-lg' : 'pl-10'
	);

	let iconClasses = $derived(size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5');

	let searchQuery = $state(initialValue);
	let showSuggestions = $state(false);
	let loading = $state(false);
	let suggestionArtists = $state([]);
	let suggestionTracks = $state([]);
	let suggestionAlbums = $state([]);
	let recentSearches = $state([]);
	let abortController = new AbortController();
	let searchInput: HTMLElement;

	// Debounce search for suggestions
	let searchTimeout: ReturnType<typeof setTimeout>;
	$effect(() => {
		clearTimeout(searchTimeout);
		if (searchQuery && searchQuery.length > 1) {
			loading = true;
			searchTimeout = setTimeout(() => {
				fetchSuggestions(searchQuery);
			}, 300);
		} else {
			suggestionArtists = [];
			suggestionTracks = [];
			suggestionAlbums = [];
			loading = false;
		}
	});

	onMount(async () => {
		// Fetch recent searches
		try {
			const { data } = await databaseClient
				.from('search_history')
				.select('query')
				.order('searched_at', { ascending: false })
				.limit(5);

			if (data) {
				recentSearches = data.map((item) => item.query);
			}
		} catch (error) {
			console.error('Error fetching recent searches:', error);
		}

		// Add click outside listener
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		clearTimeout(searchTimeout);
		abortController.abort();
		document.removeEventListener('click', handleClickOutside);
	});

	async function fetchSuggestions(query: string) {
		// Cancel previous request
		abortController.abort();
		abortController = new AbortController();

		try {
			// Fetch track suggestions
			const { data: tracks } = await databaseClient
				.from('tracks')
				.select('id, title, artist:artists(id, artist_name)')
				.or(`title.ilike.%${query}%, genre.cs.{${query}}`)
				.order('created_at', { ascending: false })
				.limit(3);

			// Fetch artist suggestions
			const { data: artists } = await databaseClient
				.from('artists')
				.select('id, artist_name')
				.or(`artist_name.ilike.%${query}%, genre.cs.{${query}}`)
				.order('created_at', { ascending: false })
				.limit(3);

			// Fetch album suggestions
			const { data: albums } = await databaseClient
				.from('albums')
				.select('id, title, artist:artists(id, artist_name)')
				.or(`title.ilike.%${query}%, genre.cs.{${query}}`)
				.order('created_at', { ascending: false })
				.limit(3);

			suggestionTracks = tracks || [];
			suggestionArtists = artists || [];
			suggestionAlbums = albums || [];
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error fetching suggestions:', error);
			}
		} finally {
			loading = false;
		}
	}

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchQuery.trim()) {
			showSuggestions = false;
			goto(`/search/${encodeURIComponent(searchQuery.trim())}`);
		}
	}

	function handleFocus() {
		if (searchQuery.length > 0) {
			showSuggestions = true;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (searchInput && !searchInput.contains(event.target as Node)) {
			showSuggestions = false;
		}
	}

	function handleSelect(event: CustomEvent<string>) {
		searchQuery = event.detail;
		showSuggestions = false;
	}

	function handleClose() {
		showSuggestions = false;
	}
</script>

<div class={fullWidth ? 'w-full' : ''} bind:this={searchInput}>
	<form onsubmit={handleSearch} class="w-full">
		<div class="relative flex gap-2">
			<div class="relative flex-1">
				<Search
					class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 {iconClasses}"
				/>
				<Input
					type="text"
					{placeholder}
					class={inputClasses}
					bind:value={searchQuery}
					onfocus={handleFocus}
				/>

				<SearchSuggestions
					query={searchQuery}
					visible={showSuggestions}
					{recentSearches}
					{suggestionArtists}
					{suggestionTracks}
					{suggestionAlbums}
					{loading}
					on:select={handleSelect}
					on:close={handleClose}
				/>
			</div>
			{#if showButton}
				<Button type="submit" size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}>
					{buttonText}
				</Button>
			{/if}
		</div>
	</form>
</div>
