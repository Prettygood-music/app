<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { EnhancedSearchBar } from '$lib/components/search';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import Search from 'lucide-svelte/icons/search';
	import Music from 'lucide-svelte/icons/music';
	import Mic from 'lucide-svelte/icons/mic';
	import Disc from 'lucide-svelte/icons/disc';
	import Play from 'lucide-svelte/icons/play';
	import { getPlayerContext } from '$lib/state/player.svelte';

	let { data } = $props();
	let activeTab = $state('all');

	function formatDuration(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	const playerState = getPlayerContext();
</script>

<svelte:head>
	<title>Search: {data.query} - prettygood.music</title>
</svelte:head>

<div class="overflow-y-auto">
	<div class="container mx-auto max-w-5xl px-4 py-6">
		<div class="mb-8">
			<EnhancedSearchBar initialValue={data.query} />
		</div>

		<h1 class="mb-6 text-3xl font-bold">Results for "{data.query}"</h1>

		<Tabs value={activeTab} class="w-full" onValueChange={(v) => (activeTab = v)}>
			<TabsList class="mb-6 grid w-full max-w-md grid-cols-4">
				<TabsTrigger value="all" class="flex items-center gap-2">
					<Search class="h-4 w-4" />
					<span>All</span>
				</TabsTrigger>
				<TabsTrigger value="tracks" class="flex items-center gap-2">
					<Music class="h-4 w-4" />
					<span>Tracks</span>
				</TabsTrigger>
				<TabsTrigger value="artists" class="flex items-center gap-2">
					<Mic class="h-4 w-4" />
					<span>Artists</span>
				</TabsTrigger>
				<TabsTrigger value="albums" class="flex items-center gap-2">
					<Disc class="h-4 w-4" />
					<span>Albums</span>
				</TabsTrigger>
			</TabsList>

			<TabsContent value="all" class="space-y-10">
				<!-- Tracks Section -->
				{#if data.results.tracks.length > 0}
					<section>
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-semibold">Tracks</h2>
							{#if data.results.tracks.length > 5}
								<Button variant="ghost" onclick={() => (activeTab = 'tracks')}>View All</Button>
							{/if}
						</div>

						<div class="bg-card overflow-hidden rounded-lg">
							<table class="w-full table-auto">
								<thead class="bg-muted/50">
									<tr>
										<th class="px-4 py-3 text-left">Track</th>
										<th class="px-4 py-3 text-left">Duration</th>
										<th class="px-4 py-3 text-right">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each data.results.tracks.slice(0, 5) as track, i}
										<tr class="border-muted hover:bg-muted/20 border-b">
											<td class="px-4 py-3 font-medium">
												<div class="flex items-center gap-2">
													{#if track.cover_url}
														<a href={`/track/${track.id}`} class="w-content flex-shrink-0">
															<img
																src={track.cover_url}
																alt={track.title}
																class="h-10 w-10 rounded"
															/>
														</a>
													{:else}
														<div
															class="bg-muted flex h-10 w-10 items-center justify-center rounded"
														>
															<Music class="text-muted-foreground h-5 w-5" />
														</div>
													{/if}
													<div>
														<a href={`/track/${track.id}`} class="hover:underline">{track.title}</a>
														<a
															href={`/artist/${track.artist?.id}`}
															class="text-muted-foreground block hover:underline"
														>
															{track.artist?.artist_name || 'Unknown Artist'}
														</a>
													</div>
												</div>
											</td>
											<td class="text-muted-foreground px-4 py-3"
												>{formatDuration(track.duration)}</td
											>
											<td class="px-4 py-3 text-right">
												<Button
													variant="ghost"
													size="icon"
													class=""
													onclick={() => playerState.playTrack(track)}
												>
													<Play class="h-5 w-5" />
												</Button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>
				{/if}

				<!-- Artists Section -->
				{#if data.results.artists.length > 0}
					<section>
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-semibold">Artists</h2>
							{#if data.results.artists.length > 4}
								<Button variant="ghost" onclick={() => (activeTab = 'artists')}>View All</Button>
							{/if}
						</div>

						<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{#each data.results.artists.slice(0, 4) as artist}
								<a href={`/artist/${artist.id}`} class="group">
									<div class="bg-muted relative mb-3 aspect-square overflow-hidden rounded-full">
										{#if artist.avatar}
											<img
												src={artist.avatar}
												alt={artist.artist_name}
												class="h-full w-full object-cover"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center">
												<Mic class="text-muted-foreground h-1/4 w-1/4" />
											</div>
										{/if}
										<div
											class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
										>
											<Button variant="secondary" size="icon" class="rounded-full">
												<Play class="h-6 w-6" />
											</Button>
										</div>
									</div>
									<h3 class="text-center font-medium">{artist.artist_name}</h3>
									<p class="text-muted-foreground text-center text-sm">Artist</p>
								</a>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Albums Section -->
				{#if data.results.albums.length > 0}
					<section>
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-2xl font-semibold">Albums</h2>
							{#if data.results.albums.length > 4}
								<Button variant="ghost" onclick={() => (activeTab = 'albums')}>View All</Button>
							{/if}
						</div>

						<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{#each data.results.albums.slice(0, 4) as album}
								<a href={`/album/${album.id}`} class="group">
									<div class="bg-muted relative mb-3 aspect-square overflow-hidden rounded-md">
										{#if album.cover_url}
											<img
												src={album.cover_url}
												alt={album.title}
												class="h-full w-full object-cover"
											/>
										{:else}
											<div class="flex h-full w-full items-center justify-center">
												<Disc class="text-muted-foreground h-1/4 w-1/4" />
											</div>
										{/if}
										<div
											class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
										>
											<Button variant="secondary" size="icon" class="rounded-full">
												<Play class="h-6 w-6" />
											</Button>
										</div>
									</div>
									<h3 class="font-medium">{album.title}</h3>
									<p class="text-muted-foreground text-sm">
										{album.artist?.artist_name || 'Unknown Artist'}
									</p>
								</a>
							{/each}
						</div>
					</section>
				{/if}

				{#if data.results.tracks.length === 0 && data.results.artists.length === 0 && data.results.albums.length === 0}
					<div class="py-12 text-center">
						<h2 class="mb-2 text-2xl font-semibold">No results found</h2>
						<p class="text-muted-foreground mb-8">
							We couldn't find any matches for "{data.query}"
						</p>
						<div class="mx-auto max-w-md">
							<h3 class="mb-2 font-medium">Try:</h3>
							<ul class="ml-8 list-disc space-y-1 text-left">
								<li>Checking your spelling</li>
								<li>Using fewer or different keywords</li>
								<li>Searching for a different artist or song</li>
								<li>Browsing genres instead</li>
							</ul>
						</div>
					</div>
				{/if}
			</TabsContent>

			<TabsContent value="tracks">
				<h2 class="mb-4 text-2xl font-semibold">Tracks</h2>
				{#if data.results.tracks.length > 0}
					<div class="bg-card overflow-hidden rounded-lg">
						<table class="w-full table-auto">
							<thead class="bg-muted/50">
								<tr>
									<th class="px-4 py-3 text-left">#</th>
									<th class="px-4 py-3 text-left">Title</th>
									<th class="px-4 py-3 text-left">Artist</th>
									<th class="px-4 py-3 text-left">Album</th>
									<th class="px-4 py-3 text-left">Duration</th>
									<th class="sr-only px-4 py-3 text-left">Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each data.results.tracks as track, i}
									<tr class="border-muted hover:bg-muted/20 group border-b">
										<td class="text-muted-foreground px-4 py-3">{i + 1}</td>
										<td class="px-4 py-3 font-medium">
											<a
												href={`/track/${track.id}`}
												class="flex items-center gap-2 hover:underline"
											>
												{#if track.cover_url}
													<img src={track.cover_url} alt={track.title} class="h-10 w-10 rounded" />
												{:else}
													<div class="bg-muted flex h-10 w-10 items-center justify-center rounded">
														<Music class="text-muted-foreground h-5 w-5" />
													</div>
												{/if}
												<span>{track.title}</span>
											</a>
										</td>
										<td class="px-4 py-3">
											<a
												href={`/artist/${track.artist?.id}`}
												class="text-muted-foreground hover:underline"
											>
												{track.artist?.artist_name || 'Unknown Artist'}
											</a>
										</td>
										<td class="text-muted-foreground px-4 py-3">
											{#if track.album_id}
												<a href={`/album/${track.album_id}`} class="hover:underline"> Album </a>
											{:else}
												Single
											{/if}
										</td>
										<td class="text-muted-foreground px-4 py-3">{formatDuration(track.duration)}</td
										>
										<td class="px-4 py-3 text-right">
											<Button variant="ghost" size="icon" class="opacity-0 group-hover:opacity-100">
												<Play class="h-5 w-5" />
											</Button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="bg-card rounded-lg py-8 text-center">
						<p class="text-muted-foreground">No tracks found for "{data.query}"</p>
					</div>
				{/if}
			</TabsContent>

			<TabsContent value="artists">
				<h2 class="mb-4 text-2xl font-semibold">Artists</h2>
				{#if data.results.artists.length > 0}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each data.results.artists as artist}
							<a href={`/artist/${artist.id}`} class="group">
								<div class="bg-muted relative mb-3 aspect-square overflow-hidden rounded-full">
									{#if artist.profile_url}
										<img
											src={artist.profile_url}
											alt={artist.artist_name}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center">
											<Mic class="text-muted-foreground h-1/4 w-1/4" />
										</div>
									{/if}
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Button variant="secondary" size="icon" class="rounded-full">
											<Play class="h-6 w-6" />
										</Button>
									</div>
								</div>
								<h3 class="text-center font-medium">{artist.artist_name}</h3>
								<p class="text-muted-foreground text-center text-sm">Artist</p>
							</a>
						{/each}
					</div>
				{:else}
					<div class="bg-card rounded-lg py-8 text-center">
						<p class="text-muted-foreground">No artists found for "{data.query}"</p>
					</div>
				{/if}
			</TabsContent>

			<TabsContent value="albums">
				<h2 class="mb-4 text-2xl font-semibold">Albums</h2>
				{#if data.results.albums.length > 0}
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{#each data.results.albums as album}
							<a href={`/album/${album.id}`} class="group">
								<div class="bg-muted relative mb-3 aspect-square overflow-hidden rounded-md">
									{#if album.cover_url}
										<img
											src={album.cover_url}
											alt={album.title}
											class="h-full w-full object-cover"
										/>
									{:else}
										<div class="flex h-full w-full items-center justify-center">
											<Disc class="text-muted-foreground h-1/4 w-1/4" />
										</div>
									{/if}
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
									>
										<Button variant="secondary" size="icon" class="rounded-full">
											<Play class="h-6 w-6" />
										</Button>
									</div>
								</div>
								<h3 class="font-medium">{album.title}</h3>
								<p class="text-muted-foreground text-sm">
									{album.artist?.artist_name || 'Unknown Artist'} •
									{album.type || 'Album'}
								</p>
							</a>
						{/each}
					</div>
				{:else}
					<div class="bg-card rounded-lg py-8 text-center">
						<p class="text-muted-foreground">No albums found for "{data.query}"</p>
					</div>
				{/if}
			</TabsContent>
		</Tabs>
	</div>
</div>
