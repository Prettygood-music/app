export const DEPENDS = {
	AUTH: 'app:auth'
} as const;

export const LINKS = {
	HOME: '/',
	PROFILE: '/dashboard',
	ARTIST_DASHBOARD: '/dashboard/artist',
	INSTALL: '/install',

	UPLOAD: {
		TRACK: '/dashboard/artist/uploads/track',
		ALBUM: '/dashboard/artist/uploads/album'
	},

	LOGIN: '/login',
	REGISTER: '/auth'
} as const;
