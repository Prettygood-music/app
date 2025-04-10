<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ArtistProfileTemplate from './ArtistProfileTemplate.svelte';
	import { action } from '@storybook/addon-actions';

	// Mock data for our stories
	const mockTrack = (id, title, duration) => ({
		id,
		title,
		duration,
		plays: Math.floor(Math.random() * 1000000),
		artist_name: 'Artist Name',
		album_title: 'Album Title',
		cover_url: `https://picsum.photos/seed/${id}/300/300`
	});

	const mockAlbum = (id, title, tracks) => ({
		id,
		title,
		tracks,
		artist_name: 'Artist Name',
		release_date: '2023-01-01',
		cover_url: `https://picsum.photos/seed/${id}/300/300`
	});

	// Create mockups for different artists
	
	// Electronic music artist with a lot of content
	const electronicArtist = {
		id: 'artist-1',
		artist_name: 'Electronic Dreams',
		cover_url: 'https://picsum.photos/seed/electronic/1200/400',
		avatar_url: 'https://picsum.photos/seed/electronicavatar/300/300',
		bio: 'Electronic Dreams has been at the forefront of the electronic music scene for over a decade. With innovative sounds and groundbreaking productions, they have established themselves as pioneers in the genre, constantly pushing boundaries and exploring new sonic territories.',
		tracks: [
			mockTrack('track-1', 'Digital Horizon', 210),
			mockTrack('track-2', 'Synthetic Emotions', 185),
			mockTrack('track-3', 'Binary Sunset', 240),
			mockTrack('track-4', 'Quantum Particles', 195),
			mockTrack('track-5', 'Neural Networks', 225)
		],
		albums: [
			mockAlbum('album-1', 'Digital Landscapes', 8),
			mockAlbum('album-2', 'Electronic Universe', 10),
			mockAlbum('album-3', 'Futuristic Sounds', 7),
			mockAlbum('album-4', 'Synthetic Symphony', 9),
			mockAlbum('album-5', 'Virtual Reality', 6)
		],
		social_links: {
			website: 'https://electronicdreams.com',
			twitter: 'electronicdreams',
			instagram: 'electronicdreams'
		},
		stats: {
			monthlyListeners: '2.5 Million',
			totalPlays: '45.8 Million',
			activeSince: '2010',
			origin: 'Berlin, Germany'
		},
		genres: ['Electronic', 'Ambient', 'Techno', 'IDM', 'Glitch', 'Downtempo']
	};
	
	// New folk artist with minimal content
	const folkArtist = {
		id: 'artist-2',
		artist_name: 'Whisper Woods',
		avatar_url: 'https://picsum.photos/seed/folkavatar/300/300',
		bio: 'Whisper Woods is an emerging folk artist known for soulful vocals and poetic lyrics. Drawing inspiration from nature and everyday life, their music creates an intimate atmosphere that resonates with listeners seeking authentic storytelling.',
		tracks: [
			mockTrack('track-6', 'Forest Memories', 240),
			mockTrack('track-7', 'Autumn Leaves', 210)
		],
		albums: [
			mockAlbum('album-6', 'Nature\'s Whispers', 6)
		],
		social_links: {
			instagram: 'whisperwoods'
		},
		stats: {
			monthlyListeners: '50K',
			totalPlays: '500K',
			activeSince: '2022',
			origin: 'Portland, USA'
		},
		genres: ['Folk', 'Acoustic', 'Singer-Songwriter']
	};
	
	// Hip hop artist with medium amount of content
	const hipHopArtist = {
		id: 'artist-3',
		artist_name: 'Rhythm Republic',
		cover_url: 'https://picsum.photos/seed/hiphop/1200/400',
		avatar_url: 'https://picsum.photos/seed/hiphopavatar/300/300',
		bio: 'Rhythm Republic brings raw energy and authentic storytelling to the hip hop scene. With hard-hitting beats and lyrical prowess, they have carved out a unique place in the industry, collaborating with both mainstream artists and underground talents to create a diverse catalog of music.',
		tracks: [
			mockTrack('track-8', 'Urban Flow', 195),
			mockTrack('track-9', 'City Lights', 215),
			mockTrack('track-10', 'Midnight Drive', 225),
			mockTrack('track-11', 'Street Poetry', 185)
		],
		albums: [
			mockAlbum('album-7', 'Street Chronicles', 12),
			mockAlbum('album-8', 'Urban Legends', 10),
			mockAlbum('album-9', 'Rhythm & Poetry', 8)
		],
		social_links: {
			website: 'https://rhythmrepublic.com',
			twitter: 'rhythmrepublic',
			instagram: 'rhythmrepublic'
		},
		stats: {
			monthlyListeners: '1.2 Million',
			totalPlays: '27.4 Million',
			activeSince: '2015',
			origin: 'Atlanta, USA'
		},
		genres: ['Hip Hop', 'Rap', 'Trap', 'R&B']
	};
	
	// Artist without bio, social links or stats
	const minimalArtist = {
		id: 'artist-4',
		artist_name: 'Mystery Artist',
		avatar_url: 'https://picsum.photos/seed/mysteryavatar/300/300',
		tracks: [
			mockTrack('track-12', 'Unknown Path', 200)
		],
		albums: [],
		genres: ['Experimental']
	};

	// Mock similar artists for all stories
	const mockSimilarArtists = [
		{
			id: 'similar-1',
			display_name: 'Dream Logic',
			avatar_url: 'https://picsum.photos/seed/artist1/300/300'
		},
		{
			id: 'similar-2',
			display_name: 'Sonic Wave',
			avatar_url: 'https://picsum.photos/seed/artist2/300/300'
		},
		{
			id: 'similar-3',
			display_name: 'Digital Horizon',
			avatar_url: 'https://picsum.photos/seed/artist3/300/300'
		},
		{
			id: 'similar-4',
			display_name: 'Binary Sunset',
			avatar_url: 'https://picsum.photos/seed/artist4/300/300'
		}
	];

	// Event actions for Storybook
	const eventHandlers = {
		onToggleFollow: action('Toggle Follow'),
		onTipArtist: action('Tip Artist'),
		onShare: action('Share Artist'),
		onSeeAllTracks: action('See All Tracks'),
		onSeeAllAlbums: action('See All Albums'),
		onSeeAllSimilarArtists: action('See All Similar Artists')
	};

	const { Story } = defineMeta({
		title: 'Templates/ArtistProfileTemplate',
		component: ArtistProfileTemplate,
		tags: ['autodocs'],
		argTypes: {
			artist: { control: 'object' },
			similarArtists: { control: 'object' },
			initialIsFollowing: { control: 'boolean' },
			initialSelectedTab: { 
				control: { type: 'select', options: ['overview', 'albums', 'about'] }
			},
			pageTitle: { control: 'text' },
			pageDescription: { control: 'text' }
		}
	});
