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
), i = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), o = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), s = e.object({
  album_id: e.string().optional(),
  genre_id: e.string().optional()
}), c = e.tuple([
  e.object({
    foreignKeyName: e.literal("album_genres_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("album_genres_genre_id_fkey"),
    columns: e.tuple([e.literal("genre_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("genres"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), d = e.object({
  album_id: e.string(),
  liked_at: e.string(),
  user_id: e.string()
}), g = e.object({
  album_id: e.string(),
  liked_at: e.string().optional(),
  user_id: e.string()
}), u = e.object({
  album_id: e.string().optional(),
  liked_at: e.string().optional(),
  user_id: e.string().optional()
}), p = e.tuple([
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
]), m = e.object({
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
}), _ = e.object({
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
}), b = e.object({
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
}), y = e.tuple([
  e.object({
    foreignKeyName: e.literal("albums_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), h = e.object({
  artist_id: e.string(),
  followed_at: e.string(),
  user_id: e.string()
}), S = e.object({
  artist_id: e.string(),
  followed_at: e.string().optional(),
  user_id: e.string()
}), f = e.object({
  artist_id: e.string().optional(),
  followed_at: e.string().optional(),
  user_id: e.string().optional()
}), k = e.tuple([
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
]), j = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), R = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), A = e.object({
  artist_id: e.string().optional(),
  genre_id: e.string().optional()
}), T = e.tuple([
  e.object({
    foreignKeyName: e.literal("artist_genres_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("artist_genres_genre_id_fkey"),
    columns: e.tuple([e.literal("genre_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("genres"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), P = e.object({
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
}), G = e.object({
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
}), O = e.object({
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
}), C = e.tuple([
  e.object({
    foreignKeyName: e.literal("artists_id_fkey"),
    columns: e.tuple([e.literal("id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), w = e.object({
  color: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  image_url: e.string().nullable(),
  name: e.string(),
  popularity: e.number().nullable(),
  slug: e.string().nullable(),
  updated_at: e.string()
}), U = e.object({
  color: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  image_url: e.string().optional().nullable(),
  name: e.string(),
  popularity: e.number().optional().nullable(),
  slug: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), K = e.object({
  color: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  image_url: e.string().optional().nullable(),
  name: e.string().optional(),
  popularity: e.number().optional().nullable(),
  slug: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), N = e.object({
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
}), v = e.object({
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
}), L = e.object({
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
}), I = e.tuple([
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
]), B = e.object({
  client_ip: e.string().nullable(),
  completed: e.boolean().nullable(),
  id: e.string(),
  play_duration: e.number().nullable(),
  played_at: e.string(),
  source: e.string().nullable(),
  track_id: e.string(),
  user_agent: e.string().nullable(),
  user_id: e.string()
}), F = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string()
}), x = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string().optional(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string().optional()
}), q = e.tuple([
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
]), E = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), H = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), z = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), V = e.tuple(
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
), D = e.object({
  liked_at: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), W = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string(),
  user_id: e.string()
}), J = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), M = e.tuple([
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
]), Q = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), X = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), Y = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  position: e.number().optional(),
  track_id: e.string().optional()
}), Z = e.tuple([
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
]), $ = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), ee = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string(),
  updated_at: e.string().optional(),
  user_id: e.string()
}), te = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string().optional(),
  updated_at: e.string().optional(),
  user_id: e.string().optional()
}), re = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlists_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), ae = e.object({
  id: e.string(),
  query: e.string(),
  searched_at: e.string(),
  user_id: e.string()
}), ne = e.object({
  id: e.string().optional(),
  query: e.string(),
  searched_at: e.string().optional(),
  user_id: e.string()
}), le = e.object({
  id: e.string().optional(),
  query: e.string().optional(),
  searched_at: e.string().optional(),
  user_id: e.string().optional()
}), ie = e.tuple([
  e.object({
    foreignKeyName: e.literal("search_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), oe = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), se = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), ce = e.object({
  genre_id: e.string().optional(),
  track_id: e.string().optional()
}), de = e.tuple([
  e.object({
    foreignKeyName: e.literal("track_genres_genre_id_fkey"),
    columns: e.tuple([e.literal("genre_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("genres"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("track_genres_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), ge = e.object({
  liked_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), ue = e.object({
  liked_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), pe = e.object({
  liked_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), me = e.tuple([
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
]), _e = e.object({
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
}), be = e.object({
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
}), ye = e.object({
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
}), he = e.tuple([
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
]), Se = e.object({
  added_at: e.string(),
  album_id: e.string(),
  user_id: e.string()
}), fe = e.object({
  added_at: e.string().optional(),
  album_id: e.string(),
  user_id: e.string()
}), ke = e.object({
  added_at: e.string().optional(),
  album_id: e.string().optional(),
  user_id: e.string().optional()
}), je = e.tuple([
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
]), Re = e.object({
  added_at: e.string(),
  artist_id: e.string(),
  user_id: e.string()
}), Ae = e.object({
  added_at: e.string().optional(),
  artist_id: e.string(),
  user_id: e.string()
}), Te = e.object({
  added_at: e.string().optional(),
  artist_id: e.string().optional(),
  user_id: e.string().optional()
}), Pe = e.tuple([
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
]), Ge = e.object({
  added_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), Oe = e.object({
  added_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), Ce = e.object({
  added_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), we = e.tuple([
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
]), Ue = e.object({
  context_id: e.string().nullable(),
  context_type: e.string().nullable(),
  id: e.string(),
  played_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), Ke = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), Ne = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), ve = e.tuple([
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
]), Le = e.object({
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
}), Ie = e.object({
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
}), Be = e.object({
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
}), Fe = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_settings_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), xe = e.object({
  created_at: e.string(),
  display_name: e.string().nullable(),
  email: e.string(),
  email_verified: e.boolean().nullable(),
  id: e.string(),
  profile_url: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), qe = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string(),
  wallet_address: e.string().optional().nullable()
}), Ee = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string().optional(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string().optional(),
  wallet_address: e.string().optional().nullable()
}), He = e.object({
  album_id: e.string().nullable(),
  play_count: e.number().nullable()
}), ze = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ve = e.object({
  artist_id: e.string().nullable(),
  play_count: e.number().nullable()
}), De = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), We = e.object({
  play_count: e.number().nullable(),
  track_id: e.string().nullable()
}), Je = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Me = e.object({
  play_count: e.number().nullable(),
  user_id: e.string().nullable()
}), Qe = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Xe = e.object({
  album_id: e.string()
}), Ye = e.boolean(), Ze = e.object({
  artist_id: e.string()
}), $e = e.boolean(), et = e.object({
  track_id: e.string()
}), tt = e.boolean(), rt = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), at = e.undefined(), nt = e.object({
  "": e.string()
}), lt = e.string(), it = e.object({
  email_or_username: e.string(),
  password: e.string()
}), ot = e.string(), st = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), ct = e.string(), dt = e.object({
  user_id: e.string()
}), gt = e.string(), ut = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), pt = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), mt = e.object({
  "": e.string()
}), _t = e.string(), bt = e.object({
  "": e.number()
}), yt = e.string(), ht = e.object({}), St = e.string(), ft = e.object({
  "": e.string()
}), kt = e.string(), jt = e.object({
  wallet_address: e.string()
}), Rt = e.string(), At = e.object({
  album_id: e.string()
}), Tt = e.number(), Pt = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), Gt = e.array(
  e.object({
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
  })
), Ot = e.object({
  artist_id: e.string()
}), Ct = e.number(), wt = e.object({
  artist_id: e.string()
}), Ut = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    month_year: e.string()
  })
), Kt = e.object({
  artist_id: e.string()
}), Nt = e.number(), vt = e.object({
  artist_id: e.string()
}), Lt = e.number(), It = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), Bt = e.array(
  e.object({
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
  })
), Ft = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), xt = e.array(
  e.object({
    payment_type: e.string(),
    amount: e.number()
  })
), qt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Et = e.array(
  e.object({
    period: e.string(),
    amount: e.number()
  })
), Ht = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), zt = e.number(), Vt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Dt = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), Wt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Jt = e.number(), Mt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Qt = e.array(
  e.object({
    avg_duration: e.number(),
    completed_count: e.number(),
    total_count: e.number()
  })
), Xt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Yt = e.array(
  e.object({
    country_code: e.string(),
    play_count: e.number()
  })
), Zt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), $t = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), er = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), tr = e.array(
  e.object({
    source: e.string(),
    count: e.number()
  })
), rr = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), ar = e.number(), nr = e.object({
  p_start_date: e.string(),
  p_end_date: e.string(),
  p_limit: e.number().optional()
}), lr = e.array(
  e.object({
    color: e.string().nullable(),
    created_at: e.string(),
    description: e.string().nullable(),
    id: e.string(),
    image_url: e.string().nullable(),
    name: e.string(),
    popularity: e.number().nullable(),
    slug: e.string().nullable(),
    updated_at: e.string()
  })
), ir = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), or = e.array(
  e.object({
    added_at: e.string(),
    user_id: e.string(),
    username: e.string()
  })
), sr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), cr = e.array(
  e.object({
    played_at: e.string(),
    track_id: e.string(),
    track_title: e.string(),
    username: e.string()
  })
), dr = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), gr = e.array(
  e.object({
    created_at: e.string(),
    amount: e.number(),
    username: e.string()
  })
), ur = e.object({
  artist_id: e.string(),
  limit_count: e.number().optional()
}), pr = e.array(
  e.object({
    id: e.string(),
    created_at: e.string(),
    amount: e.number(),
    payment_type: e.string(),
    sender_id: e.string(),
    username: e.string()
  })
), mr = e.object({
  limit_count: e.number().optional()
}), _r = e.array(
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
), br = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional()
}), yr = e.array(
  e.object({
    color: e.string().nullable(),
    created_at: e.string(),
    description: e.string().nullable(),
    id: e.string(),
    image_url: e.string().nullable(),
    name: e.string(),
    popularity: e.number().nullable(),
    slug: e.string().nullable(),
    updated_at: e.string()
  })
), hr = e.object({
  track_id: e.string()
}), Sr = e.number(), fr = e.object({
  track_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), kr = e.number(), jr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), Rr = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Ar = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Tr = e.number(), Pr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Gr = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Or = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Cr = e.number(), wr = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), Ur = e.array(
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
), Kr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), Nr = e.number(), vr = e.object({
  "": e.string()
}), Lr = e.array(
  e.record(e.unknown())
), Ir = e.object({
  "": e.string()
}), Br = e.string(), Fr = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), xr = e.undefined(), qr = e.object({
  query: e.string()
}), Er = e.undefined(), Hr = e.object({}), zr = e.string(), Vr = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), Dr = e.object({
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
}), Wr = e.object({
  _username: e.string(),
  _email: e.string(),
  _password: e.string(),
  _display_name: e.string().optional(),
  _wallet_address: e.string().optional()
}), Jr = t, Mr = e.object({
  email: e.string()
}), Qr = e.string(), Xr = e.object({
  reset_token: e.string(),
  new_password: e.string()
}), Yr = e.boolean(), Zr = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), $r = e.object({
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
}), ea = e.object({
  verification_token: e.string()
}), ta = e.boolean(), ra = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), aa = e.string(), na = {
  prettygood: {
    Enums: {}
  }
};
function la(r) {
  return new a(r);
}
export {
  na as Constants,
  la as createClient,
  t as jsonSchema,
  Xe as prettygoodAddAlbumToLibraryArgsSchemaSchema,
  Ye as prettygoodAddAlbumToLibraryReturnsSchemaSchema,
  Ze as prettygoodAddArtistToLibraryArgsSchemaSchema,
  $e as prettygoodAddArtistToLibraryReturnsSchemaSchema,
  et as prettygoodAddTrackToLibraryArgsSchemaSchema,
  tt as prettygoodAddTrackToLibraryReturnsSchemaSchema,
  rt as prettygoodAddTrackToPlaylistArgsSchemaSchema,
  at as prettygoodAddTrackToPlaylistReturnsSchemaSchema,
  o as prettygoodAlbumGenresInsertSchemaSchema,
  c as prettygoodAlbumGenresRelationshipsSchemaSchema,
  i as prettygoodAlbumGenresRowSchemaSchema,
  s as prettygoodAlbumGenresUpdateSchemaSchema,
  g as prettygoodAlbumLikesInsertSchemaSchema,
  p as prettygoodAlbumLikesRelationshipsSchemaSchema,
  d as prettygoodAlbumLikesRowSchemaSchema,
  u as prettygoodAlbumLikesUpdateSchemaSchema,
  ze as prettygoodAlbumPlayCountsRelationshipsSchemaSchema,
  He as prettygoodAlbumPlayCountsRowSchemaSchema,
  _ as prettygoodAlbumsInsertSchemaSchema,
  y as prettygoodAlbumsRelationshipsSchemaSchema,
  m as prettygoodAlbumsRowSchemaSchema,
  b as prettygoodAlbumsUpdateSchemaSchema,
  nt as prettygoodArmorArgsSchemaSchema,
  lt as prettygoodArmorReturnsSchemaSchema,
  S as prettygoodArtistFollowersInsertSchemaSchema,
  k as prettygoodArtistFollowersRelationshipsSchemaSchema,
  h as prettygoodArtistFollowersRowSchemaSchema,
  f as prettygoodArtistFollowersUpdateSchemaSchema,
  R as prettygoodArtistGenresInsertSchemaSchema,
  T as prettygoodArtistGenresRelationshipsSchemaSchema,
  j as prettygoodArtistGenresRowSchemaSchema,
  A as prettygoodArtistGenresUpdateSchemaSchema,
  De as prettygoodArtistPlayCountsRelationshipsSchemaSchema,
  Ve as prettygoodArtistPlayCountsRowSchemaSchema,
  G as prettygoodArtistsInsertSchemaSchema,
  C as prettygoodArtistsRelationshipsSchemaSchema,
  P as prettygoodArtistsRowSchemaSchema,
  O as prettygoodArtistsUpdateSchemaSchema,
  it as prettygoodAuthenticateUserArgsSchemaSchema,
  ot as prettygoodAuthenticateUserReturnsSchemaSchema,
  st as prettygoodAuthenticateWalletArgsSchemaSchema,
  ct as prettygoodAuthenticateWalletReturnsSchemaSchema,
  dt as prettygoodCreateEmailVerificationTokenArgsSchemaSchema,
  gt as prettygoodCreateEmailVerificationTokenReturnsSchemaSchema,
  ut as prettygoodCreatePlaylistArgsSchemaSchema,
  pt as prettygoodCreatePlaylistReturnsSchemaSchema,
  mt as prettygoodDearmorArgsSchemaSchema,
  _t as prettygoodDearmorReturnsSchemaSchema,
  bt as prettygoodGenRandomBytesArgsSchemaSchema,
  yt as prettygoodGenRandomBytesReturnsSchemaSchema,
  ht as prettygoodGenRandomUuidArgsSchemaSchema,
  St as prettygoodGenRandomUuidReturnsSchemaSchema,
  ft as prettygoodGenSaltArgsSchemaSchema,
  kt as prettygoodGenSaltReturnsSchemaSchema,
  jt as prettygoodGenerateNonceArgsSchemaSchema,
  Rt as prettygoodGenerateNonceReturnsSchemaSchema,
  U as prettygoodGenresInsertSchemaSchema,
  w as prettygoodGenresRowSchemaSchema,
  K as prettygoodGenresUpdateSchemaSchema,
  At as prettygoodGetAlbumPlayCountArgsSchemaSchema,
  Tt as prettygoodGetAlbumPlayCountReturnsSchemaSchema,
  Pt as prettygoodGetAlbumsByGenreArgsSchemaSchema,
  Gt as prettygoodGetAlbumsByGenreReturnsSchemaSchema,
  Ot as prettygoodGetArtistFollowersCountArgsSchemaSchema,
  Ct as prettygoodGetArtistFollowersCountReturnsSchemaSchema,
  wt as prettygoodGetArtistPaymentStatsArgsSchemaSchema,
  Ut as prettygoodGetArtistPaymentStatsReturnsSchemaSchema,
  Kt as prettygoodGetArtistPlayCountArgsSchemaSchema,
  Nt as prettygoodGetArtistPlayCountReturnsSchemaSchema,
  vt as prettygoodGetArtistTotalEarningsArgsSchemaSchema,
  Lt as prettygoodGetArtistTotalEarningsReturnsSchemaSchema,
  It as prettygoodGetArtistsByGenreArgsSchemaSchema,
  Bt as prettygoodGetArtistsByGenreReturnsSchemaSchema,
  Ft as prettygoodGetEarningsByPaymentTypeArgsSchemaSchema,
  xt as prettygoodGetEarningsByPaymentTypeReturnsSchemaSchema,
  qt as prettygoodGetEarningsByPeriodArgsSchemaSchema,
  Et as prettygoodGetEarningsByPeriodReturnsSchemaSchema,
  Ht as prettygoodGetEarningsForPeriodArgsSchemaSchema,
  zt as prettygoodGetEarningsForPeriodReturnsSchemaSchema,
  Vt as prettygoodGetFollowersByPeriodArgsSchemaSchema,
  Dt as prettygoodGetFollowersByPeriodReturnsSchemaSchema,
  Wt as prettygoodGetFollowersCountForPeriodArgsSchemaSchema,
  Jt as prettygoodGetFollowersCountForPeriodReturnsSchemaSchema,
  Mt as prettygoodGetPlayDurationStatsArgsSchemaSchema,
  Qt as prettygoodGetPlayDurationStatsReturnsSchemaSchema,
  Xt as prettygoodGetPlaysByCountryArgsSchemaSchema,
  Yt as prettygoodGetPlaysByCountryReturnsSchemaSchema,
  Zt as prettygoodGetPlaysByPeriodArgsSchemaSchema,
  $t as prettygoodGetPlaysByPeriodReturnsSchemaSchema,
  er as prettygoodGetPlaysBySourceArgsSchemaSchema,
  tr as prettygoodGetPlaysBySourceReturnsSchemaSchema,
  rr as prettygoodGetPlaysForPeriodArgsSchemaSchema,
  ar as prettygoodGetPlaysForPeriodReturnsSchemaSchema,
  nr as prettygoodGetPopularGenresArgsSchemaSchema,
  lr as prettygoodGetPopularGenresReturnsSchemaSchema,
  ir as prettygoodGetRecentFollowersArgsSchemaSchema,
  or as prettygoodGetRecentFollowersReturnsSchemaSchema,
  sr as prettygoodGetRecentPlaysArgsSchemaSchema,
  cr as prettygoodGetRecentPlaysReturnsSchemaSchema,
  dr as prettygoodGetRecentTipsArgsSchemaSchema,
  gr as prettygoodGetRecentTipsReturnsSchemaSchema,
  ur as prettygoodGetRecentTransactionsArgsSchemaSchema,
  pr as prettygoodGetRecentTransactionsReturnsSchemaSchema,
  mr as prettygoodGetRecommendationsArgsSchemaSchema,
  _r as prettygoodGetRecommendationsReturnsSchemaSchema,
  br as prettygoodGetRelatedGenresArgsSchemaSchema,
  yr as prettygoodGetRelatedGenresReturnsSchemaSchema,
  hr as prettygoodGetTrackPlayCountArgsSchemaSchema,
  fr as prettygoodGetTrackPlayCountByPeriodArgsSchemaSchema,
  kr as prettygoodGetTrackPlayCountByPeriodReturnsSchemaSchema,
  Sr as prettygoodGetTrackPlayCountReturnsSchemaSchema,
  jr as prettygoodGetTrackPlayCountsArgsSchemaSchema,
  Rr as prettygoodGetTrackPlayCountsReturnsSchemaSchema,
  Ar as prettygoodGetTrackPlaylistsCountArgsSchemaSchema,
  Tr as prettygoodGetTrackPlaylistsCountReturnsSchemaSchema,
  Pr as prettygoodGetTrackPlaysForPeriodArgsSchemaSchema,
  Gr as prettygoodGetTrackPlaysForPeriodReturnsSchemaSchema,
  Or as prettygoodGetTrackSavesCountArgsSchemaSchema,
  Cr as prettygoodGetTrackSavesCountReturnsSchemaSchema,
  wr as prettygoodGetTracksByGenreArgsSchemaSchema,
  Ur as prettygoodGetTracksByGenreReturnsSchemaSchema,
  Kr as prettygoodGetTracksPlayCountArgsSchemaSchema,
  Nr as prettygoodGetTracksPlayCountReturnsSchemaSchema,
  v as prettygoodPaymentsInsertSchemaSchema,
  I as prettygoodPaymentsRelationshipsSchemaSchema,
  N as prettygoodPaymentsRowSchemaSchema,
  L as prettygoodPaymentsUpdateSchemaSchema,
  vr as prettygoodPgpArmorHeadersArgsSchemaSchema,
  Lr as prettygoodPgpArmorHeadersReturnsSchemaSchema,
  Ir as prettygoodPgpKeyIdArgsSchemaSchema,
  Br as prettygoodPgpKeyIdReturnsSchemaSchema,
  F as prettygoodPlayHistoryInsertSchemaSchema,
  q as prettygoodPlayHistoryRelationshipsSchemaSchema,
  B as prettygoodPlayHistoryRowSchemaSchema,
  x as prettygoodPlayHistoryUpdateSchemaSchema,
  H as prettygoodPlaylistCollaboratorsInsertSchemaSchema,
  V as prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema,
  E as prettygoodPlaylistCollaboratorsRowSchemaSchema,
  z as prettygoodPlaylistCollaboratorsUpdateSchemaSchema,
  W as prettygoodPlaylistLikesInsertSchemaSchema,
  M as prettygoodPlaylistLikesRelationshipsSchemaSchema,
  D as prettygoodPlaylistLikesRowSchemaSchema,
  J as prettygoodPlaylistLikesUpdateSchemaSchema,
  X as prettygoodPlaylistTracksInsertSchemaSchema,
  Z as prettygoodPlaylistTracksRelationshipsSchemaSchema,
  Q as prettygoodPlaylistTracksRowSchemaSchema,
  Y as prettygoodPlaylistTracksUpdateSchemaSchema,
  ee as prettygoodPlaylistsInsertSchemaSchema,
  re as prettygoodPlaylistsRelationshipsSchemaSchema,
  $ as prettygoodPlaylistsRowSchemaSchema,
  te as prettygoodPlaylistsUpdateSchemaSchema,
  Fr as prettygoodRecordPlayArgsSchemaSchema,
  xr as prettygoodRecordPlayReturnsSchemaSchema,
  qr as prettygoodRecordSearchArgsSchemaSchema,
  Er as prettygoodRecordSearchReturnsSchemaSchema,
  Hr as prettygoodRefreshTokenArgsSchemaSchema,
  zr as prettygoodRefreshTokenReturnsSchemaSchema,
  Vr as prettygoodRegisterAsArtistArgsSchemaSchema,
  Dr as prettygoodRegisterAsArtistReturnsSchemaSchema,
  Wr as prettygoodRegisterUserArgsSchemaSchema,
  Jr as prettygoodRegisterUserReturnsSchemaSchema,
  Mr as prettygoodRequestPasswordResetArgsSchemaSchema,
  Qr as prettygoodRequestPasswordResetReturnsSchemaSchema,
  Xr as prettygoodResetPasswordArgsSchemaSchema,
  Yr as prettygoodResetPasswordReturnsSchemaSchema,
  ne as prettygoodSearchHistoryInsertSchemaSchema,
  ie as prettygoodSearchHistoryRelationshipsSchemaSchema,
  ae as prettygoodSearchHistoryRowSchemaSchema,
  le as prettygoodSearchHistoryUpdateSchemaSchema,
  Zr as prettygoodTipArtistArgsSchemaSchema,
  $r as prettygoodTipArtistReturnsSchemaSchema,
  se as prettygoodTrackGenresInsertSchemaSchema,
  de as prettygoodTrackGenresRelationshipsSchemaSchema,
  oe as prettygoodTrackGenresRowSchemaSchema,
  ce as prettygoodTrackGenresUpdateSchemaSchema,
  ue as prettygoodTrackLikesInsertSchemaSchema,
  me as prettygoodTrackLikesRelationshipsSchemaSchema,
  ge as prettygoodTrackLikesRowSchemaSchema,
  pe as prettygoodTrackLikesUpdateSchemaSchema,
  Je as prettygoodTrackPlayCountsRelationshipsSchemaSchema,
  We as prettygoodTrackPlayCountsRowSchemaSchema,
  be as prettygoodTracksInsertSchemaSchema,
  he as prettygoodTracksRelationshipsSchemaSchema,
  _e as prettygoodTracksRowSchemaSchema,
  ye as prettygoodTracksUpdateSchemaSchema,
  fe as prettygoodUserLibraryAlbumsInsertSchemaSchema,
  je as prettygoodUserLibraryAlbumsRelationshipsSchemaSchema,
  Se as prettygoodUserLibraryAlbumsRowSchemaSchema,
  ke as prettygoodUserLibraryAlbumsUpdateSchemaSchema,
  Ae as prettygoodUserLibraryArtistsInsertSchemaSchema,
  Pe as prettygoodUserLibraryArtistsRelationshipsSchemaSchema,
  Re as prettygoodUserLibraryArtistsRowSchemaSchema,
  Te as prettygoodUserLibraryArtistsUpdateSchemaSchema,
  Oe as prettygoodUserLibraryTracksInsertSchemaSchema,
  we as prettygoodUserLibraryTracksRelationshipsSchemaSchema,
  Ge as prettygoodUserLibraryTracksRowSchemaSchema,
  Ce as prettygoodUserLibraryTracksUpdateSchemaSchema,
  Qe as prettygoodUserPlayCountsRelationshipsSchemaSchema,
  Me as prettygoodUserPlayCountsRowSchemaSchema,
  Ke as prettygoodUserRecentlyPlayedInsertSchemaSchema,
  ve as prettygoodUserRecentlyPlayedRelationshipsSchemaSchema,
  Ue as prettygoodUserRecentlyPlayedRowSchemaSchema,
  Ne as prettygoodUserRecentlyPlayedUpdateSchemaSchema,
  Ie as prettygoodUserSettingsInsertSchemaSchema,
  Fe as prettygoodUserSettingsRelationshipsSchemaSchema,
  Le as prettygoodUserSettingsRowSchemaSchema,
  Be as prettygoodUserSettingsUpdateSchemaSchema,
  qe as prettygoodUsersInsertSchemaSchema,
  xe as prettygoodUsersRowSchemaSchema,
  Ee as prettygoodUsersUpdateSchemaSchema,
  ea as prettygoodVerifyEmailArgsSchemaSchema,
  ta as prettygoodVerifyEmailReturnsSchemaSchema,
  ra as prettygoodVerifySignatureArgsSchemaSchema,
  aa as prettygoodVerifySignatureReturnsSchemaSchema
};
