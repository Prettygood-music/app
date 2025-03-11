<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AlbumCard from './album-card.svelte';
	import { fn } from '@storybook/test';
	import { createRawSnippet, hydrate } from 'svelte';

	// Sample Album data
	const mockAlbum = {
		id: "album-1",
		title: "Async Awakenings",
		artist_id: "artist-1",
		artist_name: "Nina Netcode",
		cover_url: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
		release_date: "2023-05-15",
		track_count: 12,
		tracks: []
	};

	const mockAlbumNoCover = {
		...mockAlbum,
		id: "album-2",
		title: "Digital Dreams",
		cover_url: null,
		release_date: "2021-11-03",
		track_count: 9
	};

	const mockAlbumLongTitle = {
		...mockAlbum,
		id: "album-3",
		title: "This is an extremely long album title that should be truncated in the UI because it's too long to display",
		release_date: "2020-02-28",
		track_count: 8
	};

	const { Story } = defineMeta({
		title: 'Music/AlbumCard',
		component: AlbumCard,
		tags: ['autodocs'],
		argTypes: {
			album: { control: 'object' },
			size: {
				control: { type: 'select' },
				options: ['default', 'sm', 'lg']
			},
			aspectRatio: {
				control: { type: 'select' },
				options: ['square', 'portrait', 'video']
			},
			className: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		album: mockAlbum,
		size: 'default',
		aspectRatio: 'square'
	}}
/>

<Story
	name="Small"
	args={{
		album: mockAlbum,
		size: 'sm',
		aspectRatio: 'square'
	}}
/>

<Story
	name="Large"
	args={{
		album: mockAlbum,
		size: 'lg',
		aspectRatio: 'square'
	}}
/>

<Story
	name="Portrait"
	args={{
		album: mockAlbum,
		size: 'default',
		aspectRatio: 'portrait'
	}}
/>

<Story
	name="Video"
	args={{
		album: mockAlbum,
		size: 'default',
		aspectRatio: 'video'
	}}
/>

<Story
	name="WithoutCover"
	args={{
		album: mockAlbumNoCover,
		size: 'default',
		aspectRatio: 'square'
	}}
/>

<Story
	name="LongTitle"
	args={{
		album: mockAlbumLongTitle,
		size: 'default',
		aspectRatio: 'square'
	}}
/>

<Story
	name="WithCustomClass"
	args={{
		album: mockAlbum,
		size: 'default',
		aspectRatio: 'square',
		className: 'border-2 border-primary p-2'
	}}
/>