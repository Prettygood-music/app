export const DEPENDS = {
	AUTH: 'app:auth',
	PLAYLISTS: 'app:playlists',
	ALBUMS: 'app:albums',
	ARTIST: 'app:artist',
	TRACKS: 'app:tracks',
	WALLET: 'app:wallet'
} as const;

export const LINKS = {
	HOME: '/',
	PROFILE: '/dashboard',
	ARTIST_DASHBOARD: '/dashboard/artist',

	INSTALL: '/install',
	ARTISTS: {
		ROOT: '/artist',
		ID: (id: string) => `/artist/${id}`,
		CREATE: `/dashboard/create-artist`
	},
	ALBUMS: {
		ROOT: '/album',
		ID: (id: string) => `/album/${id}`
	},
	PLAYLISTS: {
		ID: (id: string) => `/playlist/${id}`,
		NEW: '/playlist/new'
	},

	TRACKS: {
		ROOT: '/track',
		ID: (id: string) => `/track/${id}`
	},
	USERS: {
		ID: (id: string) => `/user/${id}`
	},

	UPLOAD: {
		TRACK: '/dashboard/artist/uploads/track',
		ALBUM: '/dashboard/artist/uploads/album'
	},

	LOGIN: '/login',
	REGISTER: '/auth'
} as const;

export const STORAGE_KEYS = {
	PLAYLISTS: 'playlists',
	ALBUMS: 'albums',
	TRACKS: 'tracks',
	ARTISTS: "artists"
};

export const availableGenres = [
	'Pop',
	'Rock',
	'Hip-Hop',
	'Rap',
	'R&B',
	'Electronic',
	'Dance',
	'Jazz',
	'Blues',
	'Country',
	'Folk',
	'Classical',
	'Metal',
	'Punk',
	'Reggae',
	'Soul',
	'Funk',
	'Ambient',
	'World',
	'Latin',
	'Indie',
	'Alternative',
	'Experimental'
];
