<script lang="ts">
	import ArtistCreationForm from '$lib/components/app/organisms/artist-creation-form/ArtistCreationForm.svelte';

	let { data } = $props();
</script>

<div class="space-y-6 overflow-y-auto p-4 md:p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Create an Artist profile</h1>
			<p class="text-muted-foreground">Start publishing music today.</p>
		</div>
	</div>

	<ArtistCreationForm data={{ form: data.form }}></ArtistCreationForm>
</div>
