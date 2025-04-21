<script lang="ts">
	import TrackCreationForm from '$lib/components/app/organisms/track-creation-form/TrackCreationForm.svelte';
	import { Card } from '$lib/components/ui/card';

	//export let data;
	let { data } = $props();
	// Get albums from the server load function
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Upload New Track</h1>
			<p class="text-muted-foreground">Create and publish your music for the world to hear</p>
		</div>
	</div>

	<Card class="p-6">
		<TrackCreationForm albums={data.albums} data={{ form: data.form }} />
	</Card>
</div>
