<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Switch } from '$lib/components/ui/switch';
	import { FileInput } from '$lib/components/ui/file-input';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { createForm, superForm } from 'superforms/client';
	import { trackCreationSchema, type TrackCreationData } from '$lib/schemas/trackSchema';
	import { X } from 'lucide-svelte';

	// Form event
	/*
  export let onSubmit: (data: TrackCreationData) => Promise<void>;
  export let initialValues: Partial<TrackCreationData> = {};
  export let albums: { id: string; title: string }[] = [];
  */
	let { onSubmit, initialValues, albums } = $props();
	// Available genres
	const availableGenres = [
		'Pop',
		'Rock',
		'Hip-Hop',
		'Rap',
		'R&B',
		'Electronic',
		'Dance',
		'Jazz',
		'Blues',
		'Country',
		'Folk',
		'Classical',
		'Metal',
		'Punk',
		'Reggae',
		'Soul',
		'Funk',
		'Ambient',
		'World',
		'Latin',
		'Indie',
		'Alternative',
		'Experimental'
	];

	// Form state
	const defaultValues: TrackCreationData = {
		title: '',
		album_id: null,
		track_number: null,
		genre: [],
		explicit: false,
		release_date: null,
		isrc: null,
		lyrics: null,
		audio_file: null as any, // This will be set via the file input
		cover_image: null
	};

	// Create the form with initial values merged with defaults
	const form = createForm(trackCreationSchema, {
		id: 'track-creation-form',
		dataDefaults: { ...defaultValues, ...initialValues }
	});

	const {
		form: formData,
		errors,
		enhance
	} = superForm(form, {
		onSubmit: async ({ formData, cancel }) => {
			// Cancel the default superForm submission
			cancel();

			// Submit the form data through the provided callback
			try {
				await onSubmit(formData);
			} catch (error) {
				console.error('Error submitting form:', error);
			}
		}
	});

	// Audio file preview state
	let audioPreview = $state<string | null>(null);
	let audioDuration = $state<number>(0);
	let isAudioLoading = $state(false);

	// Cover image preview state
	let imagePreview = $state<string | null>(null);

	// Selected genre for adding
	let selectedGenre = $state('');

	// Handle audio file selection
	function handleAudioChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		$formData.audio_file = file;

		// Create audio preview and extract duration
		isAudioLoading = true;
		const reader = new FileReader();
		reader.onload = (e) => {
			const result = e.target?.result as string;
			audioPreview = result;

			// Extract duration
			const audio = new Audio();
			audio.src = result;
			audio.onloadedmetadata = () => {
				audioDuration = audio.duration;
				isAudioLoading = false;
			};
		};
		reader.readAsDataURL(file);
	}

	// Handle cover image selection
	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		$formData.cover_image = file;

		// Create image preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	// Add genre to the list
	function addGenre() {
		if (selectedGenre && !$formData.genre.includes(selectedGenre)) {
			$formData.genre = [...$formData.genre, selectedGenre];
			selectedGenre = '';
		}
	}

	// Remove genre from the list
	function removeGenre(genreToRemove: string) {
		$formData.genre = $formData.genre.filter((genre) => genre !== genreToRemove);
	}

	// Format time for display
	function formatTime(seconds: number): string {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}
</script>

