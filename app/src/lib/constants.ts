export const DEPENDS = {
	AUTH: 'app:auth'
} as const;

export const LINKS = {
	HOME: '/',
	PROFILE: '/dashboard',
	ARTIST_DASHBOARD: '/dashboard/artist',
	INSTALL: '/install',
	ARTISTS: '/artists',
	ALBUMS: {
		ROOT: '/albums',
		ID: (id: string) => `/albums/${id}`
	},
	PLAYLISTS: {
		ID: (id: string) => `/playlist/${id}`,
		NEW: '/playlist/new'	
	},

	TRACKS: {
		ROOT: '/track',
		ID: (id: string) => `/track/${id}`
	},

	UPLOAD: {
		TRACK: '/dashboard/artist/uploads/track',
		ALBUM: '/dashboard/artist/uploads/album'
	},

	LOGIN: '/login',
	REGISTER: '/auth'
} as const;
