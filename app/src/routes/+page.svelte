<script lang="ts">
	import PlusCircled from 'lucide-svelte/icons/plus-circle';
	import {
		AlbumArtwork,
		Menu,
		PodcastEmptyPlaceholder,
		Sidebar
	} from '$lib/components/music/index.js';
	import { playlists } from '$lib/data/playlists.js';
	import { listenNowAlbums, madeForYouAlbums } from '$lib/data/albums.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	let { data } = $props();
</script>

<div class="grid h-full lg:grid-cols-5 overflow-y-auto">
	<!-- <Sidebar {playlists} class="hidden overflow-y-auto lg:block" /> -->
	<!-- <div class="col-span-3 overflow-y-auto lg:col-span-4 lg:border-l"> -->
	<div class="lg:col-span-5">
		<div class="h-full py-6 pl-4 lg:pl-8">
			<div class="flex items-center justify-between">
				<div class="space-y-1">
					<h2 class="text-2xl font-semibold tracking-tight">Listen Now</h2>
					<p class="text-muted-foreground text-sm">Top picks for you. Updated daily.</p>
				</div>
			</div>
			<Separator class="my-4" />

			<div class="relative">
				<div class="space-y-0.5">
					<h3 class="text-lg font-semibold tracking-tight">Recommended Tracks</h3>
					<p class="text-muted-foreground text-sm">Songs you'll like.</p>
				</div>
				<ScrollArea orientation="both" class="mt-4">
					<div class="flex space-x-2 pb-4">
						{#each data.recommendations.tracks as track}
							<!-- 
												<AlbumArtwork
													{album}
													class="w-[250px]"
													aspectRatio="portrait"
													width={250}
													height={330}
												/>
												 -->
							<!-- TODO: we need a way to start playing this track on click or something with a button appearing on hover, see spotify I guess. -->
							<a
								class="hover:bg-muted group flex w-[200px] flex-col rounded-md p-2 duration-200"
								href="/track/{track.id}"
							>
								<div class="aspect-square h-full w-full flex-1 overflow-hidden rounded-md">
									<div
										class="h-full w-full rounded-lg bg-cover bg-center duration-300 group-hover:scale-110"
										style="background-image: url({track.cover_url}); --view-transition-tag:track-image-{track.id};"
									></div>
								</div>
								<div
									class="mt-1 h-fit overflow-hidden text-ellipsis whitespace-nowrap break-keep text-sm"
								>
									<div class=" overflow-hidden">
										{track.title}
									</div>
									<div class="text-muted-foreground mt-0.5 text-xs">
										{track.artist_name}
									</div>
								</div>
							</a>
						{/each}
					</div>
				</ScrollArea>
			</div>

			<Separator class="my-4" />

			<div class="relative">
				<ScrollArea orientation="both">
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
