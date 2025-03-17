import type { User } from "$lib/types";

// Mock artists
export const mockUsers: User[] = [
	{
		id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
		username: 'electric_symphony',
		wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
		display_name: 'Electric Symphony',
		avatar_url: 'https://example.com/images/electric-symphony.jpg',
		is_artist: true
	},
	{
		id: 'b2c3d4e5-f6a7-8901-bcde-fa1234567890',
		username: 'vintage_echoes',
		wallet_address: '0x2345678901abcdef2345678901abcdef23456789',
		display_name: 'Vintage Echoes',
		avatar_url: 'https://example.com/images/vintage-echoes.jpg',
		is_artist: true
	},
	{
		id: 'c3d4e5f6-a7b8-9012-cdef-ab1234567890',
		username: 'sonic_wanderer',
		wallet_address: '0x3456789012abcdef3456789012abcdef34567890',
		display_name: 'Sonic Wanderer',
		avatar_url: 'https://example.com/images/sonic-wanderer.jpg',
		is_artist: true
	},
	{
		id: 'd4e5f6a7-b8c9-0123-defa-bc1234567890',
		username: 'melodic_journey',
		wallet_address: '0x4567890123abcdef4567890123abcdef45678901',
		display_name: 'Melodic Journey',
		avatar_url: 'https://example.com/images/melodic-journey.jpg',
		is_artist: true
	},
	{
		id: 'e5f6a7b8-c9d0-1234-efab-cd1234567890',
		username: 'bass_architect',
		wallet_address: '0x5678901234abcdef5678901234abcdef56789012',
		display_name: 'Bass Architect',
		avatar_url: 'https://example.com/images/bass-architect.jpg',
		is_artist: true
	},
	{
		id: 'f6a7b8c9-d0e1-2345-6789-ef0123456789',
		username: 'music_lover42',
		wallet_address: '0x6789012345abcdef6789012345abcdef67890123',
		display_name: 'Music Lover',
		avatar_url: null,
		is_artist: false
	},
	{
		id: 'a7b8c9d0-e1f2-3456-789a-bc0123456789',
		username: 'beat_enthusiast',
		wallet_address: '0x7890123456abcdef7890123456abcdef78901234',
		display_name: 'Beat Enthusiast',
		avatar_url: 'https://example.com/images/beat-enthusiast.jpg',
		is_artist: false
	}
];
