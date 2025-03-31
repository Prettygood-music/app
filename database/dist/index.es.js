import { PostgrestClient as r } from "@supabase/postgrest-js";
import { z as e } from "zod";
const t = e.lazy(
  () => e.union([
    e.string(),
    e.number(),
    e.boolean(),
    e.record(e.union([t, e.undefined()])),
    e.array(t)
  ]).nullable()
), i = e.object({
  album_id: e.string(),
  liked_at: e.string(),
  user_id: e.string()
}), o = e.object({
  album_id: e.string(),
  liked_at: e.string().optional(),
  user_id: e.string()
}), s = e.object({
  album_id: e.string().optional(),
  liked_at: e.string().optional(),
  user_id: e.string().optional()
}), c = e.tuple([
  e.object({
    foreignKeyName: e.literal("album_likes_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("album_likes_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), d = e.object({
  artist_id: e.string(),
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  release_date: e.string().nullable(),
  title: e.string(),
  type: e.string().nullable(),
  updated_at: e.string()
}), u = e.object({
  artist_id: e.string(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  release_date: e.string().optional().nullable(),
  title: e.string(),
  type: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), g = e.object({
  artist_id: e.string().optional(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  release_date: e.string().optional().nullable(),
  title: e.string().optional(),
  type: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), p = e.tuple([
  e.object({
    foreignKeyName: e.literal("albums_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), m = e.object({
  artist_id: e.string(),
  followed_at: e.string(),
  user_id: e.string()
}), _ = e.object({
  artist_id: e.string(),
  followed_at: e.string().optional(),
  user_id: e.string()
}), b = e.object({
  artist_id: e.string().optional(),
  followed_at: e.string().optional(),
  user_id: e.string().optional()
}), y = e.tuple([
  e.object({
    foreignKeyName: e.literal("artist_followers_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("artist_followers_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), h = e.object({
  artist_name: e.string(),
  bio: e.string().nullable(),
  created_at: e.string(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  location: e.string().nullable(),
  social_links: t.nullable(),
  updated_at: e.string(),
  verified: e.boolean().nullable(),
  website: e.string().nullable()
}), S = e.object({
  artist_name: e.string(),
  bio: e.string().optional().nullable(),
  created_at: e.string().optional(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string(),
  location: e.string().optional().nullable(),
  social_links: t.optional().nullable(),
  updated_at: e.string().optional(),
  verified: e.boolean().optional().nullable(),
  website: e.string().optional().nullable()
}), f = e.object({
  artist_name: e.string().optional(),
  bio: e.string().optional().nullable(),
  created_at: e.string().optional(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  location: e.string().optional().nullable(),
  social_links: t.optional().nullable(),
  updated_at: e.string().optional(),
  verified: e.boolean().optional().nullable(),
  website: e.string().optional().nullable()
}), k = e.tuple([
  e.object({
    foreignKeyName: e.literal("artists_id_fkey"),
    columns: e.tuple([e.literal("id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), j = e.object({
  album_id: e.string().nullable(),
  amount: e.number(),
  created_at: e.string(),
  currency: e.string(),
  id: e.string(),
  message: e.string().nullable(),
  payment_type: e.string(),
  recipient_id: e.string(),
  sender_id: e.string(),
  status: e.string(),
  track_id: e.string().nullable(),
  transaction_hash: e.string().nullable(),
  updated_at: e.string()
}), R = e.object({
  album_id: e.string().optional().nullable(),
  amount: e.number(),
  created_at: e.string().optional(),
  currency: e.string().optional(),
  id: e.string().optional(),
  message: e.string().optional().nullable(),
  payment_type: e.string(),
  recipient_id: e.string(),
  sender_id: e.string(),
  status: e.string(),
  track_id: e.string().optional().nullable(),
  transaction_hash: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), A = e.object({
  album_id: e.string().optional().nullable(),
  amount: e.number().optional(),
  created_at: e.string().optional(),
  currency: e.string().optional(),
  id: e.string().optional(),
  message: e.string().optional().nullable(),
  payment_type: e.string().optional(),
  recipient_id: e.string().optional(),
  sender_id: e.string().optional(),
  status: e.string().optional(),
  track_id: e.string().optional().nullable(),
  transaction_hash: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), T = e.tuple([
  e.object({
    foreignKeyName: e.literal("payments_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("payments_recipient_id_fkey"),
    columns: e.tuple([e.literal("recipient_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("payments_sender_id_fkey"),
    columns: e.tuple([e.literal("sender_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("payments_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), P = e.object({
  client_ip: e.string().nullable(),
  completed: e.boolean().nullable(),
  id: e.string(),
  play_duration: e.number().nullable(),
  played_at: e.string(),
  source: e.string().nullable(),
  track_id: e.string(),
  user_agent: e.string().nullable(),
  user_id: e.string()
}), C = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string()
}), O = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string().optional(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string().optional()
}), w = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("play_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), G = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), U = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), N = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), K = e.tuple(
  [
    e.object({
      foreignKeyName: e.literal("playlist_collaborators_added_by_fkey"),
      columns: e.tuple([e.literal("added_by")]),
      isOneToOne: e.literal(!1),
      referencedRelation: e.literal("users"),
      referencedColumns: e.tuple([e.literal("id")])
    }),
    e.object({
      foreignKeyName: e.literal("playlist_collaborators_playlist_id_fkey"),
      columns: e.tuple([e.literal("playlist_id")]),
      isOneToOne: e.literal(!1),
      referencedRelation: e.literal("playlists"),
      referencedColumns: e.tuple([e.literal("id")])
    }),
    e.object({
      foreignKeyName: e.literal("playlist_collaborators_user_id_fkey"),
      columns: e.tuple([e.literal("user_id")]),
      isOneToOne: e.literal(!1),
      referencedRelation: e.literal("users"),
      referencedColumns: e.tuple([e.literal("id")])
    })
  ]
), v = e.object({
  liked_at: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), L = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string(),
  user_id: e.string()
}), F = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), I = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlist_likes_playlist_id_fkey"),
    columns: e.tuple([e.literal("playlist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("playlists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("playlist_likes_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), q = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), x = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), B = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  position: e.number().optional(),
  track_id: e.string().optional()
}), E = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlist_tracks_added_by_fkey"),
    columns: e.tuple([e.literal("added_by")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("playlist_tracks_playlist_id_fkey"),
    columns: e.tuple([e.literal("playlist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("playlists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("playlist_tracks_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), z = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), H = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string(),
  updated_at: e.string().optional(),
  user_id: e.string()
}), V = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string().optional(),
  updated_at: e.string().optional(),
  user_id: e.string().optional()
}), D = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlists_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), W = e.object({
  id: e.string(),
  query: e.string(),
  searched_at: e.string(),
  user_id: e.string()
}), J = e.object({
  id: e.string().optional(),
  query: e.string(),
  searched_at: e.string().optional(),
  user_id: e.string()
}), M = e.object({
  id: e.string().optional(),
  query: e.string().optional(),
  searched_at: e.string().optional(),
  user_id: e.string().optional()
}), Q = e.tuple([
  e.object({
    foreignKeyName: e.literal("search_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), X = e.object({
  liked_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), Y = e.object({
  liked_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), Z = e.object({
  liked_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), $ = e.tuple([
  e.object({
    foreignKeyName: e.literal("track_likes_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("track_likes_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), ee = e.object({
  album_id: e.string().nullable(),
  artist_id: e.string(),
  audio_url: e.string(),
  cover_url: e.string().nullable(),
  created_at: e.string(),
  duration: e.number(),
  explicit: e.boolean().nullable(),
  genre: e.array(e.string()),
  id: e.string(),
  isrc: e.string().nullable(),
  lyrics: e.string().nullable(),
  release_date: e.string().nullable(),
  title: e.string(),
  track_number: e.number().nullable(),
  updated_at: e.string()
}), te = e.object({
  album_id: e.string().optional().nullable(),
  artist_id: e.string(),
  audio_url: e.string(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  duration: e.number(),
  explicit: e.boolean().optional().nullable(),
  genre: e.array(e.string()).optional(),
  id: e.string().optional(),
  isrc: e.string().optional().nullable(),
  lyrics: e.string().optional().nullable(),
  release_date: e.string().optional().nullable(),
  title: e.string(),
  track_number: e.number().optional().nullable(),
  updated_at: e.string().optional()
}), ae = e.object({
  album_id: e.string().optional().nullable(),
  artist_id: e.string().optional(),
  audio_url: e.string().optional(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  duration: e.number().optional(),
  explicit: e.boolean().optional().nullable(),
  genre: e.array(e.string()).optional(),
  id: e.string().optional(),
  isrc: e.string().optional().nullable(),
  lyrics: e.string().optional().nullable(),
  release_date: e.string().optional().nullable(),
  title: e.string().optional(),
  track_number: e.number().optional().nullable(),
  updated_at: e.string().optional()
}), re = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), le = e.object({
  added_at: e.string(),
  album_id: e.string(),
  user_id: e.string()
}), ne = e.object({
  added_at: e.string().optional(),
  album_id: e.string(),
  user_id: e.string()
}), ie = e.object({
  added_at: e.string().optional(),
  album_id: e.string().optional(),
  user_id: e.string().optional()
}), oe = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_library_albums_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_library_albums_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), se = e.object({
  added_at: e.string(),
  artist_id: e.string(),
  user_id: e.string()
}), ce = e.object({
  added_at: e.string().optional(),
  artist_id: e.string(),
  user_id: e.string()
}), de = e.object({
  added_at: e.string().optional(),
  artist_id: e.string().optional(),
  user_id: e.string().optional()
}), ue = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_library_artists_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_library_artists_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), ge = e.object({
  added_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), pe = e.object({
  added_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), me = e.object({
  added_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), _e = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_library_tracks_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_library_tracks_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), be = e.object({
  context_id: e.string().nullable(),
  context_type: e.string().nullable(),
  id: e.string(),
  played_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), ye = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), he = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), Se = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_recently_played_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_recently_played_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), fe = e.object({
  audio_quality: e.string().nullable(),
  auto_add_to_library: e.boolean().nullable(),
  crossfade_duration: e.number().nullable(),
  enable_autoplay: e.boolean().nullable(),
  enable_crossfade: e.boolean().nullable(),
  enable_equalizer: e.boolean().nullable(),
  enable_explicit_content: e.boolean().nullable(),
  enable_gapless_playback: e.boolean().nullable(),
  enable_notifications: e.boolean().nullable(),
  equalizer_settings: t.nullable(),
  notification_settings: t.nullable(),
  preferred_language: e.string().nullable(),
  privacy_level: e.string().nullable(),
  theme: e.string().nullable(),
  updated_at: e.string(),
  user_id: e.string(),
  volume_level: e.number().nullable()
}), ke = e.object({
  audio_quality: e.string().optional().nullable(),
  auto_add_to_library: e.boolean().optional().nullable(),
  crossfade_duration: e.number().optional().nullable(),
  enable_autoplay: e.boolean().optional().nullable(),
  enable_crossfade: e.boolean().optional().nullable(),
  enable_equalizer: e.boolean().optional().nullable(),
  enable_explicit_content: e.boolean().optional().nullable(),
  enable_gapless_playback: e.boolean().optional().nullable(),
  enable_notifications: e.boolean().optional().nullable(),
  equalizer_settings: t.optional().nullable(),
  notification_settings: t.optional().nullable(),
  preferred_language: e.string().optional().nullable(),
  privacy_level: e.string().optional().nullable(),
  theme: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  user_id: e.string(),
  volume_level: e.number().optional().nullable()
}), je = e.object({
  audio_quality: e.string().optional().nullable(),
  auto_add_to_library: e.boolean().optional().nullable(),
  crossfade_duration: e.number().optional().nullable(),
  enable_autoplay: e.boolean().optional().nullable(),
  enable_crossfade: e.boolean().optional().nullable(),
  enable_equalizer: e.boolean().optional().nullable(),
  enable_explicit_content: e.boolean().optional().nullable(),
  enable_gapless_playback: e.boolean().optional().nullable(),
  enable_notifications: e.boolean().optional().nullable(),
  equalizer_settings: t.optional().nullable(),
  notification_settings: t.optional().nullable(),
  preferred_language: e.string().optional().nullable(),
  privacy_level: e.string().optional().nullable(),
  theme: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  user_id: e.string().optional(),
  volume_level: e.number().optional().nullable()
}), Re = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_settings_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ae = e.object({
  created_at: e.string(),
  display_name: e.string().nullable(),
  email: e.string(),
  email_verified: e.boolean().nullable(),
  id: e.string(),
  profile_url: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), Te = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string(),
  wallet_address: e.string().optional().nullable()
}), Pe = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string().optional(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string().optional(),
  wallet_address: e.string().optional().nullable()
}), Ce = e.object({
  album_id: e.string().nullable(),
  play_count: e.number().nullable()
}), Oe = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), we = e.object({
  artist_id: e.string().nullable(),
  play_count: e.number().nullable()
}), Ge = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ue = e.object({
  play_count: e.number().nullable(),
  track_id: e.string().nullable()
}), Ne = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ke = e.object({
  play_count: e.number().nullable(),
  user_id: e.string().nullable()
}), ve = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Le = e.object({
  album_id: e.string()
}), Fe = e.boolean(), Ie = e.object({
  artist_id: e.string()
}), qe = e.boolean(), xe = e.object({
  track_id: e.string()
}), Be = e.boolean(), Ee = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), ze = e.undefined(), He = e.object({
  email_or_username: e.string(),
  password: e.string()
}), Ve = e.string(), De = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), We = e.string(), Je = e.object({
  user_id: e.string()
}), Me = e.string(), Qe = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), Xe = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), Ye = e.object({
  wallet_address: e.string()
}), Ze = e.string(), $e = e.object({
  album_id: e.string()
}), et = e.number(), tt = e.object({
  artist_id: e.string()
}), at = e.number(), rt = e.object({
  artist_id: e.string()
}), lt = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    month_year: e.string()
  })
), nt = e.object({
  artist_id: e.string()
}), it = e.number(), ot = e.object({
  artist_id: e.string()
}), st = e.number(), ct = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), dt = e.array(
  e.object({
    payment_type: e.string(),
    amount: e.number()
  })
), ut = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), gt = e.array(
  e.object({
    period: e.string(),
    amount: e.number()
  })
), pt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), mt = e.number(), _t = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), bt = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), yt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), ht = e.number(), St = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), ft = e.array(
  e.object({
    avg_duration: e.number(),
    completed_count: e.number(),
    total_count: e.number()
  })
), kt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), jt = e.array(
  e.object({
    country_code: e.string(),
    play_count: e.number()
  })
), Rt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), At = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), Tt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Pt = e.array(
  e.object({
    source: e.string(),
    count: e.number()
  })
), Ct = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Ot = e.number(), wt = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), Gt = e.array(
  e.object({
    added_at: e.string(),
    user_id: e.string(),
    username: e.string()
  })
), Ut = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), Nt = e.array(
  e.object({
    played_at: e.string(),
    track_id: e.string(),
    track_title: e.string(),
    username: e.string()
  })
), Kt = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), vt = e.array(
  e.object({
    created_at: e.string(),
    amount: e.number(),
    username: e.string()
  })
), Lt = e.object({
  artist_id: e.string(),
  limit_count: e.number().optional()
}), Ft = e.array(
  e.object({
    id: e.string(),
    created_at: e.string(),
    amount: e.number(),
    payment_type: e.string(),
    sender_id: e.string(),
    username: e.string()
  })
), It = e.object({
  limit_count: e.number().optional()
}), qt = e.array(
  e.object({
    album_id: e.string().nullable(),
    artist_id: e.string(),
    audio_url: e.string(),
    cover_url: e.string().nullable(),
    created_at: e.string(),
    duration: e.number(),
    explicit: e.boolean().nullable(),
    genre: e.array(e.string()),
    id: e.string(),
    isrc: e.string().nullable(),
    lyrics: e.string().nullable(),
    release_date: e.string().nullable(),
    title: e.string(),
    track_number: e.number().nullable(),
    updated_at: e.string()
  })
), xt = e.object({
  track_id: e.string()
}), Bt = e.number(), Et = e.object({
  track_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), zt = e.number(), Ht = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), Vt = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Dt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Wt = e.number(), Jt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Mt = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Qt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Xt = e.number(), Yt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), Zt = e.number(), $t = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), ea = e.undefined(), ta = e.object({
  query: e.string()
}), aa = e.undefined(), ra = e.object({}), la = e.string(), na = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), ia = e.object({
  artist_name: e.string(),
  bio: e.string().nullable(),
  created_at: e.string(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  location: e.string().nullable(),
  social_links: t.nullable(),
  updated_at: e.string(),
  verified: e.boolean().nullable(),
  website: e.string().nullable()
}), oa = e.object({
  email: e.string()
}), sa = e.string(), ca = e.object({
  reset_token: e.string(),
  new_password: e.string()
}), da = e.boolean(), ua = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), ga = e.object({
  album_id: e.string().nullable(),
  amount: e.number(),
  created_at: e.string(),
  currency: e.string(),
  id: e.string(),
  message: e.string().nullable(),
  payment_type: e.string(),
  recipient_id: e.string(),
  sender_id: e.string(),
  status: e.string(),
  track_id: e.string().nullable(),
  transaction_hash: e.string().nullable(),
  updated_at: e.string()
}), pa = e.object({
  verification_token: e.string()
}), ma = e.boolean(), _a = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), ba = e.string(), ya = {
  prettygood: {
    Enums: {}
  }
};
function ha(a) {
  return new r(a);
}
export {
  ya as Constants,
  ha as createClient,
  t as jsonSchema,
  Le as prettygoodAddAlbumToLibraryArgsSchemaSchema,
  Fe as prettygoodAddAlbumToLibraryReturnsSchemaSchema,
  Ie as prettygoodAddArtistToLibraryArgsSchemaSchema,
  qe as prettygoodAddArtistToLibraryReturnsSchemaSchema,
  xe as prettygoodAddTrackToLibraryArgsSchemaSchema,
  Be as prettygoodAddTrackToLibraryReturnsSchemaSchema,
  Ee as prettygoodAddTrackToPlaylistArgsSchemaSchema,
  ze as prettygoodAddTrackToPlaylistReturnsSchemaSchema,
  o as prettygoodAlbumLikesInsertSchemaSchema,
  c as prettygoodAlbumLikesRelationshipsSchemaSchema,
  i as prettygoodAlbumLikesRowSchemaSchema,
  s as prettygoodAlbumLikesUpdateSchemaSchema,
  Oe as prettygoodAlbumPlayCountsRelationshipsSchemaSchema,
  Ce as prettygoodAlbumPlayCountsRowSchemaSchema,
  u as prettygoodAlbumsInsertSchemaSchema,
  p as prettygoodAlbumsRelationshipsSchemaSchema,
  d as prettygoodAlbumsRowSchemaSchema,
  g as prettygoodAlbumsUpdateSchemaSchema,
  _ as prettygoodArtistFollowersInsertSchemaSchema,
  y as prettygoodArtistFollowersRelationshipsSchemaSchema,
  m as prettygoodArtistFollowersRowSchemaSchema,
  b as prettygoodArtistFollowersUpdateSchemaSchema,
  Ge as prettygoodArtistPlayCountsRelationshipsSchemaSchema,
  we as prettygoodArtistPlayCountsRowSchemaSchema,
  S as prettygoodArtistsInsertSchemaSchema,
  k as prettygoodArtistsRelationshipsSchemaSchema,
  h as prettygoodArtistsRowSchemaSchema,
  f as prettygoodArtistsUpdateSchemaSchema,
  He as prettygoodAuthenticateUserArgsSchemaSchema,
  Ve as prettygoodAuthenticateUserReturnsSchemaSchema,
  De as prettygoodAuthenticateWalletArgsSchemaSchema,
  We as prettygoodAuthenticateWalletReturnsSchemaSchema,
  Je as prettygoodCreateEmailVerificationTokenArgsSchemaSchema,
  Me as prettygoodCreateEmailVerificationTokenReturnsSchemaSchema,
  Qe as prettygoodCreatePlaylistArgsSchemaSchema,
  Xe as prettygoodCreatePlaylistReturnsSchemaSchema,
  Ye as prettygoodGenerateNonceArgsSchemaSchema,
  Ze as prettygoodGenerateNonceReturnsSchemaSchema,
  $e as prettygoodGetAlbumPlayCountArgsSchemaSchema,
  et as prettygoodGetAlbumPlayCountReturnsSchemaSchema,
  tt as prettygoodGetArtistFollowersCountArgsSchemaSchema,
  at as prettygoodGetArtistFollowersCountReturnsSchemaSchema,
  rt as prettygoodGetArtistPaymentStatsArgsSchemaSchema,
  lt as prettygoodGetArtistPaymentStatsReturnsSchemaSchema,
  nt as prettygoodGetArtistPlayCountArgsSchemaSchema,
  it as prettygoodGetArtistPlayCountReturnsSchemaSchema,
  ot as prettygoodGetArtistTotalEarningsArgsSchemaSchema,
  st as prettygoodGetArtistTotalEarningsReturnsSchemaSchema,
  ct as prettygoodGetEarningsByPaymentTypeArgsSchemaSchema,
  dt as prettygoodGetEarningsByPaymentTypeReturnsSchemaSchema,
  ut as prettygoodGetEarningsByPeriodArgsSchemaSchema,
  gt as prettygoodGetEarningsByPeriodReturnsSchemaSchema,
  pt as prettygoodGetEarningsForPeriodArgsSchemaSchema,
  mt as prettygoodGetEarningsForPeriodReturnsSchemaSchema,
  _t as prettygoodGetFollowersByPeriodArgsSchemaSchema,
  bt as prettygoodGetFollowersByPeriodReturnsSchemaSchema,
  yt as prettygoodGetFollowersCountForPeriodArgsSchemaSchema,
  ht as prettygoodGetFollowersCountForPeriodReturnsSchemaSchema,
  St as prettygoodGetPlayDurationStatsArgsSchemaSchema,
  ft as prettygoodGetPlayDurationStatsReturnsSchemaSchema,
  kt as prettygoodGetPlaysByCountryArgsSchemaSchema,
  jt as prettygoodGetPlaysByCountryReturnsSchemaSchema,
  Rt as prettygoodGetPlaysByPeriodArgsSchemaSchema,
  At as prettygoodGetPlaysByPeriodReturnsSchemaSchema,
  Tt as prettygoodGetPlaysBySourceArgsSchemaSchema,
  Pt as prettygoodGetPlaysBySourceReturnsSchemaSchema,
  Ct as prettygoodGetPlaysForPeriodArgsSchemaSchema,
  Ot as prettygoodGetPlaysForPeriodReturnsSchemaSchema,
  wt as prettygoodGetRecentFollowersArgsSchemaSchema,
  Gt as prettygoodGetRecentFollowersReturnsSchemaSchema,
  Ut as prettygoodGetRecentPlaysArgsSchemaSchema,
  Nt as prettygoodGetRecentPlaysReturnsSchemaSchema,
  Kt as prettygoodGetRecentTipsArgsSchemaSchema,
  vt as prettygoodGetRecentTipsReturnsSchemaSchema,
  Lt as prettygoodGetRecentTransactionsArgsSchemaSchema,
  Ft as prettygoodGetRecentTransactionsReturnsSchemaSchema,
  It as prettygoodGetRecommendationsArgsSchemaSchema,
  qt as prettygoodGetRecommendationsReturnsSchemaSchema,
  xt as prettygoodGetTrackPlayCountArgsSchemaSchema,
  Et as prettygoodGetTrackPlayCountByPeriodArgsSchemaSchema,
  zt as prettygoodGetTrackPlayCountByPeriodReturnsSchemaSchema,
  Bt as prettygoodGetTrackPlayCountReturnsSchemaSchema,
  Ht as prettygoodGetTrackPlayCountsArgsSchemaSchema,
  Vt as prettygoodGetTrackPlayCountsReturnsSchemaSchema,
  Dt as prettygoodGetTrackPlaylistsCountArgsSchemaSchema,
  Wt as prettygoodGetTrackPlaylistsCountReturnsSchemaSchema,
  Jt as prettygoodGetTrackPlaysForPeriodArgsSchemaSchema,
  Mt as prettygoodGetTrackPlaysForPeriodReturnsSchemaSchema,
  Qt as prettygoodGetTrackSavesCountArgsSchemaSchema,
  Xt as prettygoodGetTrackSavesCountReturnsSchemaSchema,
  Yt as prettygoodGetTracksPlayCountArgsSchemaSchema,
  Zt as prettygoodGetTracksPlayCountReturnsSchemaSchema,
  R as prettygoodPaymentsInsertSchemaSchema,
  T as prettygoodPaymentsRelationshipsSchemaSchema,
  j as prettygoodPaymentsRowSchemaSchema,
  A as prettygoodPaymentsUpdateSchemaSchema,
  C as prettygoodPlayHistoryInsertSchemaSchema,
  w as prettygoodPlayHistoryRelationshipsSchemaSchema,
  P as prettygoodPlayHistoryRowSchemaSchema,
  O as prettygoodPlayHistoryUpdateSchemaSchema,
  U as prettygoodPlaylistCollaboratorsInsertSchemaSchema,
  K as prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema,
  G as prettygoodPlaylistCollaboratorsRowSchemaSchema,
  N as prettygoodPlaylistCollaboratorsUpdateSchemaSchema,
  L as prettygoodPlaylistLikesInsertSchemaSchema,
  I as prettygoodPlaylistLikesRelationshipsSchemaSchema,
  v as prettygoodPlaylistLikesRowSchemaSchema,
  F as prettygoodPlaylistLikesUpdateSchemaSchema,
  x as prettygoodPlaylistTracksInsertSchemaSchema,
  E as prettygoodPlaylistTracksRelationshipsSchemaSchema,
  q as prettygoodPlaylistTracksRowSchemaSchema,
  B as prettygoodPlaylistTracksUpdateSchemaSchema,
  H as prettygoodPlaylistsInsertSchemaSchema,
  D as prettygoodPlaylistsRelationshipsSchemaSchema,
  z as prettygoodPlaylistsRowSchemaSchema,
  V as prettygoodPlaylistsUpdateSchemaSchema,
  $t as prettygoodRecordPlayArgsSchemaSchema,
  ea as prettygoodRecordPlayReturnsSchemaSchema,
  ta as prettygoodRecordSearchArgsSchemaSchema,
  aa as prettygoodRecordSearchReturnsSchemaSchema,
  ra as prettygoodRefreshTokenArgsSchemaSchema,
  la as prettygoodRefreshTokenReturnsSchemaSchema,
  na as prettygoodRegisterAsArtistArgsSchemaSchema,
  ia as prettygoodRegisterAsArtistReturnsSchemaSchema,
  oa as prettygoodRequestPasswordResetArgsSchemaSchema,
  sa as prettygoodRequestPasswordResetReturnsSchemaSchema,
  ca as prettygoodResetPasswordArgsSchemaSchema,
  da as prettygoodResetPasswordReturnsSchemaSchema,
  J as prettygoodSearchHistoryInsertSchemaSchema,
  Q as prettygoodSearchHistoryRelationshipsSchemaSchema,
  W as prettygoodSearchHistoryRowSchemaSchema,
  M as prettygoodSearchHistoryUpdateSchemaSchema,
  ua as prettygoodTipArtistArgsSchemaSchema,
  ga as prettygoodTipArtistReturnsSchemaSchema,
  Y as prettygoodTrackLikesInsertSchemaSchema,
  $ as prettygoodTrackLikesRelationshipsSchemaSchema,
  X as prettygoodTrackLikesRowSchemaSchema,
  Z as prettygoodTrackLikesUpdateSchemaSchema,
  Ne as prettygoodTrackPlayCountsRelationshipsSchemaSchema,
  Ue as prettygoodTrackPlayCountsRowSchemaSchema,
  te as prettygoodTracksInsertSchemaSchema,
  re as prettygoodTracksRelationshipsSchemaSchema,
  ee as prettygoodTracksRowSchemaSchema,
  ae as prettygoodTracksUpdateSchemaSchema,
  ne as prettygoodUserLibraryAlbumsInsertSchemaSchema,
  oe as prettygoodUserLibraryAlbumsRelationshipsSchemaSchema,
  le as prettygoodUserLibraryAlbumsRowSchemaSchema,
  ie as prettygoodUserLibraryAlbumsUpdateSchemaSchema,
  ce as prettygoodUserLibraryArtistsInsertSchemaSchema,
  ue as prettygoodUserLibraryArtistsRelationshipsSchemaSchema,
  se as prettygoodUserLibraryArtistsRowSchemaSchema,
  de as prettygoodUserLibraryArtistsUpdateSchemaSchema,
  pe as prettygoodUserLibraryTracksInsertSchemaSchema,
  _e as prettygoodUserLibraryTracksRelationshipsSchemaSchema,
  ge as prettygoodUserLibraryTracksRowSchemaSchema,
  me as prettygoodUserLibraryTracksUpdateSchemaSchema,
  ve as prettygoodUserPlayCountsRelationshipsSchemaSchema,
  Ke as prettygoodUserPlayCountsRowSchemaSchema,
  ye as prettygoodUserRecentlyPlayedInsertSchemaSchema,
  Se as prettygoodUserRecentlyPlayedRelationshipsSchemaSchema,
  be as prettygoodUserRecentlyPlayedRowSchemaSchema,
  he as prettygoodUserRecentlyPlayedUpdateSchemaSchema,
  ke as prettygoodUserSettingsInsertSchemaSchema,
  Re as prettygoodUserSettingsRelationshipsSchemaSchema,
  fe as prettygoodUserSettingsRowSchemaSchema,
  je as prettygoodUserSettingsUpdateSchemaSchema,
  Te as prettygoodUsersInsertSchemaSchema,
  Ae as prettygoodUsersRowSchemaSchema,
  Pe as prettygoodUsersUpdateSchemaSchema,
  pa as prettygoodVerifyEmailArgsSchemaSchema,
  ma as prettygoodVerifyEmailReturnsSchemaSchema,
  _a as prettygoodVerifySignatureArgsSchemaSchema,
  ba as prettygoodVerifySignatureReturnsSchemaSchema
};
