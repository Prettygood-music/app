<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ArtistCard from './artist-card.svelte';
	import { fn } from '@storybook/test';
	import { createRawSnippet, hydrate } from 'svelte';

	// Sample Artist data
	const mockArtistData = {
		id: "artist-1",
		name: "Nina Netcode",
		avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&dpr=2&q=80"
	};

	const mockArtistNoAvatar = {
		id: "artist-2",
		name: "Lena Logic",
		avatarUrl: null
	};

	const mockArtistLongName = {
		id: "artist-3",
		name: "This is an extremely long artist name that should be truncated in the UI because it's too long to display",
		avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&dpr=2&q=80"
	};

	const { Story } = defineMeta({
		title: 'Music/ArtistCard',
		component: ArtistCard,
		tags: ['autodocs'],
		argTypes: {
			id: { control: 'text' },
			name: { control: 'text' },
			avatarUrl: { control: 'text' },
			size: {
				control: { type: 'select' },
				options: ['default', 'sm', 'lg']
			},
			className: { control: 'text' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		id: mockArtistData.id,
		name: mockArtistData.name,
		avatarUrl: mockArtistData.avatarUrl,
		size: 'default'
	}}
/>

<Story
	name="Small"
	args={{
		id: mockArtistData.id,
		name: mockArtistData.name,
		avatarUrl: mockArtistData.avatarUrl,
		size: 'sm'
	}}
/>

<Story
	name="Large"
	args={{
		id: mockArtistData.id,
		name: mockArtistData.name,
		avatarUrl: mockArtistData.avatarUrl,
		size: 'lg'
	}}
/>

<Story
	name="WithoutAvatar"
	args={{
		id: mockArtistNoAvatar.id,
		name: mockArtistNoAvatar.name,
		avatarUrl: mockArtistNoAvatar.avatarUrl,
		size: 'default'
	}}
/>

<Story
	name="LongName"
	args={{
		id: mockArtistLongName.id,
		name: mockArtistLongName.name,
		avatarUrl: mockArtistLongName.avatarUrl,
		size: 'default'
	}}
/>

<Story
	name="WithCustomClass"
	args={{
		id: mockArtistData.id,
		name: mockArtistData.name,
		avatarUrl: mockArtistData.avatarUrl,
		size: 'default',
		className: 'border-2 border-primary p-2'
	}}
/>