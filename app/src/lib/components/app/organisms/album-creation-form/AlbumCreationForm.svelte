<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	//import { schema, type Schema } from '$lib/schemas/schema';
	import { album } from '$lib/schemas';
	import X from 'lucide-svelte/icons/x';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { availableGenres } from '$lib/constants';
	import SpinnerButton from '../../atoms/spinner-button/SpinnerButton.svelte';
	import { toast } from 'svelte-sonner';

	let {
		data
	}: {
		data: { form: SuperValidated<album.Schema> };
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(album.schema)
	});
	const { form: formData, enhance, submitting, message } = form;

	message.subscribe((msg) => {
		if (msg) {
			switch (msg.type) {
				case 'error':
					toast.error(msg.text);
					break;
				case 'success':
					toast.success(msg.text);
					break;
				default:
					break;
			}
		}
	});

	const coverFile = fileProxy(formData, 'cover_image');

	// Cover image preview state
	let imagePreview = $state<string | null>(null);

	// Selected genre for adding
	let selectedGenre = $state('');

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
</script>

<form method="POST" use:enhance class="space-y-6" enctype="multipart/form-data">
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Create Item</h2>
			<p class="text-muted-foreground mb-4">
				Complete the form below to create your item. Fields marked with * are required.
			</p>
		</div>

		<!-- Title -->
		<div class="space-y-2">
			<Form.Field {form} name="title">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Title <span class="text-destructive">*</span></Form.Label>
						<Input {...props} bind:value={$formData.title} placeholder="Enter title" required />
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

		<!-- Description -->
		<div class="space-y-2">
			<Form.Field {form} name="description">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Description (Optional)</Form.Label>
						<Textarea
							{...props}
							bind:value={$formData.description}
							placeholder="Enter description"
							rows={4}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<!-- Genre Tags -->
		<div class="space-y-2">
			<Form.Field {form} name="genre">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label class="block">Genre</Form.Label>
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
		</div>

		<!-- Release Date -->
		<div class="space-y-2">
			<Form.Field {form} name="release_date">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label for="release_date" class="block">Release Date (Optional)</Form.Label>
						<Input {...props} type="date" bind:value={$formData.release_date} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>

	<div class="flex justify-end gap-2 border-t pt-4">
		<SpinnerButton showSpinner={$submitting} variant="outline" type="button">Cancel</SpinnerButton>

		<SpinnerButton showSpinner={$submitting} type="submit">Save</SpinnerButton>
	</div>
</form>
<SuperDebug data={$formData}></SuperDebug>
