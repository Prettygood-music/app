<script lang="ts">
	import { invalidate } from '$app/navigation';
	import PlaylistCreationForm from '$lib/components/app/organisms/playlist-creation-form/PlaylistCreationForm.svelte';
	import { Card } from '$lib/components/ui/card';
	import { DEPENDS } from '$lib/constants.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(() => {
		return () => {
			invalidate(DEPENDS.PLAYLISTS);
		};
	});
</script>

<div class="w-full">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Create New Playlist</h1>
			<p class="text-muted-foreground">Create a new playlist</p>
		</div>
	</div>

	<Card class="mt-4 w-full p-6">
		<PlaylistCreationForm data={{ form: data.form }}></PlaylistCreationForm>
		<!-- <TrackCreationForm albums={data.albums} data={{ form: data.form }} /> -->
	</Card>
</div>
