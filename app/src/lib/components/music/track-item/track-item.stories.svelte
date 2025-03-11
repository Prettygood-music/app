<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TrackItem from './track-item.svelte';
	import { fn } from '@storybook/test';
	import { createRawSnippet, hydrate } from 'svelte';

	// Sample Track data
	const mockTrack = {
		id: "track-1",
		title: "Recursive Rhythms",
		artist_id: "artist-1",
		artist_name: "Nina Netcode",
		album_id: "album-1",
		album_name: "Async Awakenings",
		cover_url: "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
		duration: 245,
		playback_url: "#",
		published_at: "2023-05-15",
		genres: ["Electronic", "Ambient"],
		play_count: 1245678
	};

	const mockTrackNoCover = {
		...mockTrack,
		id: "track-2",
		title: "Binary Sunset",
		cover_url: null,
		play_count: 5000
	};

	const mockTrackLongTitle = {
		...mockTrack,
		id: "track-3",
		title: "This is an extremely long track title that should be truncated in the UI because it's too long to display",
		play_count: 100
	};

	const { Story } = defineMeta({
		title: 'Music/TrackItem',
		component: TrackItem,
		tags: ['autodocs'],
		argTypes: {
			track: { control: 'object' },
			index: { control: 'number' },
			showIndex: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Default"
	args={{
		track: mockTrack,
		index: 0,
		showIndex: true
	}}
/>

<Story
	name="WithoutIndex"
	args={{
		track: mockTrack,
		showIndex: false
	}}
/>

<Story
	name="WithoutCover"
	args={{
		track: mockTrackNoCover,
		index: 1,
		showIndex: true
	}}
/>

<Story
	name="LongTitle"
	args={{
		track: mockTrackLongTitle,
		index: 2,
		showIndex: true
	}}
/>

<Story
	name="SmallPlayCount"
	args={{
		track: {
			...mockTrack,
			play_count: 42
		},
		index: 3,
		showIndex: true
	}}
/>

<Story
	name="LargePlayCount"
	args={{
		track: {
			...mockTrack,
			play_count: 42000000
		},
		index: 4,
		showIndex: true
	}}
/>