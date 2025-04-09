<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AlbumDetailTemplate from './AlbumDetailTemplate.svelte';
	import { action } from '@storybook/addon-actions';

	// Helper function to create mock tracks
	const createTrack = (id, title, duration) => ({
		id,
		title,
		duration,
		plays: Math.floor(Math.random() * 1000000),
		artist_name: 'Artist Name',
		album_title: 'Album Title',
		cover_url: `https://picsum.photos/seed/${id}/300/300`
	});

	// Helper function to create mock albums
	const createAlbum = (id, title, trackCount, releaseDate, genre = [], coverSeed = id) => {
		const tracks = Array.from({ length: trackCount }, (_, i) => 
			createTrack(`${id}-track-${i}`, `Track ${i + 1}`, 180 + Math.floor(Math.random() * 240))
		);
		
		return {
			id,
			title,
			cover_url: `https://picsum.photos/seed/${coverSeed}/500/500`,
			release_date: releaseDate,
			genre,
			tracks,
			label: 'Bytecode Records'
		};
	};

	// Create various album examples for the stories
	
	// An electronic music album with tracks and genres
	const electronicAlbum = createAlbum(
		'album-1',
		'Digital Landscapes',
		12,
		'2023-05-15',
		['Electronic', 'Ambient', 'IDM'],
		'electronic'
	);
	const electronicArtist = {
		id: 'artist-1',
		artist_name: 'Electronic Dreams',
		avatar_url: 'https://picsum.photos/seed/electronicartist/300/300',
		bio: 'Electronic Dreams is an innovative electronic music producer known for creating immersive soundscapes that blend ambient textures with cutting-edge beats and rhythms.'
	};
	const electronicRelatedAlbums = [
		createAlbum('album-2', 'Synthetic Symphony', 10, '2022-03-10', ['Electronic', 'Orchestral', 'Cinematic'], 'symphony'),
		createAlbum('album-3', 'Neural Networks', 8, '2021-09-22', ['Electronic', 'Glitch', 'Experimental'], 'neural'),
		createAlbum('album-4', 'Binary Sunset', 6, '2020-11-05', ['Electronic', 'Downtempo', 'Ambient'], 'binary')
	];

	// A jazz album
	const jazzAlbum = createAlbum(
		'album-5',
		'Midnight Sessions',
		8,
		'2023-02-10',
		['Jazz', 'Instrumental', 'Bebop'],
		'jazz'
	);
	const jazzArtist = {
		id: 'artist-2',
		artist_name: 'The Jazz Quintet',
		avatar_url: 'https://picsum.photos/seed/jazzartist/300/300',
		bio: 'The Jazz Quintet is a collective of accomplished jazz musicians dedicated to preserving the tradition of bebop while pushing the boundaries of modern jazz composition.'
	};
	const jazzRelatedAlbums = [
		createAlbum('album-6', 'Blue Notes', 7, '2022-05-18', ['Jazz', 'Blues'], 'bluenotes'),
		createAlbum('album-7', 'After Hours', 9, '2021-07-30', ['Jazz', 'Lounge'], 'afterhours')
	];

	// A hip hop album
	const hipHopAlbum = createAlbum(
		'album-8',
		'Urban Chronicles',
		14,
		'2023-08-22',
		['Hip Hop', 'Rap', 'Urban'],
		'hiphop'
	);
	hipHopAlbum.description = 'Urban Chronicles explores themes of city life, resilience, and personal growth through hard-hitting beats and thoughtful lyrics.';
	
	const hipHopArtist = {
		id: 'artist-3',
		artist_name: 'Rhythm Republic',
		avatar_url: 'https://picsum.photos/seed/hiphopartist/300/300',
		bio: 'Rhythm Republic brings authentic storytelling and innovative production to create a unique voice in the contemporary hip hop landscape.'
	};
	const hipHopRelatedAlbums = [
		createAlbum('album-9', 'Street Poems', 12, '2022-11-05', ['Hip Hop', 'Conscious Rap'], 'streetpoems'),
		createAlbum('album-10', 'City Lights', 10, '2021-04-15', ['Hip Hop', 'R&B'], 'citylights'),
		createAlbum('album-11', 'Concrete Dreams', 8, '2020-09-30', ['Hip Hop', 'Trap'], 'concrete')
	];

	// A new release with no related albums
	const newReleaseAlbum = createAlbum(
		'album-12',
		'First Impressions',
		6,
		new Date().toISOString().split('T')[0],
		['Indie Pop', 'Alternative'],
		'newrelease'
	);
	const newArtist = {
		id: 'artist-4',
		artist_name: 'Novus',
		avatar_url: 'https://picsum.photos/seed/newartist/300/300',
		bio: 'Novus is an emerging artist exploring the boundaries between pop, electronic and alternative music.'
	};

	// Event handlers for Storybook
	const eventHandlers = {
		onTogglePlay: action('Toggle Play'),
		onShufflePlay: action('Shuffle Play'),
		onToggleLike: action('Toggle Like'),
		onShare: action('Share Album'),
		onMoreOptions: action('More Options')
	};

	const { Story } = defineMeta({
		title: 'Templates/AlbumDetailTemplate',
		component: AlbumDetailTemplate,
		tags: ['autodocs'],
		argTypes: {
			album: { control: 'object' },
			artist: { control: 'object' },
			tracks: { control: 'object' },
			relatedAlbums: { control: 'object' },
			initialIsPlaying: { control: 'boolean' },
			initialIsLiked: { control: 'boolean' },
			pageTitle: { control: 'text' },
			pageDescription: { control: 'text' }
		}
	});