<form method="POST" on:submit|preventDefault use:enhance class="space-y-6">
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Upload Track</h2>
			<p class="text-muted-foreground mb-4">
				Complete the form below to upload your track. Fields marked with * are required.
			</p>
		</div>

		<!-- Audio File Upload -->
		<div class="space-y-2">
			<Label for="audio_file" class="block"
				>Audio File <span class="text-destructive">*</span></Label
			>
			<FileInput
				id="audio_file"
				name="audio_file"
				accept="audio/*"
				on:change={handleAudioChange}
				error={$errors.audio_file}
				required
			/>

			{#if isAudioLoading}
				<div class="text-muted-foreground mt-2 text-sm">Loading audio...</div>
			{:else if audioPreview}
				<Card class="mt-2">
					<CardContent class="p-4">
						<audio controls src={audioPreview} class="w-full"></audio>
						<p class="mt-2 text-sm">Duration: {formatTime(audioDuration)}</p>
					</CardContent>
				</Card>
			{/if}
		</div>

		<!-- Track Title -->
		<div class="space-y-2">
			<Label for="title" class="block">Title <span class="text-destructive">*</span></Label>
			<Input
				id="title"
				name="title"
				bind:value={$formData.title}
				placeholder="Enter track title"
				class={$errors.title ? 'border-destructive' : ''}
				required
			/>
			{#if $errors.title}
				<p class="text-destructive text-sm">{$errors.title}</p>
			{/if}
		</div>

		<!-- Cover Image -->
		<div class="space-y-2">
			<Label for="cover_image" class="block">Cover Image</Label>
			<FileInput
				id="cover_image"
				name="cover_image"
				accept="image/*"
				on:change={handleImageChange}
				error={$errors.cover_image}
			/>

			{#if imagePreview}
				<div class="border-border mt-2 h-40 w-40 overflow-hidden rounded border">
					<img src={imagePreview} alt="Cover preview" class="h-full w-full object-cover" />
				</div>
			{/if}
		</div>

		<!-- Album & Track Number (if part of an album) -->
		<div class="space-y-2">
			<Label for="album_id" class="block">Album (Optional)</Label>
			<select
				id="album_id"
				name="album_id"
				bind:value={$formData.album_id}
				class="bg-background border-input w-full rounded-md border px-3 py-2"
			>
				<option value="">Select Album</option>
				{#each albums as album}
					<option value={album.id}>{album.title}</option>
				{/each}
			</select>

			{#if $formData.album_id}
				<div class="mt-2">
					<Label for="track_number" class="block">Track Number</Label>
					<Input
						id="track_number"
						name="track_number"
						type="number"
						bind:value={$formData.track_number}
						min="1"
						placeholder="Track position in album"
					/>
				</div>
			{/if}
		</div>

		<!-- Genre Tags -->
		<div class="space-y-2">
			<Label class="block">Genre</Label>
			<div class="mb-2 flex flex-wrap gap-2">
				{#each $formData.genre as genre}
					<Badge variant="secondary" class="gap-1 pr-1">
						{genre}
						<button
							type="button"
							class="hover:bg-muted ml-1 rounded-full p-1"
							on:click={() => removeGenre(genre)}
						>
							<X class="h-3 w-3" />
						</button>
					</Badge>
				{/each}

				{#if $formData.genre.length === 0}
					<p class="text-muted-foreground text-sm">No genres selected</p>
				{/if}
			</div>

			<div class="flex gap-2">
				<select
					bind:value={selectedGenre}
					class="bg-background border-input flex-1 rounded-md border px-3 py-2"
				>
					<option value="">Select a genre</option>
					{#each availableGenres.filter((g) => !$formData.genre.includes(g)) as genre}
						<option value={genre}>{genre}</option>
					{/each}
				</select>
				<Button type="button" variant="outline" on:click={addGenre} disabled={!selectedGenre}
					>Add</Button
				>
			</div>
		</div>

		<!-- Explicit Content -->
		<div class="flex items-center space-x-2">
			<Switch
				id="explicit"
				name="explicit"
				checked={$formData.explicit}
				onCheckedChange={(checked) => ($formData.explicit = checked)}
			/>
			<Label for="explicit">Explicit Content</Label>
		</div>

		<!-- Release Date -->
		<div class="space-y-2">
			<Label for="release_date" class="block">Release Date</Label>
			<Input
				id="release_date"
				name="release_date"
				type="date"
				bind:value={$formData.release_date}
			/>
		</div>

		<!-- ISRC -->
		<div class="space-y-2">
			<Label for="isrc" class="block">ISRC (Optional)</Label>
			<Input
				id="isrc"
				name="isrc"
				bind:value={$formData.isrc}
				placeholder="International Standard Recording Code"
			/>
			<p class="text-muted-foreground text-xs">
				The International Standard Recording Code (ISRC) uniquely identifies recordings
			</p>
		</div>

		<!-- Lyrics -->
		<div class="space-y-2">
			<Label for="lyrics" class="block">Lyrics (Optional)</Label>
			<Textarea
				id="lyrics"
				name="lyrics"
				bind:value={$formData.lyrics}
				placeholder="Enter lyrics"
				rows="6"
			/>
		</div>
	</div>

	<div class="flex justify-end gap-2 border-t pt-4">
		<Button type="button" variant="outline">Cancel</Button>
		<Button type="submit" disabled={isAudioLoading || !$formData.audio_file}>Save Track</Button>
	</div>
</form>
