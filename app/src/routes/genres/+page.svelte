<script lang="ts">
	import type { PageData } from './$types';
	import { GenreGrid } from '$lib/components/genres';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';

	// Page data
	let { data } = $props();

	// State
	let isLoading = $state(false);
	let currentTab = $state('popular');

	// Derived values - sort all genres alphabetically
	let sortedGenres = $derived.by(() => {
		return [...data.allGenres].sort((a, b) => a.name.localeCompare(b.name));
	});
</script>

<svelte:head>
	<title>Browse by Genre - prettygood.music</title>
	<meta
		name="description"
		content="Explore music by genre - find tracks, albums, and artists in your favorite genres"
	/>
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-8">
	<h1 class="mb-6 text-3xl font-bold">Browse by Genre</h1>

	<Tabs value={currentTab} onValueChange={(value) => (currentTab = value)} class="mb-8">
		<TabsList class="mb-6">
			<TabsTrigger value="popular">Popular Genres</TabsTrigger>
			<TabsTrigger value="all">All Genres</TabsTrigger>
		</TabsList>

		<TabsContent value="popular" class="mt-0">
			<h2 class="mb-4 text-2xl font-semibold">Popular Genres</h2>
			<p class="text-muted-foreground mb-6">
				Trending genres this month based on listening activity
			</p>

			<GenreGrid
				genres={data.popularGenres}
				isLoading={isLoading && currentTab === 'popular'}
				error={data.status === 'error' ? new Error(data.error) : null}
				size="large"
				columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
			/>
		</TabsContent>

		<TabsContent value="all" class="mt-0">
			<h2 class="mb-4 text-2xl font-semibold">All Genres</h2>
			<p class="text-muted-foreground mb-6">Browse our complete collection of music genres</p>

			<GenreGrid
				genres={sortedGenres}
				isLoading={isLoading && currentTab === 'all'}
				error={data.status === 'error' ? new Error(data.error) : null}
				size="medium"
				columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
			/>
		</TabsContent>
	</Tabs>
</div>
