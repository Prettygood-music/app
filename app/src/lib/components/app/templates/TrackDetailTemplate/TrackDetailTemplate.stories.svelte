<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TrackDetailTemplate from './TrackDetailTemplate.svelte';
	import { action } from '@storybook/addon-actions';

	// Helper function to create mock tracks
	const createTrack = (id, title, duration, genres, artistId, artistName, plays = 0) => ({
		id,
		title,
		duration,
		release_date: '2023-05-15',
		play_count: plays,
		genre: genres,
		cover_url: `https://picsum.photos/seed/${id}/500/500`,
		artist: {
			id: artistId,
			artist_name: artistName,
			display_name: artistName
		}
	});

	// Helper function to create mock albums
	const createAlbum = (id, title, trackCount, releaseDate, artistId, artistName) => {
		const tracks = Array.from({ length: trackCount }, (_, i) => 
			createTrack(`${id}-track-${i}`, `Track ${i + 1}`, 180 + Math.floor(Math.random() * 240), [], artistId, artistName)
		);
		
		return {
			id,
			title,
			cover_url: `https://picsum.photos/seed/${id}/500/500`,
			release_date: releaseDate,
			tracks
		};
	};

	// Create different track scenarios for our stories
	
	// Electronic track with album
	const electronicArtist = {
		id: 'artist-1',
		artist_name: 'Electronic Dreams',
		display_name: 'Electronic Dreams',
		avatar_url: 'https://picsum.photos/seed/electronicartist/300/300',
		bio: 'Electronic Dreams is an innovative electronic music producer known for creating immersive soundscapes that blend ambient textures with cutting-edge beats and rhythms.'
	};
	
	const electronicAlbum = createAlbum(
		'album-1',
		'Digital Landscapes',
		12,
		'2023-05-15',
		electronicArtist.id,
		electronicArtist.artist_name
	);
	
	const electronicTrack = {
		id: 'track-1',
		title: 'Neural Network',
		duration: 267,
		release_date: '2023-05-15',
		play_count: 1245678,
		genre: ['Electronic', 'Ambient', 'IDM'],
		cover_url: 'https://picsum.photos/seed/electronictrack/500/500',
		artist: electronicArtist,
		album: electronicAlbum
	};
	
	const electronicRecommendedTracks = [
		createTrack('rec-1', 'Quantum Particles', 194, ['Electronic', 'Ambient'], electronicArtist.id, electronicArtist.artist_name, 987543),
		createTrack('rec-2', 'Digital Horizon', 215, ['Electronic', 'Downtempo'], electronicArtist.id, electronicArtist.artist_name, 876432),
		createTrack('rec-3', 'Binary Sunset', 246, ['Electronic', 'Chillout'], electronicArtist.id, electronicArtist.artist_name, 765321),
		createTrack('rec-4', 'Silicon Dreams', 183, ['Electronic', 'Techno'], 'artist-2', 'Sonic Wave', 654321),
		createTrack('rec-5', 'Algorithmic Patterns', 227, ['Electronic', 'Glitch'], 'artist-3', 'Data Pulse', 543210)
	];

	// Hip hop track with no album
	const hipHopArtist = {
		id: 'artist-3',
		artist_name: 'Rhythm Republic',
		display_name: 'Rhythm Republic',
		avatar_url: 'https://picsum.photos/seed/hiphopartist/300/300',
		bio: 'Rhythm Republic brings authentic storytelling and innovative production to create a unique voice in the contemporary hip hop landscape.'
	};
	
	const hipHopTrack = {
		id: 'track-2',
		title: 'Urban Flow',
		duration: 203,
		release_date: '2023-08-22',
		play_count: 879456,
		genre: ['Hip Hop', 'Rap', 'Urban'],
		cover_url: 'https://picsum.photos/seed/hiphoptrack/500/500',
		artist: hipHopArtist
	};
	
	const hipHopRecommendedTracks = [
		createTrack('rec-6', 'City Lights', 218, ['Hip Hop', 'Rap'], hipHopArtist.id, hipHopArtist.artist_name, 789654),
		createTrack('rec-7', 'Street Poetry', 195, ['Hip Hop', 'Conscious Rap'], hipHopArtist.id, hipHopArtist.artist_name, 678954),
		createTrack('rec-8', 'Midnight Drive', 232, ['Hip Hop', 'R&B'], 'artist-4', 'Urban Poet', 567843)
	];

	// Classical track
	const classicalArtist = {
		id: 'artist-5',
		artist_name: 'Emily Strings',
		display_name: 'Emily Strings',
		avatar_url: 'https://picsum.photos/seed/classicalartist/300/300',
		bio: 'Emily Strings is a renowned classical composer and performer known for her emotive string compositions that blend traditional classical elements with modern sensibilities.'
	};
	
	const classicalAlbum = createAlbum(
		'album-2',
		'String Quartets',
		8,
		'2023-02-10',
		classicalArtist.id,
		classicalArtist.artist_name
	);
	
	const classicalTrack = {
		id: 'track-3',
		title: 'Adagio in G Minor',
		duration: 384,
		release_date: '2023-02-10',
		play_count: 456782,
		genre: ['Classical', 'Chamber Music', 'String Quartet'],
		cover_url: 'https://picsum.photos/seed/classicaltrack/500/500',
		artist: classicalArtist,
		album: classicalAlbum
	};
	
	// Minimal track example
	const minimalTrack = {
		id: 'track-4',
		title: 'First Steps',
		duration: 152,
		release_date: new Date().toISOString().split('T')[0],
		play_count: 125,
		genre: ['Lo-Fi'],
		cover_url: 'https://picsum.photos/seed/minimaltrack/500/500',
		artist: {
			id: 'artist-6',
			artist_name: 'New Artist',
			display_name: 'New Artist'
		}
	};

	// Event handlers for Storybook
	const eventHandlers = {
		onTogglePlay: action('Toggle Play'),
		onToggleLike: action('Toggle Like'),
		onShare: action('Share Track'),
		onMoreOptions: action('More Options')
	};

	const { Story } = defineMeta({
		title: 'Templates/TrackDetailTemplate',
		component: TrackDetailTemplate,
		tags: ['autodocs'],
		argTypes: {
			track: { control: 'object' },
			recommendedTracks: { control: 'object' },
			initialIsPlaying: { control: 'boolean' },
			initialIsLiked: { control: 'boolean' }
		}
	});
