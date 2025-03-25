import { PostgrestClient as a } from "@supabase/postgrest-js";
import { z as e } from "zod";
const t = e.lazy(
  () => e.union([
    e.string(),
    e.number(),
    e.boolean(),
    e.record(e.union([t, e.undefined()])),
    e.array(t)
  ]).nullable()
), r = e.object({
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
}), p = e.object({
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
}), g = e.tuple([
  e.object({
    foreignKeyName: e.literal("albums_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), _ = e.object({
  artist_id: e.string(),
  followed_at: e.string(),
  user_id: e.string()
}), m = e.object({
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
}), O = e.object({
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
]), A = e.object({
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
}), P = e.object({
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
]), U = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), N = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), K = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), L = e.tuple(
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
}), I = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string(),
  user_id: e.string()
}), x = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), G = e.tuple([
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
}), z = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), H = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  position: e.number().optional(),
  track_id: e.string().optional()
}), F = e.tuple([
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
]), B = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), V = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string(),
  updated_at: e.string().optional(),
  user_id: e.string()
}), W = e.object({
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
]), E = e.object({
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
}), le = e.object({
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
}), ae = e.tuple([
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
]), ie = e.object({
  added_at: e.string(),
  album_id: e.string(),
  user_id: e.string()
}), ne = e.object({
  added_at: e.string().optional(),
  album_id: e.string(),
  user_id: e.string()
}), re = e.object({
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
]), pe = e.object({
  added_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), ge = e.object({
  added_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), _e = e.object({
  added_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), me = e.tuple([
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
]), Oe = e.object({
  created_at: e.string(),
  display_name: e.string().nullable(),
  email: e.string().nullable(),
  id: e.string(),
  profile_url: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), Te = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string(),
  wallet_address: e.string().optional().nullable()
}), Ae = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string().optional(),
  wallet_address: e.string().optional().nullable()
}), Ce = e.object({
  album_id: e.string().nullable(),
  play_count: e.number().nullable()
}), Pe = e.tuple([
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
}), Ue = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ne = e.object({
  play_count: e.number().nullable(),
  track_id: e.string().nullable()
}), Ke = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Le = e.object({
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
]), Ie = e.object({
  album_id: e.string()
}), xe = e.boolean(), Ge = e.object({
  artist_id: e.string()
}), qe = e.boolean(), ze = e.object({
  track_id: e.string()
}), He = e.boolean(), Fe = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), Be = e.undefined(), Ve = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), We = e.string(), De = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), Ee = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), Je = e.object({
  wallet_address: e.string()
}), Me = e.string(), Qe = e.object({
  album_id: e.string()
}), Xe = e.number(), Ye = e.object({
  artist_id: e.string()
}), Ze = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    month_year: e.string()
  })
), $e = e.object({
  artist_id: e.string()
}), et = e.number(), tt = e.object({
  limit_count: e.number().optional()
}), lt = e.array(
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
), at = e.object({
  track_id: e.string()
}), it = e.number(), nt = e.object({
  track_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), rt = e.number(), ot = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), st = e.undefined(), ct = e.object({
  query: e.string()
}), dt = e.undefined(), ut = e.object({}), pt = e.string(), gt = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), _t = e.object({
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
}), mt = e.object({
  wallet_address: e.string(),
  username: e.string(),
  display_name: e.string().optional()
}), bt = e.object({
  created_at: e.string(),
  display_name: e.string().nullable(),
  email: e.string().nullable(),
  id: e.string(),
  profile_url: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), yt = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), ht = e.object({
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
}), St = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), ft = e.string();
function kt(l) {
  return new a(l);
}
export {
  kt as createClient,
  t as jsonSchema,
  Ie as prettygoodAddAlbumToLibraryArgsSchemaSchema,
  xe as prettygoodAddAlbumToLibraryReturnsSchemaSchema,
  Ge as prettygoodAddArtistToLibraryArgsSchemaSchema,
  qe as prettygoodAddArtistToLibraryReturnsSchemaSchema,
  ze as prettygoodAddTrackToLibraryArgsSchemaSchema,
  He as prettygoodAddTrackToLibraryReturnsSchemaSchema,
  Fe as prettygoodAddTrackToPlaylistArgsSchemaSchema,
  Be as prettygoodAddTrackToPlaylistReturnsSchemaSchema,
  o as prettygoodAlbumLikesInsertSchemaSchema,
  c as prettygoodAlbumLikesRelationshipsSchemaSchema,
  r as prettygoodAlbumLikesRowSchemaSchema,
  s as prettygoodAlbumLikesUpdateSchemaSchema,
  Pe as prettygoodAlbumPlayCountsRelationshipsSchemaSchema,
  Ce as prettygoodAlbumPlayCountsRowSchemaSchema,
  u as prettygoodAlbumsInsertSchemaSchema,
  g as prettygoodAlbumsRelationshipsSchemaSchema,
  d as prettygoodAlbumsRowSchemaSchema,
  p as prettygoodAlbumsUpdateSchemaSchema,
  m as prettygoodArtistFollowersInsertSchemaSchema,
  y as prettygoodArtistFollowersRelationshipsSchemaSchema,
  _ as prettygoodArtistFollowersRowSchemaSchema,
  b as prettygoodArtistFollowersUpdateSchemaSchema,
  Ue as prettygoodArtistPlayCountsRelationshipsSchemaSchema,
  we as prettygoodArtistPlayCountsRowSchemaSchema,
  S as prettygoodArtistsInsertSchemaSchema,
  k as prettygoodArtistsRelationshipsSchemaSchema,
  h as prettygoodArtistsRowSchemaSchema,
  f as prettygoodArtistsUpdateSchemaSchema,
  Ve as prettygoodAuthenticateWalletArgsSchemaSchema,
  We as prettygoodAuthenticateWalletReturnsSchemaSchema,
  De as prettygoodCreatePlaylistArgsSchemaSchema,
  Ee as prettygoodCreatePlaylistReturnsSchemaSchema,
  Je as prettygoodGenerateNonceArgsSchemaSchema,
  Me as prettygoodGenerateNonceReturnsSchemaSchema,
  Qe as prettygoodGetAlbumPlayCountArgsSchemaSchema,
  Xe as prettygoodGetAlbumPlayCountReturnsSchemaSchema,
  Ye as prettygoodGetArtistPaymentStatsArgsSchemaSchema,
  Ze as prettygoodGetArtistPaymentStatsReturnsSchemaSchema,
  $e as prettygoodGetArtistPlayCountArgsSchemaSchema,
  et as prettygoodGetArtistPlayCountReturnsSchemaSchema,
  tt as prettygoodGetRecommendationsArgsSchemaSchema,
  lt as prettygoodGetRecommendationsReturnsSchemaSchema,
  at as prettygoodGetTrackPlayCountArgsSchemaSchema,
  nt as prettygoodGetTrackPlayCountByPeriodArgsSchemaSchema,
  rt as prettygoodGetTrackPlayCountByPeriodReturnsSchemaSchema,
  it as prettygoodGetTrackPlayCountReturnsSchemaSchema,
  R as prettygoodPaymentsInsertSchemaSchema,
  T as prettygoodPaymentsRelationshipsSchemaSchema,
  j as prettygoodPaymentsRowSchemaSchema,
  O as prettygoodPaymentsUpdateSchemaSchema,
  C as prettygoodPlayHistoryInsertSchemaSchema,
  w as prettygoodPlayHistoryRelationshipsSchemaSchema,
  A as prettygoodPlayHistoryRowSchemaSchema,
  P as prettygoodPlayHistoryUpdateSchemaSchema,
  N as prettygoodPlaylistCollaboratorsInsertSchemaSchema,
  L as prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema,
  U as prettygoodPlaylistCollaboratorsRowSchemaSchema,
  K as prettygoodPlaylistCollaboratorsUpdateSchemaSchema,
  I as prettygoodPlaylistLikesInsertSchemaSchema,
  G as prettygoodPlaylistLikesRelationshipsSchemaSchema,
  v as prettygoodPlaylistLikesRowSchemaSchema,
  x as prettygoodPlaylistLikesUpdateSchemaSchema,
  z as prettygoodPlaylistTracksInsertSchemaSchema,
  F as prettygoodPlaylistTracksRelationshipsSchemaSchema,
  q as prettygoodPlaylistTracksRowSchemaSchema,
  H as prettygoodPlaylistTracksUpdateSchemaSchema,
  V as prettygoodPlaylistsInsertSchemaSchema,
  D as prettygoodPlaylistsRelationshipsSchemaSchema,
  B as prettygoodPlaylistsRowSchemaSchema,
  W as prettygoodPlaylistsUpdateSchemaSchema,
  ot as prettygoodRecordPlayArgsSchemaSchema,
  st as prettygoodRecordPlayReturnsSchemaSchema,
  ct as prettygoodRecordSearchArgsSchemaSchema,
  dt as prettygoodRecordSearchReturnsSchemaSchema,
  ut as prettygoodRefreshTokenArgsSchemaSchema,
  pt as prettygoodRefreshTokenReturnsSchemaSchema,
  gt as prettygoodRegisterAsArtistArgsSchemaSchema,
  _t as prettygoodRegisterAsArtistReturnsSchemaSchema,
  mt as prettygoodRegisterUserArgsSchemaSchema,
  bt as prettygoodRegisterUserReturnsSchemaSchema,
  J as prettygoodSearchHistoryInsertSchemaSchema,
  Q as prettygoodSearchHistoryRelationshipsSchemaSchema,
  E as prettygoodSearchHistoryRowSchemaSchema,
  M as prettygoodSearchHistoryUpdateSchemaSchema,
  yt as prettygoodTipArtistArgsSchemaSchema,
  ht as prettygoodTipArtistReturnsSchemaSchema,
  Y as prettygoodTrackLikesInsertSchemaSchema,
  $ as prettygoodTrackLikesRelationshipsSchemaSchema,
  X as prettygoodTrackLikesRowSchemaSchema,
  Z as prettygoodTrackLikesUpdateSchemaSchema,
  Ke as prettygoodTrackPlayCountsRelationshipsSchemaSchema,
  Ne as prettygoodTrackPlayCountsRowSchemaSchema,
  te as prettygoodTracksInsertSchemaSchema,
  ae as prettygoodTracksRelationshipsSchemaSchema,
  ee as prettygoodTracksRowSchemaSchema,
  le as prettygoodTracksUpdateSchemaSchema,
  ne as prettygoodUserLibraryAlbumsInsertSchemaSchema,
  oe as prettygoodUserLibraryAlbumsRelationshipsSchemaSchema,
  ie as prettygoodUserLibraryAlbumsRowSchemaSchema,
  re as prettygoodUserLibraryAlbumsUpdateSchemaSchema,
  ce as prettygoodUserLibraryArtistsInsertSchemaSchema,
  ue as prettygoodUserLibraryArtistsRelationshipsSchemaSchema,
  se as prettygoodUserLibraryArtistsRowSchemaSchema,
  de as prettygoodUserLibraryArtistsUpdateSchemaSchema,
  ge as prettygoodUserLibraryTracksInsertSchemaSchema,
  me as prettygoodUserLibraryTracksRelationshipsSchemaSchema,
  pe as prettygoodUserLibraryTracksRowSchemaSchema,
  _e as prettygoodUserLibraryTracksUpdateSchemaSchema,
  ve as prettygoodUserPlayCountsRelationshipsSchemaSchema,
  Le as prettygoodUserPlayCountsRowSchemaSchema,
  ye as prettygoodUserRecentlyPlayedInsertSchemaSchema,
  Se as prettygoodUserRecentlyPlayedRelationshipsSchemaSchema,
  be as prettygoodUserRecentlyPlayedRowSchemaSchema,
  he as prettygoodUserRecentlyPlayedUpdateSchemaSchema,
  ke as prettygoodUserSettingsInsertSchemaSchema,
  Re as prettygoodUserSettingsRelationshipsSchemaSchema,
  fe as prettygoodUserSettingsRowSchemaSchema,
  je as prettygoodUserSettingsUpdateSchemaSchema,
  Te as prettygoodUsersInsertSchemaSchema,
  Oe as prettygoodUsersRowSchemaSchema,
  Ae as prettygoodUsersUpdateSchemaSchema,
  St as prettygoodVerifySignatureArgsSchemaSchema,
  ft as prettygoodVerifySignatureReturnsSchemaSchema
};
