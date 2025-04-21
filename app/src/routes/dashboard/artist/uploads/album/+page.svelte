<script lang="ts">
	import AlbumCreationForm from '$lib/components/app/organisms/album-creation-form/AlbumCreationForm.svelte';
	import { Card } from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Create New Album</h1>
			<p class="text-muted-foreground">Create and publish a new album</p>
		</div>
	</div>

	<Card class="p-6">
		<AlbumCreationForm data={{ form: data.form }} />
	</Card>
</div>
