<script lang="ts">
	import TrackCard from '$lib/components/app/molecules/track-card/TrackCard.svelte';

	let { data } = $props();
</script>

<div class="h-full w-screen overflow-hidden py-6 [&>*]:px-4 [&>*]:lg:px-8">
	<section>
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<h1 class="text-2xl font-semibold tracking-tight">Tracks on the rise</h1>
				<p class="text-muted-foreground text-sm">Top picks for you. Updated daily.</p>
			</div>
		</div>
		<div class="flex flex-wrap gap-4 mt-4">
			{#each data.tracks as track}
				<TrackCard
					id={track.id}
					cover_url={track.cover_url}
					title={track.title}
					artist_name={track.artist.artist_name}
					explicit={track.explicit}
				></TrackCard>
			{/each}
		</div>
	</section>
</div>
