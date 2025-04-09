<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TrackCreationForm from './TrackCreationForm.svelte';
	import { superValidate, type SuperValidated } from 'sveltekit-superforms/client';
	import { trackCreationSchema, type TrackCreationSchema } from '$lib/schemas/trackSchema';
	import { zod } from 'sveltekit-superforms/adapters';
	// import { Button } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';

	const { Story } = defineMeta({
		title: 'Forms/TrackCreationForm',
		//component: TrackCreationForm,
		component: TrackCreationForm,
		tags: ['autodocs'],
		argTypes: {
			//albums: { control: 'object' }
		}
	});

	// Mock albums for the stories
	const mockAlbums = [
		{ id: 'album-1', title: 'My First Album' },
		{ id: 'album-2', title: 'Second Album' },
		{ id: 'album-3', title: 'Greatest Hits' }
	];
	/*
	const form: TrackCreationSchema = {
		title: 'nope',
    genre: [],
    explicit: false,
    audio_file: null
	};*/

	const form = await superValidate(zod(trackCreationSchema));
</script>

<Story
	name="Default"
	args={{
		data: { form },
		albums: mockAlbums
	}}
/>

<Story
	name="With Initial Values"
	args={{
		data: { form },

		albums: mockAlbums
	}}
/>
