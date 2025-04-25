<script lang="ts">
	import { AlbumArtwork } from '$lib/components/music';

	let { data } = $props();
</script>



<div class="h-full w-screen overflow-hidden py-6 [&>*]:px-4 [&>*]:lg:px-8">
	<section>
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold tracking-tight">Popular albums</h1>
				<p class="text-muted-foreground text-sm">Most listened to.</p>
			</div>
		</div>
		<div class="flex flex-wrap gap-4 mt-4">
            {#each data.albums as album}   
            <a href="/album/{album.id}">
                <AlbumArtwork
                    album={{
                        artist: album.artist.artist_name,
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
            <!-- 
			{#each data.tracks as track}
				<TrackCard
					id={track.id}
					cover_url={track.cover_url}
					title={track.title}
					artist_name={track.artist.artist_name}
					explicit={track.explicit}
				></TrackCard>
			{/each}
             -->
		</div>
	</section>
</div>