</script>

<Story
	name="Electronic Artist"
	args={{
		artist: electronicArtist,
		similarArtists: mockSimilarArtists,
		initialIsFollowing: false,
		initialSelectedTab: 'overview',
		pageTitle: 'Electronic Dreams | prettygood.music',
		pageDescription: 'Electronic Dreams has been at the forefront of the electronic music scene for over a decade.',
		...eventHandlers
	}}
/>

<Story
	name="Folk Artist"
	args={{
		artist: folkArtist,
		similarArtists: mockSimilarArtists.slice(0, 2),
		initialIsFollowing: true,
		initialSelectedTab: 'overview',
		pageTitle: 'Whisper Woods | prettygood.music',
		pageDescription: 'Whisper Woods is an emerging folk artist known for soulful vocals and poetic lyrics.',
		...eventHandlers
	}}
/>

<Story
	name="Hip Hop Artist"
	args={{
		artist: hipHopArtist,
		similarArtists: mockSimilarArtists,
		initialIsFollowing: false,
		initialSelectedTab: 'albums',
		pageTitle: 'Rhythm Republic | prettygood.music',
		pageDescription: 'Rhythm Republic brings raw energy and authentic storytelling to the hip hop scene.',
		...eventHandlers
	}}
/>

<Story
	name="Minimal Artist"
	args={{
		artist: minimalArtist,
		similarArtists: [],
		initialIsFollowing: false,
		initialSelectedTab: 'about',
		pageTitle: 'Mystery Artist | prettygood.music',
		...eventHandlers
	}}
/>

<Story
	name="No Similar Artists"
	args={{
		artist: electronicArtist,
		similarArtists: [],
		initialIsFollowing: false,
		initialSelectedTab: 'overview',
		...eventHandlers
	}}
/>

<Story
	name="Already Following"
	args={{
		artist: hipHopArtist,
		similarArtists: mockSimilarArtists,
		initialIsFollowing: true,
		initialSelectedTab: 'overview',
		...eventHandlers
	}}
/>