</script>

<Story
	name="Electronic Track"
	args={{
		track: electronicTrack,
		recommendedTracks: electronicRecommendedTracks,
		initialIsPlaying: false,
		initialIsLiked: false,
		...eventHandlers
	}}
/>

<Story
	name="Hip Hop Track (No Album)"
	args={{
		track: hipHopTrack,
		recommendedTracks: hipHopRecommendedTracks,
		initialIsPlaying: false,
		initialIsLiked: true,
		...eventHandlers
	}}
/>

<Story
	name="Classical Track"
	args={{
		track: classicalTrack,
		recommendedTracks: [],
		initialIsPlaying: false,
		initialIsLiked: false,
		...eventHandlers
	}}
/>

<Story
	name="Minimal Track"
	args={{
		track: minimalTrack,
		recommendedTracks: [],
		initialIsPlaying: false,
		initialIsLiked: false,
		...eventHandlers
	}}
/>

<Story
	name="Playing State"
	args={{
		track: electronicTrack,
		recommendedTracks: electronicRecommendedTracks,
		initialIsPlaying: true,
		initialIsLiked: false,
		...eventHandlers
	}}
/>

<Story
	name="Liked State"
	args={{
		track: hipHopTrack,
		recommendedTracks: hipHopRecommendedTracks,
		initialIsPlaying: false,
		initialIsLiked: true,
		...eventHandlers
	}}
/>
