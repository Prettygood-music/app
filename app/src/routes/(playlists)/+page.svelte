<script lang="ts">
	import TrackCard from '$lib/components/app/molecules/track-card/TrackCard.svelte';
	import { AlbumArtwork } from '$lib/components/music/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { LINKS } from '$lib/constants.js';
	import { madeForYouAlbums } from '$lib/data/albums.js';

	let { data } = $props();
</script>

<div class="grid h-full overflow-y-auto lg:grid-cols-5">
	<!-- <div class="col-span-3 overflow-y-auto lg:col-span-4 lg:border-l"> -->
	<div class="lg:col-span-5">
		<div class="h-full w-screen overflow-hidden py-6 [&>*]:px-4 [&>*]:lg:px-8">
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
					<p class="text-muted-foreground text-sm">Top picks for you. Updated daily.</p>
				</div>
			</div>
			<Separator class="my-4" />

			<div class="relative">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<h3 class="text-lg font-semibold tracking-tight">Recommended Tracks</h3>
						<p class="text-muted-foreground text-sm">Songs you'll like.</p>
					</div>

					<Button variant="ghost" href={LINKS.TRACKS.ROOT}>See more</Button>
				</div>
				<ScrollArea orientation="horizontal" class="mt-4">
					<div class="flex space-x-2 pb-4">
						{#each data.recommendations.tracks as track}
							<TrackCard
								id={track.id}
								cover_url={track.cover_url}
								title={track.title}
								artist_name={track.artist.artist_name}
								explicit={track.explicit}
							></TrackCard>
						{/each}
					</div>
				</ScrollArea>
			</div>

			<Separator class="my-4" />

			<div class="relative">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<h3 class="text-lg font-semibold tracking-tight">Popular Albums</h3>
						<p class="text-muted-foreground text-sm">On the rise.</p>
					</div>

					<Button variant="ghost" href={LINKS.ALBUMS.ROOT}>See more</Button>
				</div>
				<ScrollArea orientation="both" class="mt-4">
					<div class="flex space-x-4 pb-4">
						<!-- {#each listenNowAlbums as album} -->
						{#each data.recommendations.albums as album}
							<a href="/album/{album.id}">
								<AlbumArtwork
									album={{
										artist: album.artist_name,
										cover: album.cover_url,
										name: album.title
									}}
									class="w-[250px]"
									aspectRatio="portrait"
									width={250}
									height={330}
								/>
							</a>
						{/each}
					</div>
				</ScrollArea>
			</div>
			<div class="mt-6 space-y-1">
				<h2 class="text-2xl font-semibold tracking-tight">Made for You</h2>
				<p class="text-muted-foreground text-sm">Your personal playlists. Updated daily.</p>
			</div>
			<Separator class="my-4" />
			<div class="relative">
				<ScrollArea orientation="both">
					<div class="flex space-x-4 pb-4">
						{#each madeForYouAlbums as album}
							<AlbumArtwork
								{album}
								class="w-[150px]"
								aspectRatio="square"
								width={150}
								height={150}
							/>
						{/each}
					</div>
				</ScrollArea>
			</div>
		</div>
	</div>
</div>
