<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { artist } from '$lib/schemas';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Badge } from '$lib/components/ui/badge';
	import { X } from 'lucide-svelte';
	import { availableGenres } from '$lib/constants';
	import SpinnerButton from '../../atoms/spinner-button/SpinnerButton.svelte';

	let {
		data
	}: {
		data: { form: SuperValidated<artist.Schema> };
	} = $props();

	const form = superForm(data.form, {
		validators: zodClient(artist.schema)
	});
	const { form: formData, enhance, submitting } = form;

	const avatarFile = fileProxy(formData, 'avatar');
	let avatarPreview = $state<string | null>(null);

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.length) return;

		const file = input.files[0];
		$formData.avatar = file;

		// Create image preview
		const reader = new FileReader();
		reader.onload = (e) => {
			avatarPreview = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	let selectedGenre = $state('');
	function addGenre() {
		if (selectedGenre && !$formData.genre.includes(selectedGenre)) {
			$formData.genre = [...$formData.genre, selectedGenre];
			selectedGenre = '';
		}
	}
	function removeGenre(genreToRemove: string) {
		$formData.genre = $formData.genre.filter((genre) => genre !== genreToRemove);
	}
</script>

<form use:enhance class="space-y-6" method="POST" enctype="multipart/form-data">
	<div class="space-y-2">
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name <span class="text-destructive">*</span></Form.Label>
					<Input
						{...props}
						bind:value={$formData.name}
						placeholder="Enter your artist name"
						required
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<!-- Cover Image -->
	<div class="space-y-2">
		<Form.Field {form} name="avatar">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Avatar</Form.Label>
					<Input
						onchange={handleImageChange}
						placeholder="Select an image"
						{...props}
						type="file"
						accept="image/*"
						bind:files={$avatarFile}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		{#if avatarPreview}
			<div class="border-border mt-2 h-40 w-40 overflow-hidden rounded border">
				<img src={avatarPreview} alt="Cover preview" class="h-full w-full object-cover" />
			</div>
		{/if}
	</div>

	<div class="space-y-2">
		<Form.Field {form} name="bio">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Biography (Optional)</Form.Label>
					<Textarea
						{...props}
						bind:value={$formData.bio}
						placeholder="Enter a biography"
						rows={4}
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

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
	<div class="space-y-2">
		<Form.Field {form} name="location">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Location</Form.Label>
					<Input {...props} bind:value={$formData.location} placeholder="United States" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="space-y-2">
		<Form.Field {form} name="website">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Website</Form.Label>
					<Input {...props} bind:value={$formData.website} placeholder="https://mywebsite.com" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<div class="space-y-2">
		<h3 class="text-xl font-medium">Socials</h3>

		<div class="grid grid-cols-2 gap-4">
			<Form.Field {form} name="twitter">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>X (Twitter)</Form.Label>
						<Input {...props} bind:value={$formData.twitter} placeholder="handle" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="instagram">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Instagram</Form.Label>
						<Input {...props} bind:value={$formData.instagram} placeholder="handle" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>

	<div>
		<SpinnerButton showSpinner={$submitting} type="submit">Create Artist Profile</SpinnerButton>
	</div>
</form>

<SuperDebug data={$formData}></SuperDebug>
