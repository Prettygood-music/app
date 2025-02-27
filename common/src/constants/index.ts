// Shared constants between frontend and backend

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    NONCE: "/auth/nonce",
    VERIFY: "/auth/verify",
    LOGOUT: "/auth/logout",
  },
  USERS: {
    BASE: "/users",
    ME: "/users/me",
    BY_ID: (id: string) => `/users/${id}`,
    BY_WALLET: (address: string) => `/users/wallet/${address}`,
  },
  ARTISTS: {
    BASE: "/artists",
    BY_ID: (id: string) => `/artists/${id}`,
    TRACKS: (id: string) => `/artists/${id}/tracks`,
    ALBUMS: (id: string) => `/artists/${id}/albums`,
  },
  TRACKS: {
    BASE: "/tracks",
    BY_ID: (id: string) => `/tracks/${id}`,
    FEATURED: "/tracks/featured",
    RECENT: "/tracks/recent",
    TRENDING: "/tracks/trending",
  },
  ALBUMS: {
    BASE: "/albums",
    BY_ID: (id: string) => `/albums/${id}`,
    TRACKS: (id: string) => `/albums/${id}/tracks`,
    FEATURED: "/albums/featured",
    RECENT: "/albums/recent",
  },
  PLAYLISTS: {
    BASE: "/playlists",
    BY_ID: (id: string) => `/playlists/${id}`,
    TRACKS: (id: string) => `/playlists/${id}/tracks`,
    FEATURED: "/playlists/featured",
  },
  SEARCH: "/search",
  PAYMENTS: {
    BASE: "/payments",
    BY_ID: (id: string) => `/payments/${id}`,
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Audio settings
export const AUDIO = {
  DEFAULT_VOLUME: 0.7,
  FADE_DURATION: 0.5, // seconds
  FORMATS: [".mp3", ".wav", ".flac", ".ogg"],
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
};

// Image settings
export const IMAGE = {
  FORMATS: [".jpg", ".jpeg", ".png", ".webp"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  DIMENSIONS: {
    PROFILE: { width: 300, height: 300 },
    COVER: { width: 500, height: 500 },
    ALBUM: { width: 1000, height: 1000 },
  },
};

// Wallet configurations
export const WALLET = {
  NETWORKS: {
    MAINNET: "mainnet",
    TESTNET: "testnet",
    DEVNET: "devnet",
  },
  MESSAGE_PREFIX: "prettygood.music authentication:",
};

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  WALLET_CONNECTION_ERROR: "WALLET_CONNECTION_ERROR",
  TRANSACTION_ERROR: "TRANSACTION_ERROR",
};
