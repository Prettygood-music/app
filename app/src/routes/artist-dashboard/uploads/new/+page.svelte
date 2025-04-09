<script lang="ts">
	import { goto } from '$app/navigation';
	import TrackCreationForm from '$lib/components/organisms/forms/track-creation/TrackCreationForm.svelte';
	import { Card } from '$lib/components/ui/card';
	import type { TrackCreationData } from '$lib/schemas/trackSchema';

	//export let data;
	let { albums } = $props();
	// Get albums from the server load function

	// Handle form submission
	async function handleSubmit(data: TrackCreationData) {
		try {
			const formData = new FormData();

			// Add all form fields to the FormData
			formData.append('title', data.title);

			if (data.album_id) {
				formData.append('album_id', data.album_id);
			}

			if (data.track_number) {
				formData.append('track_number', data.track_number.toString());
			}

			if (data.genre.length > 0) {
				formData.append('genre', JSON.stringify(data.genre));
			}

			formData.append('explicit', data.explicit.toString());

			if (data.release_date) {
				formData.append('release_date', data.release_date);
			}

			if (data.isrc) {
				formData.append('isrc', data.isrc);
			}

			if (data.lyrics) {
				formData.append('lyrics', data.lyrics);
			}

			// Add files last (they're usually the largest)
			formData.append('audio_file', data.audio_file);

			if (data.cover_image) {
				formData.append('cover_image', data.cover_image);
			}

			// Send the request to the API
			const response = await fetch('/api/tracks', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to upload track');
			}

			const result = await response.json();

			// Navigate back to the uploads page on success
			await goto('/artist-dashboard/uploads');
		} catch (error) {
			console.error('Error submitting form:', error);
			// In a real app, show an error toast or message to the user
			alert('Failed to upload track. Please try again.');
		}
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight">Upload New Track</h1>
			<p class="text-muted-foreground">Create and publish your music for the world to hear</p>
		</div>
	</div>

	<Card class="p-6">
		<TrackCreationForm onSubmit={handleSubmit} {albums} />
	</Card>
</div>
