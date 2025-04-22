import { PostgrestClient as i } from "@supabase/postgrest-js";
import { createClient as n } from "@supabase/supabase-js";
export * from "@supabase/supabase-js";
import { z as e } from "zod";
const l = e.lazy(
  () => e.union([
    e.string(),
    e.number(),
    e.boolean(),
    e.record(e.union([l, e.undefined()])),
    e.array(l)
  ]).nullable()
), c = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), u = e.object({
  album_id: e.string(),
  genre_id: e.string()
}), p = e.object({
  album_id: e.string().optional(),
  genre_id: e.string().optional()
}), b = e.tuple([
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
}), _ = e.object({
  album_id: e.string(),
  liked_at: e.string().optional(),
  user_id: e.string()
}), g = e.object({
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
]), y = e.object({
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
}), h = e.object({
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
}), f = e.object({
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
}), S = e.tuple([
  e.object({
    foreignKeyName: e.literal("albums_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), k = e.object({
  artist_id: e.string(),
  followed_at: e.string(),
  user_id: e.string()
}), j = e.object({
  artist_id: e.string(),
  followed_at: e.string().optional(),
  user_id: e.string()
}), R = e.object({
  artist_id: e.string().optional(),
  followed_at: e.string().optional(),
  user_id: e.string().optional()
}), O = e.tuple([
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
]), T = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), A = e.object({
  artist_id: e.string(),
  genre_id: e.string()
}), C = e.object({
  artist_id: e.string().optional(),
  genre_id: e.string().optional()
}), w = e.tuple([
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
]), K = e.object({
  application_date: e.string().nullable(),
  application_notes: e.string().nullable(),
  approved: e.boolean().nullable(),
  artist_name: e.string(),
  bio: e.string().nullable(),
  created_at: e.string(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  location: e.string().nullable(),
  social_links: l.nullable(),
  updated_at: e.string(),
  verified: e.boolean().nullable(),
  website: e.string().nullable()
}), N = e.object({
  application_date: e.string().optional().nullable(),
  application_notes: e.string().optional().nullable(),
  approved: e.boolean().optional().nullable(),
  artist_name: e.string(),
  bio: e.string().optional().nullable(),
  created_at: e.string().optional(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string(),
  location: e.string().optional().nullable(),
  social_links: l.optional().nullable(),
  updated_at: e.string().optional(),
  verified: e.boolean().optional().nullable(),
  website: e.string().optional().nullable()
}), P = e.object({
  application_date: e.string().optional().nullable(),
  application_notes: e.string().optional().nullable(),
  approved: e.boolean().optional().nullable(),
  artist_name: e.string().optional(),
  bio: e.string().optional().nullable(),
  created_at: e.string().optional(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  location: e.string().optional().nullable(),
  social_links: l.optional().nullable(),
  updated_at: e.string().optional(),
  verified: e.boolean().optional().nullable(),
  website: e.string().optional().nullable()
}), G = e.tuple([
  e.object({
    foreignKeyName: e.literal("artists_id_fkey"),
    columns: e.tuple([e.literal("id")]),
    isOneToOne: e.literal(!0),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), v = e.object({
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
}), L = e.object({
  color: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  image_url: e.string().optional().nullable(),
  name: e.string().optional(),
  popularity: e.number().optional().nullable(),
  slug: e.string().optional().nullable(),
  updated_at: e.string().optional()
}), x = e.object({
  changed_at: e.string(),
  changed_by: e.string(),
  id: e.string(),
  new_status: e.string(),
  notes: e.string().nullable(),
  old_status: e.string().nullable(),
  payment_id: e.string()
}), I = e.object({
  changed_at: e.string().optional(),
  changed_by: e.string().optional(),
  id: e.string().optional(),
  new_status: e.string(),
  notes: e.string().optional().nullable(),
  old_status: e.string().optional().nullable(),
  payment_id: e.string()
}), q = e.object({
  changed_at: e.string().optional(),
  changed_by: e.string().optional(),
  id: e.string().optional(),
  new_status: e.string().optional(),
  notes: e.string().optional().nullable(),
  old_status: e.string().optional().nullable(),
  payment_id: e.string().optional()
}), z = e.tuple([
  e.object({
    foreignKeyName: e.literal("payment_status_history_payment_id_fkey"),
    columns: e.tuple([e.literal("payment_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("payments"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), H = e.object({
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
}), B = e.object({
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
}), F = e.object({
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
}), D = e.tuple([
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
  }),
  e.object({
    foreignKeyName: e.literal("payments_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), M = e.object({
  client_ip: e.string().nullable(),
  completed: e.boolean().nullable(),
  context_id: e.string().nullable(),
  id: e.string(),
  play_duration: e.number().nullable(),
  played_at: e.string(),
  source: e.string().nullable(),
  track_id: e.string(),
  user_agent: e.string().nullable(),
  user_id: e.string().nullable()
}), W = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  context_id: e.string().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string().optional().nullable()
}), E = e.object({
  client_ip: e.string().optional().nullable(),
  completed: e.boolean().optional().nullable(),
  context_id: e.string().optional().nullable(),
  id: e.string().optional(),
  play_duration: e.number().optional().nullable(),
  played_at: e.string().optional(),
  source: e.string().optional().nullable(),
  track_id: e.string().optional(),
  user_agent: e.string().optional().nullable(),
  user_id: e.string().optional().nullable()
}), V = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("play_history_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), $ = e.object({
  liked_at: e.string(),
  playlist_id: e.string(),
  user_id: e.string()
}), J = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string(),
  user_id: e.string()
}), Q = e.object({
  liked_at: e.string().optional(),
  playlist_id: e.string().optional(),
  user_id: e.string().optional()
}), X = e.tuple([
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
]), Y = e.object({
  added_at: e.string(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), Z = e.object({
  added_at: e.string().optional(),
  added_by: e.string(),
  playlist_id: e.string(),
  position: e.number(),
  track_id: e.string()
}), ee = e.object({
  added_at: e.string().optional(),
  added_by: e.string().optional(),
  playlist_id: e.string().optional(),
  position: e.number().optional(),
  track_id: e.string().optional()
}), le = e.tuple([
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
  }),
  e.object({
    foreignKeyName: e.literal("playlist_tracks_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), te = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), ae = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string(),
  updated_at: e.string().optional(),
  user_id: e.string()
}), ie = e.object({
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  description: e.string().optional().nullable(),
  id: e.string().optional(),
  is_public: e.boolean().optional().nullable(),
  name: e.string().optional(),
  updated_at: e.string().optional(),
  user_id: e.string().optional()
}), ne = e.tuple([
  e.object({
    foreignKeyName: e.literal("playlists_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), re = e.object({
  genre_id: e.string(),
  related_genre_id: e.string(),
  weight: e.number().nullable()
}), se = e.object({
  genre_id: e.string(),
  related_genre_id: e.string(),
  weight: e.number().optional().nullable()
}), oe = e.object({
  genre_id: e.string().optional(),
  related_genre_id: e.string().optional(),
  weight: e.number().optional().nullable()
}), ce = e.tuple([
  e.object({
    foreignKeyName: e.literal("related_genres_genre_id_fkey"),
    columns: e.tuple([e.literal("genre_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("genres"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("related_genres_related_genre_id_fkey"),
    columns: e.tuple([e.literal("related_genre_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("genres"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), ue = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), pe = e.object({
  genre_id: e.string(),
  track_id: e.string()
}), be = e.object({
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
  }),
  e.object({
    foreignKeyName: e.literal("track_genres_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), _e = e.object({
  liked_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), ge = e.object({
  liked_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), me = e.object({
  liked_at: e.string().optional(),
  track_id: e.string().optional(),
  user_id: e.string().optional()
}), ye = e.tuple([
  e.object({
    foreignKeyName: e.literal("track_likes_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("track_likes_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("track_likes_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), he = e.object({
  album_id: e.string().nullable(),
  artist_id: e.string(),
  audio_url: e.string(),
  cover_url: e.string().nullable(),
  created_at: e.string(),
  duration: e.number(),
  explicit: e.boolean().nullable(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  isrc: e.string().nullable(),
  lyrics: e.string().nullable(),
  release_date: e.string().nullable(),
  title: e.string(),
  track_number: e.number().nullable(),
  updated_at: e.string()
}), fe = e.object({
  album_id: e.string().optional().nullable(),
  artist_id: e.string(),
  audio_url: e.string(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  duration: e.number(),
  explicit: e.boolean().optional().nullable(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  isrc: e.string().optional().nullable(),
  lyrics: e.string().optional().nullable(),
  release_date: e.string().optional().nullable(),
  title: e.string(),
  track_number: e.number().optional().nullable(),
  updated_at: e.string().optional()
}), Se = e.object({
  album_id: e.string().optional().nullable(),
  artist_id: e.string().optional(),
  audio_url: e.string().optional(),
  cover_url: e.string().optional().nullable(),
  created_at: e.string().optional(),
  duration: e.number().optional(),
  explicit: e.boolean().optional().nullable(),
  genre: e.array(e.string()).optional().nullable(),
  id: e.string().optional(),
  isrc: e.string().optional().nullable(),
  lyrics: e.string().optional().nullable(),
  release_date: e.string().optional().nullable(),
  title: e.string().optional(),
  track_number: e.number().optional().nullable(),
  updated_at: e.string().optional()
}), ke = e.tuple([
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
]), je = e.object({
  added_at: e.string(),
  album_id: e.string(),
  user_id: e.string()
}), Re = e.object({
  added_at: e.string().optional(),
  album_id: e.string(),
  user_id: e.string()
}), Oe = e.object({
  added_at: e.string().optional(),
  album_id: e.string().optional(),
  user_id: e.string().optional()
}), Te = e.tuple([
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
}), Ke = e.tuple([
  e.object({
    foreignKeyName: e.literal("user_library_tracks_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_library_tracks_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_library_tracks_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ne = e.object({
  context_id: e.string().nullable(),
  context_type: e.string().nullable(),
  id: e.string(),
  played_at: e.string(),
  track_id: e.string(),
  user_id: e.string()
}), Pe = e.object({
  context_id: e.string().optional().nullable(),
  context_type: e.string().optional().nullable(),
  id: e.string().optional(),
  played_at: e.string().optional(),
  track_id: e.string(),
  user_id: e.string()
}), Ge = e.object({
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
    foreignKeyName: e.literal("user_recently_played_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("user_recently_played_user_id_fkey"),
    columns: e.tuple([e.literal("user_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("users"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ue = e.object({
  audio_quality: e.string().nullable(),
  auto_add_to_library: e.boolean().nullable(),
  crossfade_duration: e.number().nullable(),
  enable_autoplay: e.boolean().nullable(),
  enable_crossfade: e.boolean().nullable(),
  enable_equalizer: e.boolean().nullable(),
  enable_explicit_content: e.boolean().nullable(),
  enable_gapless_playback: e.boolean().nullable(),
  enable_notifications: e.boolean().nullable(),
  equalizer_settings: l.nullable(),
  notification_settings: l.nullable(),
  preferred_language: e.string().nullable(),
  privacy_level: e.string().nullable(),
  theme: e.string().nullable(),
  updated_at: e.string(),
  user_id: e.string(),
  volume_level: e.number().nullable()
}), Le = e.object({
  audio_quality: e.string().optional().nullable(),
  auto_add_to_library: e.boolean().optional().nullable(),
  crossfade_duration: e.number().optional().nullable(),
  enable_autoplay: e.boolean().optional().nullable(),
  enable_crossfade: e.boolean().optional().nullable(),
  enable_equalizer: e.boolean().optional().nullable(),
  enable_explicit_content: e.boolean().optional().nullable(),
  enable_gapless_playback: e.boolean().optional().nullable(),
  enable_notifications: e.boolean().optional().nullable(),
  equalizer_settings: l.optional().nullable(),
  notification_settings: l.optional().nullable(),
  preferred_language: e.string().optional().nullable(),
  privacy_level: e.string().optional().nullable(),
  theme: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  user_id: e.string(),
  volume_level: e.number().optional().nullable()
}), xe = e.object({
  audio_quality: e.string().optional().nullable(),
  auto_add_to_library: e.boolean().optional().nullable(),
  crossfade_duration: e.number().optional().nullable(),
  enable_autoplay: e.boolean().optional().nullable(),
  enable_crossfade: e.boolean().optional().nullable(),
  enable_equalizer: e.boolean().optional().nullable(),
  enable_explicit_content: e.boolean().optional().nullable(),
  enable_gapless_playback: e.boolean().optional().nullable(),
  enable_notifications: e.boolean().optional().nullable(),
  equalizer_settings: l.optional().nullable(),
  notification_settings: l.optional().nullable(),
  preferred_language: e.string().optional().nullable(),
  privacy_level: e.string().optional().nullable(),
  theme: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  user_id: e.string().optional(),
  volume_level: e.number().optional().nullable()
}), Ie = e.tuple([
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
  role: e.string().nullable(),
  updated_at: e.string(),
  username: e.string(),
  wallet_address: e.string().nullable()
}), ze = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string(),
  profile_url: e.string().optional().nullable(),
  role: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string(),
  wallet_address: e.string().optional().nullable()
}), He = e.object({
  created_at: e.string().optional(),
  display_name: e.string().optional().nullable(),
  email: e.string().optional(),
  email_verified: e.boolean().optional().nullable(),
  id: e.string().optional(),
  profile_url: e.string().optional().nullable(),
  role: e.string().optional().nullable(),
  updated_at: e.string().optional(),
  username: e.string().optional(),
  wallet_address: e.string().optional().nullable()
}), Be = e.object({
  album_id: e.string().nullable(),
  last_played_at: e.string().nullable(),
  play_count: e.number().nullable(),
  tracks_played: e.number().nullable(),
  unique_listeners: e.number().nullable()
}), Fe = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_album_id_fkey"),
    columns: e.tuple([e.literal("album_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("albums"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), De = e.object({
  artist_id: e.string().nullable(),
  last_played_at: e.string().nullable(),
  play_count: e.number().nullable(),
  tracks_played: e.number().nullable(),
  unique_listeners: e.number().nullable()
}), Me = e.tuple([
  e.object({
    foreignKeyName: e.literal("tracks_artist_id_fkey"),
    columns: e.tuple([e.literal("artist_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("artists"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), We = e.object({
  last_played_at: e.string().nullable(),
  play_count: e.number().nullable(),
  track_id: e.string().nullable(),
  unique_listeners: e.number().nullable()
}), Ee = e.tuple([
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks"),
    referencedColumns: e.tuple([e.literal("id")])
  }),
  e.object({
    foreignKeyName: e.literal("play_history_track_id_fkey"),
    columns: e.tuple([e.literal("track_id")]),
    isOneToOne: e.literal(!1),
    referencedRelation: e.literal("tracks_with_details"),
    referencedColumns: e.tuple([e.literal("id")])
  })
]), Ve = e.object({
  album_id: e.string().nullable(),
  album_release_date: e.string().nullable(),
  album_title: e.string().nullable(),
  artist_id: e.string().nullable(),
  artist_name: e.string().nullable(),
  artist_verified: e.boolean().nullable(),
  audio_url: e.string().nullable(),
  cover_url: e.string().nullable(),
  created_at: e.string().nullable(),
  duration: e.number().nullable(),
  explicit: e.boolean().nullable(),
  genre: e.array(e.string()).nullable(),
  id: e.string().nullable(),
  isrc: e.string().nullable(),
  lyrics: e.string().nullable(),
  play_count: e.number().nullable(),
  release_date: e.string().nullable(),
  title: e.string().nullable(),
  track_number: e.number().nullable(),
  unique_listeners: e.number().nullable(),
  updated_at: e.string().nullable()
}), $e = e.tuple([
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
]), Je = e.object({
  album_id: e.string()
}), Qe = e.boolean(), Xe = e.object({
  track_id: e.string()
}), Ye = e.boolean(), Ze = e.object({
  playlist_id: e.string(),
  track_id: e.string()
}), el = e.undefined(), ll = e.object({
  artist_name: e.string(),
  bio: e.string().optional(),
  genre: e.array(e.string()).optional(),
  location: e.string().optional(),
  website: e.string().optional(),
  social_links: l.optional(),
  application_notes: e.string().optional()
}), tl = l, al = e.object({
  artist_id: e.string(),
  approved: e.boolean(),
  admin_notes: e.string().optional()
}), il = l, nl = e.object({
  name: e.string(),
  description: e.string().optional(),
  is_public: e.boolean().optional()
}), rl = e.object({
  cover_url: e.string().nullable(),
  created_at: e.string(),
  description: e.string().nullable(),
  id: e.string(),
  is_public: e.boolean().nullable(),
  name: e.string(),
  updated_at: e.string(),
  user_id: e.string()
}), sl = e.object({
  title: e.string(),
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
}), ol = e.object({
  album_id: e.string().nullable(),
  artist_id: e.string(),
  audio_url: e.string(),
  cover_url: e.string().nullable(),
  created_at: e.string(),
  duration: e.number(),
  explicit: e.boolean().nullable(),
  genre: e.array(e.string()).nullable(),
  id: e.string(),
  isrc: e.string().nullable(),
  lyrics: e.string().nullable(),
  release_date: e.string().nullable(),
  title: e.string(),
  track_number: e.number().nullable(),
  updated_at: e.string()
}), cl = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), ul = e.array(
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
), pl = e.object({
  time_period: e.string().optional()
}), bl = e.array(
  e.object({
    total_payments: e.number(),
    total_amount: e.number(),
    avg_amount: e.number(),
    payment_type: e.string(),
    period: e.string()
  })
), dl = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), _l = e.array(
  e.object({
    application_date: e.string().nullable(),
    application_notes: e.string().nullable(),
    approved: e.boolean().nullable(),
    artist_name: e.string(),
    bio: e.string().nullable(),
    created_at: e.string(),
    genre: e.array(e.string()).nullable(),
    id: e.string(),
    location: e.string().nullable(),
    social_links: l.nullable(),
    updated_at: e.string(),
    verified: e.boolean().nullable(),
    website: e.string().nullable()
  })
), gl = e.object({
  months_back: e.number().optional()
}), ml = e.array(
  e.object({
    month: e.string(),
    total_amount: e.number(),
    payment_count: e.number()
  })
), yl = e.object({
  p_start_date: e.string(),
  p_end_date: e.string(),
  p_limit: e.number().optional()
}), hl = e.array(
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
), fl = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional()
}), Sl = e.array(
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
), kl = e.object({
  p_genre_id: e.string(),
  p_limit: e.number().optional(),
  p_offset: e.number().optional()
}), jl = e.array(
  e.object({
    album_id: e.string().nullable(),
    artist_id: e.string(),
    audio_url: e.string(),
    cover_url: e.string().nullable(),
    created_at: e.string(),
    duration: e.number(),
    explicit: e.boolean().nullable(),
    genre: e.array(e.string()).nullable(),
    id: e.string(),
    isrc: e.string().nullable(),
    lyrics: e.string().nullable(),
    release_date: e.string().nullable(),
    title: e.string(),
    track_number: e.number().nullable(),
    updated_at: e.string()
  })
), Rl = e.object({
  track_id: e.string(),
  play_duration: e.number().optional(),
  completed: e.boolean().optional(),
  source: e.string().optional(),
  context_id: e.string().optional()
}), Ol = e.undefined(), Tl = e.object({
  artist_id: e.string(),
  amount: e.number(),
  transaction_hash: e.string(),
  track_id: e.string().optional(),
  album_id: e.string().optional(),
  message: e.string().optional()
}), Al = e.object({
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
}), Cl = e.object({}), wl = e.undefined(), Kl = {
  public: {
    Enums: {}
  }
};
function Nl(t, a) {
  return new i(t, {
    headers: a
  });
}
function Pl(t, a) {
  return n(t, a);
}
export {
  Kl as Constants,
  Nl as createClient,
  Pl as createClientV2,
  l as jsonSchema,
  Je as publicAddAlbumToLibraryArgsSchemaSchema,
  Qe as publicAddAlbumToLibraryReturnsSchemaSchema,
  Xe as publicAddTrackToLibraryArgsSchemaSchema,
  Ye as publicAddTrackToLibraryReturnsSchemaSchema,
  Ze as publicAddTrackToPlaylistArgsSchemaSchema,
  el as publicAddTrackToPlaylistReturnsSchemaSchema,
  u as publicAlbumGenresInsertSchemaSchema,
  b as publicAlbumGenresRelationshipsSchemaSchema,
  c as publicAlbumGenresRowSchemaSchema,
  p as publicAlbumGenresUpdateSchemaSchema,
  _ as publicAlbumLikesInsertSchemaSchema,
  m as publicAlbumLikesRelationshipsSchemaSchema,
  d as publicAlbumLikesRowSchemaSchema,
  g as publicAlbumLikesUpdateSchemaSchema,
  Fe as publicAlbumPlayCountsRelationshipsSchemaSchema,
  Be as publicAlbumPlayCountsRowSchemaSchema,
  h as publicAlbumsInsertSchemaSchema,
  S as publicAlbumsRelationshipsSchemaSchema,
  y as publicAlbumsRowSchemaSchema,
  f as publicAlbumsUpdateSchemaSchema,
  ll as publicApplyForArtistAccountArgsSchemaSchema,
  tl as publicApplyForArtistAccountReturnsSchemaSchema,
  al as publicApproveArtistApplicationArgsSchemaSchema,
  il as publicApproveArtistApplicationReturnsSchemaSchema,
  j as publicArtistFollowersInsertSchemaSchema,
  O as publicArtistFollowersRelationshipsSchemaSchema,
  k as publicArtistFollowersRowSchemaSchema,
  R as publicArtistFollowersUpdateSchemaSchema,
  A as publicArtistGenresInsertSchemaSchema,
  w as publicArtistGenresRelationshipsSchemaSchema,
  T as publicArtistGenresRowSchemaSchema,
  C as publicArtistGenresUpdateSchemaSchema,
  Me as publicArtistPlayCountsRelationshipsSchemaSchema,
  De as publicArtistPlayCountsRowSchemaSchema,
  N as publicArtistsInsertSchemaSchema,
  G as publicArtistsRelationshipsSchemaSchema,
  K as publicArtistsRowSchemaSchema,
  P as publicArtistsUpdateSchemaSchema,
  nl as publicCreatePlaylistArgsSchemaSchema,
  rl as publicCreatePlaylistReturnsSchemaSchema,
  sl as publicCreateTrackArgsSchemaSchema,
  ol as publicCreateTrackReturnsSchemaSchema,
  U as publicGenresInsertSchemaSchema,
  v as publicGenresRowSchemaSchema,
  L as publicGenresUpdateSchemaSchema,
  cl as publicGetAlbumsByGenreArgsSchemaSchema,
  ul as publicGetAlbumsByGenreReturnsSchemaSchema,
  pl as publicGetArtistPaymentStatsArgsSchemaSchema,
  bl as publicGetArtistPaymentStatsReturnsSchemaSchema,
  dl as publicGetArtistsByGenreArgsSchemaSchema,
  _l as publicGetArtistsByGenreReturnsSchemaSchema,
  gl as publicGetMonthlyPaymentTrendsArgsSchemaSchema,
  ml as publicGetMonthlyPaymentTrendsReturnsSchemaSchema,
  yl as publicGetPopularGenresArgsSchemaSchema,
  hl as publicGetPopularGenresReturnsSchemaSchema,
  fl as publicGetRelatedGenresArgsSchemaSchema,
  Sl as publicGetRelatedGenresReturnsSchemaSchema,
  kl as publicGetTracksByGenreArgsSchemaSchema,
  jl as publicGetTracksByGenreReturnsSchemaSchema,
  I as publicPaymentStatusHistoryInsertSchemaSchema,
  z as publicPaymentStatusHistoryRelationshipsSchemaSchema,
  x as publicPaymentStatusHistoryRowSchemaSchema,
  q as publicPaymentStatusHistoryUpdateSchemaSchema,
  B as publicPaymentsInsertSchemaSchema,
  D as publicPaymentsRelationshipsSchemaSchema,
  H as publicPaymentsRowSchemaSchema,
  F as publicPaymentsUpdateSchemaSchema,
  W as publicPlayHistoryInsertSchemaSchema,
  V as publicPlayHistoryRelationshipsSchemaSchema,
  M as publicPlayHistoryRowSchemaSchema,
  E as publicPlayHistoryUpdateSchemaSchema,
  J as publicPlaylistLikesInsertSchemaSchema,
  X as publicPlaylistLikesRelationshipsSchemaSchema,
  $ as publicPlaylistLikesRowSchemaSchema,
  Q as publicPlaylistLikesUpdateSchemaSchema,
  Z as publicPlaylistTracksInsertSchemaSchema,
  le as publicPlaylistTracksRelationshipsSchemaSchema,
  Y as publicPlaylistTracksRowSchemaSchema,
  ee as publicPlaylistTracksUpdateSchemaSchema,
  ae as publicPlaylistsInsertSchemaSchema,
  ne as publicPlaylistsRelationshipsSchemaSchema,
  te as publicPlaylistsRowSchemaSchema,
  ie as publicPlaylistsUpdateSchemaSchema,
  Rl as publicRecordPlayArgsSchemaSchema,
  Ol as publicRecordPlayReturnsSchemaSchema,
  se as publicRelatedGenresInsertSchemaSchema,
  ce as publicRelatedGenresRelationshipsSchemaSchema,
  re as publicRelatedGenresRowSchemaSchema,
  oe as publicRelatedGenresUpdateSchemaSchema,
  Tl as publicTipArtistArgsSchemaSchema,
  Al as publicTipArtistReturnsSchemaSchema,
  pe as publicTrackGenresInsertSchemaSchema,
  de as publicTrackGenresRelationshipsSchemaSchema,
  ue as publicTrackGenresRowSchemaSchema,
  be as publicTrackGenresUpdateSchemaSchema,
  ge as publicTrackLikesInsertSchemaSchema,
  ye as publicTrackLikesRelationshipsSchemaSchema,
  _e as publicTrackLikesRowSchemaSchema,
  me as publicTrackLikesUpdateSchemaSchema,
  Ee as publicTrackPlayCountsRelationshipsSchemaSchema,
  We as publicTrackPlayCountsRowSchemaSchema,
  fe as publicTracksInsertSchemaSchema,
  ke as publicTracksRelationshipsSchemaSchema,
  he as publicTracksRowSchemaSchema,
  Se as publicTracksUpdateSchemaSchema,
  $e as publicTracksWithDetailsRelationshipsSchemaSchema,
  Ve as publicTracksWithDetailsRowSchemaSchema,
  Cl as publicUpdateGenrePopularityArgsSchemaSchema,
  wl as publicUpdateGenrePopularityReturnsSchemaSchema,
  Re as publicUserLibraryAlbumsInsertSchemaSchema,
  Te as publicUserLibraryAlbumsRelationshipsSchemaSchema,
  je as publicUserLibraryAlbumsRowSchemaSchema,
  Oe as publicUserLibraryAlbumsUpdateSchemaSchema,
  Ce as publicUserLibraryTracksInsertSchemaSchema,
  Ke as publicUserLibraryTracksRelationshipsSchemaSchema,
  Ae as publicUserLibraryTracksRowSchemaSchema,
  we as publicUserLibraryTracksUpdateSchemaSchema,
  Pe as publicUserRecentlyPlayedInsertSchemaSchema,
  ve as publicUserRecentlyPlayedRelationshipsSchemaSchema,
  Ne as publicUserRecentlyPlayedRowSchemaSchema,
  Ge as publicUserRecentlyPlayedUpdateSchemaSchema,
  Le as publicUserSettingsInsertSchemaSchema,
  Ie as publicUserSettingsRelationshipsSchemaSchema,
  Ue as publicUserSettingsRowSchemaSchema,
  xe as publicUserSettingsUpdateSchemaSchema,
  ze as publicUsersInsertSchemaSchema,
  qe as publicUsersRowSchemaSchema,
  He as publicUsersUpdateSchemaSchema
};
