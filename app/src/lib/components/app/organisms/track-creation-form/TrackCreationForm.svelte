<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';

	import { trackCreationSchema, type TrackCreationSchema } from '$lib/schemas/trackSchema';
	import X from 'lucide-svelte/icons/x';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select';

	let {
		albums,
		data
	}: {
		data: { form: SuperValidated<TrackCreationSchema> };
		albums: { id: string; title: string }[];
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(trackCreationSchema)
	});
	const { form: formData, enhance } = form;

	const audioFile = fileProxy(formData, 'audio_file');
	const coverFile = fileProxy(formData, 'cover_image');

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

	// Audio file preview state
	let audioPreview = $state<string | null>(null);
	let audioDuration = $state<number>(0);
	$effect(() => {
		$formData.duration = audioDuration;
	});
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
		//$formData.audio_file = file;

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
		console.dir(file);
		$formData.cover_image = file;

		// Create image preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);
		// imagePreview =
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

<form method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Upload Track</h2>
			<p class="text-muted-foreground mb-4">
				Complete the form below to upload your track. Fields marked with * are required.
			</p>
		</div>

		<!-- Audio File Upload -->
		<div class="space-y-2">
			<Form.Field {form} name="audio_file">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Audio File <span class="text-destructive">*</span></Form.Label>

						<Input
							{...props}
							bind:files={$audioFile}
							onchange={handleAudioChange}
							type="file"
							accept="audio/*"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if isAudioLoading}
				<div class="text-muted-foreground mt-2 text-sm">Loading audio...</div>
			{:else if $formData.audio_file}
				<Card class="mt-2">
					<CardContent class="p-4">
						<audio controls src={audioPreview} class="w-full"></audio>
						<p class="mt-2 text-sm">Duration: {formatTime(audioDuration)}</p>
					</CardContent>
				</Card>
			{/if}
			<Form.Field {form} name="duration" >
				<Form.Control>
					{#snippet children({ props })}
						<!-- <Form.Label>Duration</Form.Label> -->

						<Input {...props} value={$formData.duration} type="hidden" />
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>

		<!-- Track Title -->
		<div class="space-y-2">
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title <span class="text-destructive">*</span></Form.Label>
						<Input
							{...props}
							bind:value={$formData.title}
							placeholder="Enter track title"
							required
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Cover Image -->
		<div class="space-y-2">
			<Form.Field {form} name="cover_image">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Cover Image</Form.Label>
						<Input
							onchange={handleImageChange}
							placeholder="Select an image"
							{...props}
							type="file"
							accept="image/*"
							bind:files={$coverFile}
						/>
						<!-- value={$formData.cover_image} -->
						<!-- bind:value={$formData.cover_image} -->
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if imagePreview}
				<div class="border-border mt-2 h-40 w-40 overflow-hidden rounded border">
					<img src={imagePreview} alt="Cover preview" class="h-full w-full object-cover" />
				</div>
			{/if}
		</div>

		<!-- Album & Track Number (if part of an album) -->
		<div class="space-y-2">
			<Form.Field {form} name="album_id">
				<Form.Control>
					{#snippet children({ props })}
						{@const hasAlbums = albums.length > 0}
						{@const albumDisplay = $formData.album_id
							? albums.find((a) => a.id === $formData.album_id)?.title
							: null}
						<Form.Label for="album_id" class="block">Album (Optional)</Form.Label>

						<Select.Root
							type="single"
							disabled={!hasAlbums}
							bind:value={$formData.album_id}
							name={props.name}
						>
							<Select.Trigger {...props}>
								{albumDisplay ? albumDisplay : hasAlbums ? 'Select Album' : 'No album found'}
							</Select.Trigger>
							<Select.Content>
								{#each albums as album}
									<Select.Item value={album.id}>{album.title}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if $formData.album_id}
				<div class="mt-2">
					<Form.Field {form} name="track_number">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Track Number</Form.Label>
								<Input
									{...props}
									type="number"
									bind:value={$formData.track_number}
									min="1"
									placeholder="Track position in album"
								/>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}
		</div>

		<!-- Genre Tags -->
		<div class="space-y-2">
			<Form.Field {form} name="genre">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="block">Genres</Form.Label>
						<Select.Root type="multiple" bind:value={$formData.genre} name={props.name}>
							<Select.Trigger {...props}>Select Genres</Select.Trigger>
							<Select.Content>
								{#each availableGenres as genre}
									<Select.Item value={genre}>{genre}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<div class="mb-2 flex flex-wrap gap-2">
							{#each $formData.genre as genre}
								<Badge variant="secondary" class="gap-1 pr-1">
									{genre}
									<button
										type="button"
										class="hover:bg-muted ml-1 rounded-full p-1"
										onclick={() => removeGenre(genre)}
									>
										<X class="h-3 w-3" />
									</button>
								</Badge>
							{/each}

							{#if $formData.genre.length === 0}
								<p class="text-muted-foreground text-sm">No genres selected</p>
							{/if}
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<!-- 
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
				<Button type="button" variant="outline" onclick={addGenre} disabled={!selectedGenre}
					>Add</Button
				>
			</div>
			 -->
		</div>

		<!-- Explicit Content -->
		<div class="flex items-center space-x-2">
			<Form.Field {form} name="explicit">
				<Form.Control>
					{#snippet children({ props })}
						<Switch
							{...props}
							checked={$formData.explicit}
							onCheckedChange={(checked) => ($formData.explicit = checked)}
						/>
						<Form.Label>Explicit Content</Form.Label>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Release Date -->
		<div class="space-y-2">
			<Form.Field {form} name="release_date">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label for="release_date" class="block">Release Date</Form.Label>
						<Input {...props} type="date" bind:value={$formData.release_date} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- ISRC -->
		<div class="space-y-2">
			<Form.Field {form} name="isrc">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>ISRC (Optional)</Form.Label>
						<Input
							{...props}
							bind:value={$formData.isrc}
							placeholder="International Standard Recording Code"
						/>
						<p class="text-muted-foreground text-xs">
							The International Standard Recording Code (ISRC) uniquely identifies recordings
						</p>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Lyrics -->
		<div class="space-y-2">
			<Form.Field {form} name="lyrics">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Lyrics (Optional)</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.lyrics}
							placeholder="Enter lyrics"
							rows={6}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>

	<div class="flex justify-end gap-2 border-t pt-4">
		<Button type="button" variant="outline">Cancel</Button>
		<Button type="submit" disabled={isAudioLoading || !$formData.audio_file}>Save Track</Button>
	</div>
</form>
<SuperDebug data={$formData}></SuperDebug>
