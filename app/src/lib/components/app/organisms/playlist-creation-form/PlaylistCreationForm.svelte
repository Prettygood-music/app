<script lang="ts">
	import { playlist } from '$lib/schemas';
	import type { PlaylistCreationSchema } from '$lib/schemas/playlist';
	import SuperDebug, { fileProxy, superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Button } from '$lib/components/ui/button';

	let { data }: { data: { form: SuperValidated<PlaylistCreationSchema> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(playlist.playlistCreationSchema)
	});
	const { form: formData, enhance } = form;

	const coverFile = fileProxy(formData, 'cover_image');

	let imagePreview = $state<string | null>(null);

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
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<div class="space-y-6">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Create a new playlist</h2>
			<p class="text-muted-foreground mb-4">
				Complete the form below to upload your track. Fields marked with * are required.
			</p>
		</div>

		<div class="space-y-2">
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name <span class="text-destructive">*</span></Form.Label>
						<Input
							{...props}
							bind:value={$formData.name}
							placeholder="Enter playlist name"
							required
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
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
		<Form.Field
			{form}
			name="isPublic"
			class="flex flex-row items-center justify-between rounded-lg border p-4"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-0.5">
						<Form.Label>Make playlist public</Form.Label>
						<Form.Description>Let other users listen to this playlist.</Form.Description>
					</div>
					<Switch {...props} bind:checked={$formData.isPublic} />
				{/snippet}
			</Form.Control>
		</Form.Field>
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
	</div>

	<div class="flex justify-end gap-2 border-t pt-4">
		<Button type="submit" >Create Playlist</Button>
	</div>
</form>
<SuperDebug data={$formData}></SuperDebug>
