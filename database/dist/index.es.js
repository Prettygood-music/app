import { PostgrestClient as n } from "@supabase/postgrest-js";
import { z as e } from "zod";
const t = e.lazy(
  () => e.union([
    e.string(),
    e.number(),
    e.boolean(),
    e.record(e.union([t, e.undefined()])),
    e.array(t)
  ]).nullable()
), o = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), s = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), c = e.object({
  album_id: e.string().optional(),
  genre_id: e.string().optional()
}), d = e.tuple([
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
]), g = e.object({
  album_id: e.string(),
  liked_at: e.string(),
  user_id: e.string()
}), u = e.object({
  album_id: e.string(),
  liked_at: e.string().optional(),
  user_id: e.string()
}), p = e.object({
  album_id: e.string().optional(),
  liked_at: e.string().optional(),
  user_id: e.string().optional()
}), m = e.tuple([
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
]), _ = e.object({
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
}), b = e.object({
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
}), y = e.object({
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
}), h = e.tuple([
  e.object({
    foreignKeyName: e.literal("albums_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), S = e.object({
  artist_id: e.string(),
  followed_at: e.string(),
  user_id: e.string()
}), f = e.object({
  artist_id: e.string(),
  followed_at: e.string().optional(),
  user_id: e.string()
}), k = e.object({
  artist_id: e.string().optional(),
  followed_at: e.string().optional(),
  user_id: e.string().optional()
}), j = e.tuple([
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
]), R = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), A = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), T = e.object({
  artist_id: e.string().optional(),
  genre_id: e.string().optional()
}), P = e.tuple([
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
]), G = e.object({
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
}), O = e.object({
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
}), C = e.object({
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
}), w = e.tuple([
  e.object({
    foreignKeyName: e.literal("artists_id_fkey"),
    columns: e.tuple([e.literal("id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), U = e.object({
  color: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  image_url: e.string().nullable(),
  name: e.string(),
  popularity: e.number().nullable(),
  slug: e.string().nullable(),
  updated_at: e.string()
}), K = e.object({
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
}), v = e.object({
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
}), I = e.object({
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
}), B = e.tuple([
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
]), F = e.object({
  client_ip: e.string().nullable(),
  completed: e.boolean().nullable(),
  id: e.string(),
  play_duration: e.number().nullable(),
  played_at: e.string(),
  source: e.string().nullable(),
  track_id: e.string(),
  user_agent: e.string().nullable(),
  user_id: e.string()
}), x = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string()
}), q = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string().optional(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string().optional()
}), E = e.tuple([
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
]), V = e.object({
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
}), D = e.tuple(
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
), W = e.object({
  liked_at: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), J = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string(),
  user_id: e.string()
}), M = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), Q = e.tuple([
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
]), X = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), Y = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), Z = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  position: e.number().optional(),
  track_id: e.string().optional()
}), $ = e.tuple([
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
]), ee = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), te = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string(),
  updated_at: e.string().optional(),
  user_id: e.string()
}), re = e.object({
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
]), ne = e.object({
  id: e.string(),
  query: e.string(),
  searched_at: e.string(),
  user_id: e.string()
}), le = e.object({
  id: e.string().optional(),
  query: e.string(),
  searched_at: e.string().optional(),
  user_id: e.string()
}), ie = e.object({
  id: e.string().optional(),
  query: e.string().optional(),
  searched_at: e.string().optional(),
  user_id: e.string().optional()
}), oe = e.tuple([
  e.object({
    foreignKeyName: e.literal("search_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), se = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), ce = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), de = e.object({
  genre_id: e.string().optional(),
  track_id: e.string().optional()
}), ge = e.tuple([
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
]), ue = e.object({
  liked_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), pe = e.object({
  liked_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), me = e.object({
  liked_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), _e = e.tuple([
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
]), be = e.object({
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
}), ye = e.object({
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
}), he = e.object({
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
}), Se = e.tuple([
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
]), fe = e.object({
  added_at: e.string(),
  album_id: e.string(),
  user_id: e.string()
}), ke = e.object({
  added_at: e.string().optional(),
  album_id: e.string(),
  user_id: e.string()
}), je = e.object({
  added_at: e.string().optional(),
  album_id: e.string().optional(),
  user_id: e.string().optional()
}), Re = e.tuple([
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
]), Ae = e.object({
  added_at: e.string(),
  artist_id: e.string(),
  user_id: e.string()
}), Te = e.object({
  added_at: e.string().optional(),
  artist_id: e.string(),
  user_id: e.string()
}), Pe = e.object({
  added_at: e.string().optional(),
  artist_id: e.string().optional(),
  user_id: e.string().optional()
}), Ge = e.tuple([
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
]), Oe = e.object({
  added_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), Ce = e.object({
  added_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), we = e.object({
  added_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), Ue = e.tuple([
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
]), Ke = e.object({
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
}), ve = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), Ie = e.tuple([
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
  user_id: e.string(),
  volume_level: e.number().optional().nullable()
}), Fe = e.object({
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
}), xe = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_settings_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), qe = e.object({
  created_at: e.string(),
  display_name: e.string().nullable(),
  email: e.string(),
  email_verified: e.boolean().nullable(),
  id: e.string(),
  profile_url: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), Ee = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string(),
  wallet_address: e.string().optional().nullable()
}), Ve = e.object({
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
]), De = e.object({
  artist_id: e.string().nullable(),
  play_count: e.number().nullable()
}), We = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Je = e.object({
  play_count: e.number().nullable(),
  track_id: e.string().nullable()
}), Me = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Qe = e.object({
  play_count: e.number().nullable(),
  user_id: e.string().nullable()
}), Xe = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ye = e.object({
  album_id: e.string()
}), Ze = e.boolean(), $e = e.object({
  artist_id: e.string()
}), et = e.boolean(), tt = e.object({
  track_id: e.string()
}), rt = e.boolean(), at = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), nt = e.undefined(), lt = e.object({
  "": e.string()
}), it = e.string(), ot = e.object({
  _email_or_username: e.string(),
  _password: e.string()
}), st = e.string(), ct = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), dt = e.string(), gt = e.object({
  _user_id: e.string()
}), ut = e.string(), pt = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), mt = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), _t = e.object({
  title: e.string(),
  artist_id: e.string(),
  duration: e.number(),
  audio_url: e.string(),
  album_id: e.string().optional(),
  cover_url: e.string().optional(),
  track_number: e.number().optional(),
  lyrics: e.string().optional(),
  genre: e.array(e.string()).optional(),
  explicit: e.boolean().optional(),
  release_date: e.string().optional(),
  isrc: e.string().optional()
}), bt = e.object({
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
}), yt = e.object({
  "": e.string()
}), ht = e.string(), St = e.object({}), ft = t, kt = e.object({
  token: e.string()
}), jt = t, Rt = e.object({
  "": e.number()
}), At = e.string(), Tt = e.object({}), Pt = e.string(), Gt = e.object({
  "": e.string()
}), Ot = e.string(), Ct = e.object({
  wallet_address: e.string()
}), wt = e.string(), Ut = e.object({
  album_id: e.string()
}), Kt = e.number(), Nt = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), vt = e.array(
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
), It = e.object({
  artist_id: e.string()
}), Lt = e.number(), Bt = e.object({
  artist_id: e.string()
}), Ft = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    month_year: e.string()
  })
), xt = e.object({
  artist_id: e.string()
}), qt = e.number(), Et = e.object({
  artist_id: e.string()
}), Vt = e.number(), Ht = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), zt = e.array(
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
), Dt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Wt = e.array(
  e.object({
    payment_type: e.string(),
    amount: e.number()
  })
), Jt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Mt = e.array(
  e.object({
    period: e.string(),
    amount: e.number()
  })
), Qt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Xt = e.number(), Yt = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), Zt = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), $t = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), er = e.number(), tr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), rr = e.array(
  e.object({
    avg_duration: e.number(),
    completed_count: e.number(),
    total_count: e.number()
  })
), ar = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), nr = e.array(
  e.object({
    country_code: e.string(),
    play_count: e.number()
  })
), lr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string(),
  time_format: e.string()
}), ir = e.array(
  e.object({
    period: e.string(),
    count: e.number()
  })
), or = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), sr = e.array(
  e.object({
    source: e.string(),
    count: e.number()
  })
), cr = e.object({
  artist_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), dr = e.number(), gr = e.object({
  p_start_date: e.string(),
  p_end_date: e.string(),
  p_limit: e.number().optional()
}), ur = e.array(
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
), pr = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), mr = e.array(
  e.object({
    added_at: e.string(),
    user_id: e.string(),
    username: e.string()
  })
), _r = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), br = e.array(
  e.object({
    played_at: e.string(),
    track_id: e.string(),
    track_title: e.string(),
    username: e.string()
  })
), yr = e.object({
  artist_id: e.string(),
  start_date: e.string().optional(),
  limit_count: e.number().optional()
}), hr = e.array(
  e.object({
    created_at: e.string(),
    amount: e.number(),
    username: e.string()
  })
), Sr = e.object({
  artist_id: e.string(),
  limit_count: e.number().optional()
}), fr = e.array(
  e.object({
    id: e.string(),
    created_at: e.string(),
    amount: e.number(),
    payment_type: e.string(),
    sender_id: e.string(),
    username: e.string()
  })
), kr = e.object({
  limit_count: e.number().optional()
}), jr = e.array(
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
), Rr = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional()
}), Ar = e.array(
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
), Tr = e.object({
  track_id: e.string()
}), Pr = e.number(), Gr = e.object({
  track_id: e.string(),
  start_date: e.string(),
  end_date: e.string()
}), Or = e.number(), Cr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), wr = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Ur = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Kr = e.number(), Nr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), vr = e.array(
  e.object({
    track_id: e.string(),
    count: e.number()
  })
), Ir = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string(),
  end_date: e.string()
}), Lr = e.number(), Br = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), Fr = e.array(
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
), xr = e.object({
  track_ids: e.array(e.string()),
  start_date: e.string().optional(),
  end_date: e.string().optional()
}), qr = e.number(), Er = e.object({
  "": e.string()
}), Vr = e.array(
  e.record(e.unknown())
), Hr = e.object({
  "": e.string()
}), zr = e.string(), Dr = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), Wr = e.undefined(), Jr = e.object({
  query: e.string()
}), Mr = e.undefined(), Qr = e.object({
  current_token: e.string()
}), Xr = e.string(), Yr = e.object({
  current_token: e.string()
}), Zr = e.string(), $r = e.object({
  current_token: e.string()
}), ea = e.string(), ta = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), ra = e.object({
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
}), aa = e.object({
  user_id: e.string(),
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), na = e.object({
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
}), la = e.object({
  _username: e.string(),
  _email: e.string(),
  _password: e.string(),
  _display_name: e.string().optional(),
  _wallet_address: e.string().optional()
}), ia = t, oa = e.object({
  _email: e.string()
}), sa = e.string(), ca = e.object({
  _reset_token: e.string(),
  _new_password: e.string()
}), da = e.boolean(), ga = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), ua = e.object({
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
  token: e.string()
}), ma = t, _a = e.object({
  user_id: e.string(),
  artist_name: e.string().optional(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: t.optional()
}), ba = e.object({
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
}), ya = e.object({
  _verification_token: e.string()
}), ha = e.boolean(), Sa = e.object({
  wallet_address: e.string(),
  signature: e.string()
}), fa = e.string(), ka = {
  prettygood: {
    Enums: {}
  }
};
function ja(r, a) {
  return new n(r, {
    headers: a
  });
}
export {
  ka as Constants,
  ja as createClient,
  t as jsonSchema,
  Ye as prettygoodAddAlbumToLibraryArgsSchemaSchema,
  Ze as prettygoodAddAlbumToLibraryReturnsSchemaSchema,
  $e as prettygoodAddArtistToLibraryArgsSchemaSchema,
  et as prettygoodAddArtistToLibraryReturnsSchemaSchema,
  tt as prettygoodAddTrackToLibraryArgsSchemaSchema,
  rt as prettygoodAddTrackToLibraryReturnsSchemaSchema,
  at as prettygoodAddTrackToPlaylistArgsSchemaSchema,
  nt as prettygoodAddTrackToPlaylistReturnsSchemaSchema,
  s as prettygoodAlbumGenresInsertSchemaSchema,
  d as prettygoodAlbumGenresRelationshipsSchemaSchema,
  o as prettygoodAlbumGenresRowSchemaSchema,
  c as prettygoodAlbumGenresUpdateSchemaSchema,
  u as prettygoodAlbumLikesInsertSchemaSchema,
  m as prettygoodAlbumLikesRelationshipsSchemaSchema,
  g as prettygoodAlbumLikesRowSchemaSchema,
  p as prettygoodAlbumLikesUpdateSchemaSchema,
  ze as prettygoodAlbumPlayCountsRelationshipsSchemaSchema,
  He as prettygoodAlbumPlayCountsRowSchemaSchema,
  b as prettygoodAlbumsInsertSchemaSchema,
  h as prettygoodAlbumsRelationshipsSchemaSchema,
  _ as prettygoodAlbumsRowSchemaSchema,
  y as prettygoodAlbumsUpdateSchemaSchema,
  lt as prettygoodArmorArgsSchemaSchema,
  it as prettygoodArmorReturnsSchemaSchema,
  f as prettygoodArtistFollowersInsertSchemaSchema,
  j as prettygoodArtistFollowersRelationshipsSchemaSchema,
  S as prettygoodArtistFollowersRowSchemaSchema,
  k as prettygoodArtistFollowersUpdateSchemaSchema,
  A as prettygoodArtistGenresInsertSchemaSchema,
  P as prettygoodArtistGenresRelationshipsSchemaSchema,
  R as prettygoodArtistGenresRowSchemaSchema,
  T as prettygoodArtistGenresUpdateSchemaSchema,
  We as prettygoodArtistPlayCountsRelationshipsSchemaSchema,
  De as prettygoodArtistPlayCountsRowSchemaSchema,
  O as prettygoodArtistsInsertSchemaSchema,
  w as prettygoodArtistsRelationshipsSchemaSchema,
  G as prettygoodArtistsRowSchemaSchema,
  C as prettygoodArtistsUpdateSchemaSchema,
  ot as prettygoodAuthenticateUserArgsSchemaSchema,
  st as prettygoodAuthenticateUserReturnsSchemaSchema,
  ct as prettygoodAuthenticateWalletArgsSchemaSchema,
  dt as prettygoodAuthenticateWalletReturnsSchemaSchema,
  gt as prettygoodCreateEmailVerificationTokenArgsSchemaSchema,
  ut as prettygoodCreateEmailVerificationTokenReturnsSchemaSchema,
  pt as prettygoodCreatePlaylistArgsSchemaSchema,
  mt as prettygoodCreatePlaylistReturnsSchemaSchema,
  _t as prettygoodCreateTrackArgsSchemaSchema,
  bt as prettygoodCreateTrackReturnsSchemaSchema,
  yt as prettygoodDearmorArgsSchemaSchema,
  ht as prettygoodDearmorReturnsSchemaSchema,
  St as prettygoodDebugGetJwtInfoArgsSchemaSchema,
  ft as prettygoodDebugGetJwtInfoReturnsSchemaSchema,
  kt as prettygoodDebugVerifyTokenArgsSchemaSchema,
  jt as prettygoodDebugVerifyTokenReturnsSchemaSchema,
  Rt as prettygoodGenRandomBytesArgsSchemaSchema,
  At as prettygoodGenRandomBytesReturnsSchemaSchema,
  Tt as prettygoodGenRandomUuidArgsSchemaSchema,
  Pt as prettygoodGenRandomUuidReturnsSchemaSchema,
  Gt as prettygoodGenSaltArgsSchemaSchema,
  Ot as prettygoodGenSaltReturnsSchemaSchema,
  Ct as prettygoodGenerateNonceArgsSchemaSchema,
  wt as prettygoodGenerateNonceReturnsSchemaSchema,
  K as prettygoodGenresInsertSchemaSchema,
  U as prettygoodGenresRowSchemaSchema,
  N as prettygoodGenresUpdateSchemaSchema,
  Ut as prettygoodGetAlbumPlayCountArgsSchemaSchema,
  Kt as prettygoodGetAlbumPlayCountReturnsSchemaSchema,
  Nt as prettygoodGetAlbumsByGenreArgsSchemaSchema,
  vt as prettygoodGetAlbumsByGenreReturnsSchemaSchema,
  It as prettygoodGetArtistFollowersCountArgsSchemaSchema,
  Lt as prettygoodGetArtistFollowersCountReturnsSchemaSchema,
  Bt as prettygoodGetArtistPaymentStatsArgsSchemaSchema,
  Ft as prettygoodGetArtistPaymentStatsReturnsSchemaSchema,
  xt as prettygoodGetArtistPlayCountArgsSchemaSchema,
  qt as prettygoodGetArtistPlayCountReturnsSchemaSchema,
  Et as prettygoodGetArtistTotalEarningsArgsSchemaSchema,
  Vt as prettygoodGetArtistTotalEarningsReturnsSchemaSchema,
  Ht as prettygoodGetArtistsByGenreArgsSchemaSchema,
  zt as prettygoodGetArtistsByGenreReturnsSchemaSchema,
  Dt as prettygoodGetEarningsByPaymentTypeArgsSchemaSchema,
  Wt as prettygoodGetEarningsByPaymentTypeReturnsSchemaSchema,
  Jt as prettygoodGetEarningsByPeriodArgsSchemaSchema,
  Mt as prettygoodGetEarningsByPeriodReturnsSchemaSchema,
  Qt as prettygoodGetEarningsForPeriodArgsSchemaSchema,
  Xt as prettygoodGetEarningsForPeriodReturnsSchemaSchema,
  Yt as prettygoodGetFollowersByPeriodArgsSchemaSchema,
  Zt as prettygoodGetFollowersByPeriodReturnsSchemaSchema,
  $t as prettygoodGetFollowersCountForPeriodArgsSchemaSchema,
  er as prettygoodGetFollowersCountForPeriodReturnsSchemaSchema,
  tr as prettygoodGetPlayDurationStatsArgsSchemaSchema,
  rr as prettygoodGetPlayDurationStatsReturnsSchemaSchema,
  ar as prettygoodGetPlaysByCountryArgsSchemaSchema,
  nr as prettygoodGetPlaysByCountryReturnsSchemaSchema,
  lr as prettygoodGetPlaysByPeriodArgsSchemaSchema,
  ir as prettygoodGetPlaysByPeriodReturnsSchemaSchema,
  or as prettygoodGetPlaysBySourceArgsSchemaSchema,
  sr as prettygoodGetPlaysBySourceReturnsSchemaSchema,
  cr as prettygoodGetPlaysForPeriodArgsSchemaSchema,
  dr as prettygoodGetPlaysForPeriodReturnsSchemaSchema,
  gr as prettygoodGetPopularGenresArgsSchemaSchema,
  ur as prettygoodGetPopularGenresReturnsSchemaSchema,
  pr as prettygoodGetRecentFollowersArgsSchemaSchema,
  mr as prettygoodGetRecentFollowersReturnsSchemaSchema,
  _r as prettygoodGetRecentPlaysArgsSchemaSchema,
  br as prettygoodGetRecentPlaysReturnsSchemaSchema,
  yr as prettygoodGetRecentTipsArgsSchemaSchema,
  hr as prettygoodGetRecentTipsReturnsSchemaSchema,
  Sr as prettygoodGetRecentTransactionsArgsSchemaSchema,
  fr as prettygoodGetRecentTransactionsReturnsSchemaSchema,
  kr as prettygoodGetRecommendationsArgsSchemaSchema,
  jr as prettygoodGetRecommendationsReturnsSchemaSchema,
  Rr as prettygoodGetRelatedGenresArgsSchemaSchema,
  Ar as prettygoodGetRelatedGenresReturnsSchemaSchema,
  Tr as prettygoodGetTrackPlayCountArgsSchemaSchema,
  Gr as prettygoodGetTrackPlayCountByPeriodArgsSchemaSchema,
  Or as prettygoodGetTrackPlayCountByPeriodReturnsSchemaSchema,
  Pr as prettygoodGetTrackPlayCountReturnsSchemaSchema,
  Cr as prettygoodGetTrackPlayCountsArgsSchemaSchema,
  wr as prettygoodGetTrackPlayCountsReturnsSchemaSchema,
  Ur as prettygoodGetTrackPlaylistsCountArgsSchemaSchema,
  Kr as prettygoodGetTrackPlaylistsCountReturnsSchemaSchema,
  Nr as prettygoodGetTrackPlaysForPeriodArgsSchemaSchema,
  vr as prettygoodGetTrackPlaysForPeriodReturnsSchemaSchema,
  Ir as prettygoodGetTrackSavesCountArgsSchemaSchema,
  Lr as prettygoodGetTrackSavesCountReturnsSchemaSchema,
  Br as prettygoodGetTracksByGenreArgsSchemaSchema,
  Fr as prettygoodGetTracksByGenreReturnsSchemaSchema,
  xr as prettygoodGetTracksPlayCountArgsSchemaSchema,
  qr as prettygoodGetTracksPlayCountReturnsSchemaSchema,
  I as prettygoodPaymentsInsertSchemaSchema,
  B as prettygoodPaymentsRelationshipsSchemaSchema,
  v as prettygoodPaymentsRowSchemaSchema,
  L as prettygoodPaymentsUpdateSchemaSchema,
  Er as prettygoodPgpArmorHeadersArgsSchemaSchema,
  Vr as prettygoodPgpArmorHeadersReturnsSchemaSchema,
  Hr as prettygoodPgpKeyIdArgsSchemaSchema,
  zr as prettygoodPgpKeyIdReturnsSchemaSchema,
  x as prettygoodPlayHistoryInsertSchemaSchema,
  E as prettygoodPlayHistoryRelationshipsSchemaSchema,
  F as prettygoodPlayHistoryRowSchemaSchema,
  q as prettygoodPlayHistoryUpdateSchemaSchema,
  H as prettygoodPlaylistCollaboratorsInsertSchemaSchema,
  D as prettygoodPlaylistCollaboratorsRelationshipsSchemaSchema,
  V as prettygoodPlaylistCollaboratorsRowSchemaSchema,
  z as prettygoodPlaylistCollaboratorsUpdateSchemaSchema,
  J as prettygoodPlaylistLikesInsertSchemaSchema,
  Q as prettygoodPlaylistLikesRelationshipsSchemaSchema,
  W as prettygoodPlaylistLikesRowSchemaSchema,
  M as prettygoodPlaylistLikesUpdateSchemaSchema,
  Y as prettygoodPlaylistTracksInsertSchemaSchema,
  $ as prettygoodPlaylistTracksRelationshipsSchemaSchema,
  X as prettygoodPlaylistTracksRowSchemaSchema,
  Z as prettygoodPlaylistTracksUpdateSchemaSchema,
  te as prettygoodPlaylistsInsertSchemaSchema,
  ae as prettygoodPlaylistsRelationshipsSchemaSchema,
  ee as prettygoodPlaylistsRowSchemaSchema,
  re as prettygoodPlaylistsUpdateSchemaSchema,
  Dr as prettygoodRecordPlayArgsSchemaSchema,
  Wr as prettygoodRecordPlayReturnsSchemaSchema,
  Jr as prettygoodRecordSearchArgsSchemaSchema,
  Mr as prettygoodRecordSearchReturnsSchemaSchema,
  Qr as prettygoodRefreshTokenArgsSchemaSchema,
  Xr as prettygoodRefreshTokenReturnsSchemaSchema,
  Yr as prettygoodRefreshTokenRobustArgsSchemaSchema,
  Zr as prettygoodRefreshTokenRobustReturnsSchemaSchema,
  $r as prettygoodRefreshTokenV2ArgsSchemaSchema,
  ea as prettygoodRefreshTokenV2ReturnsSchemaSchema,
  ta as prettygoodRegisterAsArtistArgsSchemaSchema,
  ra as prettygoodRegisterAsArtistReturnsSchemaSchema,
  aa as prettygoodRegisterAsArtistWithIdArgsSchemaSchema,
  na as prettygoodRegisterAsArtistWithIdReturnsSchemaSchema,
  la as prettygoodRegisterUserArgsSchemaSchema,
  ia as prettygoodRegisterUserReturnsSchemaSchema,
  oa as prettygoodRequestPasswordResetArgsSchemaSchema,
  sa as prettygoodRequestPasswordResetReturnsSchemaSchema,
  ca as prettygoodResetPasswordArgsSchemaSchema,
  da as prettygoodResetPasswordReturnsSchemaSchema,
  le as prettygoodSearchHistoryInsertSchemaSchema,
  oe as prettygoodSearchHistoryRelationshipsSchemaSchema,
  ne as prettygoodSearchHistoryRowSchemaSchema,
  ie as prettygoodSearchHistoryUpdateSchemaSchema,
  ga as prettygoodTipArtistArgsSchemaSchema,
  ua as prettygoodTipArtistReturnsSchemaSchema,
  pa as prettygoodTraceTokenVerificationArgsSchemaSchema,
  ma as prettygoodTraceTokenVerificationReturnsSchemaSchema,
  ce as prettygoodTrackGenresInsertSchemaSchema,
  ge as prettygoodTrackGenresRelationshipsSchemaSchema,
  se as prettygoodTrackGenresRowSchemaSchema,
  de as prettygoodTrackGenresUpdateSchemaSchema,
  pe as prettygoodTrackLikesInsertSchemaSchema,
  _e as prettygoodTrackLikesRelationshipsSchemaSchema,
  ue as prettygoodTrackLikesRowSchemaSchema,
  me as prettygoodTrackLikesUpdateSchemaSchema,
  Me as prettygoodTrackPlayCountsRelationshipsSchemaSchema,
  Je as prettygoodTrackPlayCountsRowSchemaSchema,
  ye as prettygoodTracksInsertSchemaSchema,
  Se as prettygoodTracksRelationshipsSchemaSchema,
  be as prettygoodTracksRowSchemaSchema,
  he as prettygoodTracksUpdateSchemaSchema,
  _a as prettygoodUpdateArtistWithIdArgsSchemaSchema,
  ba as prettygoodUpdateArtistWithIdReturnsSchemaSchema,
  ke as prettygoodUserLibraryAlbumsInsertSchemaSchema,
  Re as prettygoodUserLibraryAlbumsRelationshipsSchemaSchema,
  fe as prettygoodUserLibraryAlbumsRowSchemaSchema,
  je as prettygoodUserLibraryAlbumsUpdateSchemaSchema,
  Te as prettygoodUserLibraryArtistsInsertSchemaSchema,
  Ge as prettygoodUserLibraryArtistsRelationshipsSchemaSchema,
  Ae as prettygoodUserLibraryArtistsRowSchemaSchema,
  Pe as prettygoodUserLibraryArtistsUpdateSchemaSchema,
  Ce as prettygoodUserLibraryTracksInsertSchemaSchema,
  Ue as prettygoodUserLibraryTracksRelationshipsSchemaSchema,
  Oe as prettygoodUserLibraryTracksRowSchemaSchema,
  we as prettygoodUserLibraryTracksUpdateSchemaSchema,
  Xe as prettygoodUserPlayCountsRelationshipsSchemaSchema,
  Qe as prettygoodUserPlayCountsRowSchemaSchema,
  Ne as prettygoodUserRecentlyPlayedInsertSchemaSchema,
  Ie as prettygoodUserRecentlyPlayedRelationshipsSchemaSchema,
  Ke as prettygoodUserRecentlyPlayedRowSchemaSchema,
  ve as prettygoodUserRecentlyPlayedUpdateSchemaSchema,
  Be as prettygoodUserSettingsInsertSchemaSchema,
  xe as prettygoodUserSettingsRelationshipsSchemaSchema,
  Le as prettygoodUserSettingsRowSchemaSchema,
  Fe as prettygoodUserSettingsUpdateSchemaSchema,
  Ee as prettygoodUsersInsertSchemaSchema,
  qe as prettygoodUsersRowSchemaSchema,
  Ve as prettygoodUsersUpdateSchemaSchema,
  ya as prettygoodVerifyEmailArgsSchemaSchema,
  ha as prettygoodVerifyEmailReturnsSchemaSchema,
  Sa as prettygoodVerifySignatureArgsSchemaSchema,
  fa as prettygoodVerifySignatureReturnsSchemaSchema
};