</script>

<Story
	name="Electronic Album"
	args={{
		album: electronicAlbum,
		artist: electronicArtist,
		tracks: electronicAlbum.tracks,
		relatedAlbums: electronicRelatedAlbums,
		initialIsPlaying: false,
		initialIsLiked: false,
		pageTitle: `${electronicAlbum.title} by ${electronicArtist.artist_name} | prettygood.music`,
		pageDescription: `Listen to ${electronicAlbum.title} by ${electronicArtist.artist_name} on prettygood.music`,
		...eventHandlers
	}}
/>

<Story
	name="Jazz Album"
	args={{
		album: jazzAlbum,
		artist: jazzArtist,
		tracks: jazzAlbum.tracks,
		relatedAlbums: jazzRelatedAlbums,
		initialIsPlaying: false,
		initialIsLiked: true,
		pageTitle: `${jazzAlbum.title} by ${jazzArtist.artist_name} | prettygood.music`,
		pageDescription: `Listen to ${jazzAlbum.title} by ${jazzArtist.artist_name} on prettygood.music`,
		...eventHandlers
	}}
/>

<Story
	name="Hip Hop Album with Description"
	args={{
		album: hipHopAlbum,
		artist: hipHopArtist,
		tracks: hipHopAlbum.tracks,
		relatedAlbums: hipHopRelatedAlbums,
		initialIsPlaying: true,
		initialIsLiked: false,
		pageTitle: `${hipHopAlbum.title} by ${hipHopArtist.artist_name} | prettygood.music`,
		pageDescription: hipHopAlbum.description,
		...eventHandlers
	}}
/>

<Story
	name="New Release"
	args={{
		album: newReleaseAlbum,
		artist: newArtist,
		tracks: newReleaseAlbum.tracks,
		relatedAlbums: [],
		initialIsPlaying: false,
		initialIsLiked: false,
		pageTitle: `${newReleaseAlbum.title} by ${newArtist.artist_name} | prettygood.music`,
		pageDescription: `Listen to ${newReleaseAlbum.title}, the debut album by ${newArtist.artist_name} on prettygood.music`,
		...eventHandlers
	}}
/>

<Story
	name="Playing State"
	args={{
		album: electronicAlbum,
		artist: electronicArtist,
		tracks: electronicAlbum.tracks,
		relatedAlbums: electronicRelatedAlbums,
		initialIsPlaying: true,
		initialIsLiked: false,
		...eventHandlers
	}}
/>

<Story
	name="Liked State"
	args={{
		album: jazzAlbum,
		artist: jazzArtist,
		tracks: jazzAlbum.tracks,
		relatedAlbums: jazzRelatedAlbums,
		initialIsPlaying: false,
		initialIsLiked: true,
		...eventHandlers
	}}
/>
