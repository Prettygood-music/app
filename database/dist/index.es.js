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
}), N = e.object({
  color: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  image_url: e.string().optional().nullable(),
  name: e.string().optional(),
  popularity: e.number().optional().nullable(),
  slug: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), K = e.object({
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
}), z = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), H = e.object({
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
}), ae = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlists_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), re = e.object({
  id: e.string(),
  query: e.string(),
  searched_at: e.string(),
  user_id: e.string()
}), le = e.object({
  id: e.string().optional(),
  query: e.string(),
  searched_at: e.string().optional(),
  user_id: e.string()
}), ne = e.object({
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
}), Ne = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), Ke = e.object({
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
}), ze = e.object({
  album_id: e.string().nullable(),
  play_count: e.number().nullable()
}), He = e.tuple([
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
}), tt = e.boolean(), at = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), rt = e.undefined(), lt = e.object({
  email_or_username: e.string(),
  password: e.string()
}), nt = e.string(), it = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), ot = e.string(), st = e.object({
  user_id: e.string()
}), ct = e.string(), dt = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), gt = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), ut = e.object({
  wallet_address: e.string()
}), pt = e.string(), mt = e.object({
  album_id: e.string()
}), _t = e.number(), bt = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), yt = e.array(
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
), ht = e.object({
  artist_id: e.string()
}), St = e.number(), ft = e.object({
  artist_id: e.string()
}), kt = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    month_year: e.string()
  })
), jt = e.object({
  artist_id: e.string()
}), Rt = e.number(), At = e.object({
  artist_id: e.string()
}), Tt = e.number(), Pt = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), Gt = e.array(
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
), Ot = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Ct = e.array(
  e.object({
    payment_type: e.string(),
    amount: e.number()
  })
), wt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Ut = e.array(
  e.object({
    period: e.string(),
    amount: e.number()
  })
), Nt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Kt = e.number(), vt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Lt = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), It = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Bt = e.number(), Ft = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), xt = e.array(
  e.object({
    avg_duration: e.number(),
    completed_count: e.number(),
    total_count: e.number()
  })
), qt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Et = e.array(
  e.object({
    country_code: e.string(),
    play_count: e.number()
  })
), zt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Ht = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), Vt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Dt = e.array(
  e.object({
    source: e.string(),
    count: e.number()
  })
), Wt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Jt = e.number(), Mt = e.object({
  p_start_date: e.string(),
  p_end_date: e.string(),
  p_limit: e.number().optional()
}), Qt = e.array(
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
), Xt = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), Yt = e.array(
  e.object({
    added_at: e.string(),
    user_id: e.string(),
    username: e.string()
  })
), Zt = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), $t = e.array(
  e.object({
    played_at: e.string(),
    track_id: e.string(),
    track_title: e.string(),
    username: e.string()
  })
), ea = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), ta = e.array(
  e.object({
    created_at: e.string(),
    amount: e.number(),
    username: e.string()
  })
), aa = e.object({
  artist_id: e.string(),
  limit_count: e.number().optional()
}), ra = e.array(
  e.object({
    id: e.string(),
    created_at: e.string(),
    amount: e.number(),
    payment_type: e.string(),
    sender_id: e.string(),
    username: e.string()
  })
), la = e.object({
  limit_count: e.number().optional()
}), na = e.array(
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
), ia = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional()
}), oa = e.array(
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
), sa = e.object({
  track_id: e.string()
}), ca = e.number(), da = e.object({
  track_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), ga = e.number(), ua = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), pa = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), ma = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), _a = e.number(), ba = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), ya = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), ha = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Sa = e.number(), fa = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), ka = e.array(
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
), ja = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), Ra = e.number(), Aa = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), Ta = e.undefined(), Pa = e.object({
  query: e.string()
}), Ga = e.undefined(), Oa = e.object({}), Ca = e.string(), wa = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), Ua = e.object({
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
}), Na = e.object({
  email: e.string()
}), Ka = e.string(), va = e.object({
  reset_token: e.string(),
  new_password: e.string()
}), La = e.boolean(), Ia = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), Ba = e.object({
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
}), Fa = e.object({
  verification_token: e.string()
}), xa = e.boolean(), qa = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), Ea = e.string(), za = {
  prettygood: {
    Enums: {}
  }
};
function Ha(a) {
  return new r(a);
}
export {
  za as Constants,
  Ha as createClient,
  t as jsonSchema,
  Xe as prettygoodAddAlbumToLibraryArgsSchemaSchema,
  Ye as prettygoodAddAlbumToLibraryReturnsSchemaSchema,
  Ze as prettygoodAddArtistToLibraryArgsSchemaSchema,
  $e as prettygoodAddArtistToLibraryReturnsSchemaSchema,
  et as prettygoodAddTrackToLibraryArgsSchemaSchema,
  tt as prettygoodAddTrackToLibraryReturnsSchemaSchema,
  at as prettygoodAddTrackToPlaylistArgsSchemaSchema,
  rt as prettygoodAddTrackToPlaylistReturnsSchemaSchema,
  o as prettygoodAlbumGenresInsertSchemaSchema,
  c as prettygoodAlbumGenresRelationshipsSchemaSchema,
  i as prettygoodAlbumGenresRowSchemaSchema,
  s as prettygoodAlbumGenresUpdateSchemaSchema,
  g as prettygoodAlbumLikesInsertSchemaSchema,
  p as prettygoodAlbumLikesRelationshipsSchemaSchema,
  d as prettygoodAlbumLikesRowSchemaSchema,
  u as prettygoodAlbumLikesUpdateSchemaSchema,
  He as prettygoodAlbumPlayCountsRelationshipsSchemaSchema,
  ze as prettygoodAlbumPlayCountsRowSchemaSchema,
  _ as prettygoodAlbumsInsertSchemaSchema,
  y as prettygoodAlbumsRelationshipsSchemaSchema,
  m as prettygoodAlbumsRowSchemaSchema,
  b as prettygoodAlbumsUpdateSchemaSchema,
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
  lt as prettygoodAuthenticateUserArgsSchemaSchema,
  nt as prettygoodAuthenticateUserReturnsSchemaSchema,
  it as prettygoodAuthenticateWalletArgsSchemaSchema,
  ot as prettygoodAuthenticateWalletReturnsSchemaSchema,
  st as prettygoodCreateEmailVerificationTokenArgsSchemaSchema,
  ct as prettygoodCreateEmailVerificationTokenReturnsSchemaSchema,
  dt as prettygoodCreatePlaylistArgsSchemaSchema,
  gt as prettygoodCreatePlaylistReturnsSchemaSchema,
  ut as prettygoodGenerateNonceArgsSchemaSchema,
  pt as prettygoodGenerateNonceReturnsSchemaSchema,
  U as prettygoodGenresInsertSchemaSchema,
  w as prettygoodGenresRowSchemaSchema,
  N as prettygoodGenresUpdateSchemaSchema,
  mt as prettygoodGetAlbumPlayCountArgsSchemaSchema,
  _t as prettygoodGetAlbumPlayCountReturnsSchemaSchema,
  bt as prettygoodGetAlbumsByGenreArgsSchemaSchema,
  yt as prettygoodGetAlbumsByGenreReturnsSchemaSchema,
  ht as prettygoodGetArtistFollowersCountArgsSchemaSchema,
  St as prettygoodGetArtistFollowersCountReturnsSchemaSchema,
  ft as prettygoodGetArtistPaymentStatsArgsSchemaSchema,
  kt as prettygoodGetArtistPaymentStatsReturnsSchemaSchema,
  jt as prettygoodGetArtistPlayCountArgsSchemaSchema,
  Rt as prettygoodGetArtistPlayCountReturnsSchemaSchema,
  At as prettygoodGetArtistTotalEarningsArgsSchemaSchema,
  Tt as prettygoodGetArtistTotalEarningsReturnsSchemaSchema,
  Pt as prettygoodGetArtistsByGenreArgsSchemaSchema,
  Gt as prettygoodGetArtistsByGenreReturnsSchemaSchema,
  Ot as prettygoodGetEarningsByPaymentTypeArgsSchemaSchema,
  Ct as prettygoodGetEarningsByPaymentTypeReturnsSchemaSchema,
  wt as prettygoodGetEarningsByPeriodArgsSchemaSchema,
  Ut as prettygoodGetEarningsByPeriodReturnsSchemaSchema,
  Nt as prettygoodGetEarningsForPeriodArgsSchemaSchema,
  Kt as prettygoodGetEarningsForPeriodReturnsSchemaSchema,
  vt as prettygoodGetFollowersByPeriodArgsSchemaSchema,
  Lt as prettygoodGetFollowersByPeriodReturnsSchemaSchema,
  It as prettygoodGetFollowersCountForPeriodArgsSchemaSchema,
  Bt as prettygoodGetFollowersCountForPeriodReturnsSchemaSchema,
  Ft as prettygoodGetPlayDurationStatsArgsSchemaSchema,
  xt as prettygoodGetPlayDurationStatsReturnsSchemaSchema,
  qt as prettygoodGetPlaysByCountryArgsSchemaSchema,
  Et as prettygoodGetPlaysByCountryReturnsSchemaSchema,
  zt as prettygoodGetPlaysByPeriodArgsSchemaSchema,
  Ht as prettygoodGetPlaysByPeriodReturnsSchemaSchema,
  Vt as prettygoodGetPlaysBySourceArgsSchemaSchema,
  Dt as prettygoodGetPlaysBySourceReturnsSchemaSchema,
  Wt as prettygoodGetPlaysForPeriodArgsSchemaSchema,
  Jt as prettygoodGetPlaysForPeriodReturnsSchemaSchema,
  Mt as prettygoodGetPopularGenresArgsSchemaSchema,
  Qt as prettygoodGetPopularGenresReturnsSchemaSchema,
  Xt as prettygoodGetRecentFollowersArgsSchemaSchema,
  Yt as prettygoodGetRecentFollowersReturnsSchemaSchema,
  Zt as prettygoodGetRecentPlaysArgsSchemaSchema,
  $t as prettygoodGetRecentPlaysReturnsSchemaSchema,
  ea as prettygoodGetRecentTipsArgsSchemaSchema,
  ta as prettygoodGetRecentTipsReturnsSchemaSchema,
  aa as prettygoodGetRecentTransactionsArgsSchemaSchema,
  ra as prettygoodGetRecentTransactionsReturnsSchemaSchema,
  la as prettygoodGetRecommendationsArgsSchemaSchema,
  na as prettygoodGetRecommendationsReturnsSchemaSchema,
  ia as prettygoodGetRelatedGenresArgsSchemaSchema,
  oa as prettygoodGetRelatedGenresReturnsSchemaSchema,
  sa as prettygoodGetTrackPlayCountArgsSchemaSchema,
  da as prettygoodGetTrackPlayCountByPeriodArgsSchemaSchema,
  ga as prettygoodGetTrackPlayCountByPeriodReturnsSchemaSchema,
  ca as prettygoodGetTrackPlayCountReturnsSchemaSchema,
  ua as prettygoodGetTrackPlayCountsArgsSchemaSchema,
  pa as prettygoodGetTrackPlayCountsReturnsSchemaSchema,
  ma as prettygoodGetTrackPlaylistsCountArgsSchemaSchema,
  _a as prettygoodGetTrackPlaylistsCountReturnsSchemaSchema,
  ba as prettygoodGetTrackPlaysForPeriodArgsSchemaSchema,
  ya as prettygoodGetTrackPlaysForPeriodReturnsSchemaSchema,
  ha as prettygoodGetTrackSavesCountArgsSchemaSchema,
  Sa as prettygoodGetTrackSavesCountReturnsSchemaSchema,
  fa as prettygoodGetTracksByGenreArgsSchemaSchema,
  ka as prettygoodGetTracksByGenreReturnsSchemaSchema,
  ja as prettygoodGetTracksPlayCountArgsSchemaSchema,
  Ra as prettygoodGetTracksPlayCountReturnsSchemaSchema,
  v as prettygoodPaymentsInsertSchemaSchema,
  I as prettygoodPaymentsRelationshipsSchemaSchema,
  K as prettygoodPaymentsRowSchemaSchema,
  L as prettygoodPaymentsUpdateSchemaSchema,
  F as prettygoodPlayHistoryInsertSchemaSchema,
  q as prettygoodPlayHistoryRelationshipsSchemaSchema,
  B as prettygoodPlayHistoryRowSchemaSchema,
  x as prettygoodPlayHistoryUpdateSchemaSchema,
  z as prettygoodPlaylistCollaboratorsInsertSchemaSchema,
  V as prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema,
  E as prettygoodPlaylistCollaboratorsRowSchemaSchema,
  H as prettygoodPlaylistCollaboratorsUpdateSchemaSchema,
  W as prettygoodPlaylistLikesInsertSchemaSchema,
  M as prettygoodPlaylistLikesRelationshipsSchemaSchema,
  D as prettygoodPlaylistLikesRowSchemaSchema,
  J as prettygoodPlaylistLikesUpdateSchemaSchema,
  X as prettygoodPlaylistTracksInsertSchemaSchema,
  Z as prettygoodPlaylistTracksRelationshipsSchemaSchema,
  Q as prettygoodPlaylistTracksRowSchemaSchema,
  Y as prettygoodPlaylistTracksUpdateSchemaSchema,
  ee as prettygoodPlaylistsInsertSchemaSchema,
  ae as prettygoodPlaylistsRelationshipsSchemaSchema,
  $ as prettygoodPlaylistsRowSchemaSchema,
  te as prettygoodPlaylistsUpdateSchemaSchema,
  Aa as prettygoodRecordPlayArgsSchemaSchema,
  Ta as prettygoodRecordPlayReturnsSchemaSchema,
  Pa as prettygoodRecordSearchArgsSchemaSchema,
  Ga as prettygoodRecordSearchReturnsSchemaSchema,
  Oa as prettygoodRefreshTokenArgsSchemaSchema,
  Ca as prettygoodRefreshTokenReturnsSchemaSchema,
  wa as prettygoodRegisterAsArtistArgsSchemaSchema,
  Ua as prettygoodRegisterAsArtistReturnsSchemaSchema,
  Na as prettygoodRequestPasswordResetArgsSchemaSchema,
  Ka as prettygoodRequestPasswordResetReturnsSchemaSchema,
  va as prettygoodResetPasswordArgsSchemaSchema,
  La as prettygoodResetPasswordReturnsSchemaSchema,
  le as prettygoodSearchHistoryInsertSchemaSchema,
  ie as prettygoodSearchHistoryRelationshipsSchemaSchema,
  re as prettygoodSearchHistoryRowSchemaSchema,
  ne as prettygoodSearchHistoryUpdateSchemaSchema,
  Ia as prettygoodTipArtistArgsSchemaSchema,
  Ba as prettygoodTipArtistReturnsSchemaSchema,
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
  Ne as prettygoodUserRecentlyPlayedInsertSchemaSchema,
  ve as prettygoodUserRecentlyPlayedRelationshipsSchemaSchema,
  Ue as prettygoodUserRecentlyPlayedRowSchemaSchema,
  Ke as prettygoodUserRecentlyPlayedUpdateSchemaSchema,
  Ie as prettygoodUserSettingsInsertSchemaSchema,
  Fe as prettygoodUserSettingsRelationshipsSchemaSchema,
  Le as prettygoodUserSettingsRowSchemaSchema,
  Be as prettygoodUserSettingsUpdateSchemaSchema,
  qe as prettygoodUsersInsertSchemaSchema,
  xe as prettygoodUsersRowSchemaSchema,
  Ee as prettygoodUsersUpdateSchemaSchema,
  Fa as prettygoodVerifyEmailArgsSchemaSchema,
  xa as prettygoodVerifyEmailReturnsSchemaSchema,
  qa as prettygoodVerifySignatureArgsSchemaSchema,
  Ea as prettygoodVerifySignatureReturnsSchemaSchema
};
