create table "public"."album_genres" (
    "album_id" uuid not null,
    "genre_id" uuid not null
);


alter table "public"."album_genres" enable row level security;

create table "public"."album_likes" (
    "album_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "public"."album_likes" enable row level security;

create table "public"."albums" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "artist_id" uuid not null,
    "release_date" date,
    "cover_url" text,
    "description" text,
    "genre" text[],
    "type" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."albums" enable row level security;

create table "public"."artist_followers" (
    "artist_id" uuid not null,
    "user_id" uuid not null,
    "followed_at" timestamp with time zone not null default now()
);


alter table "public"."artist_followers" enable row level security;

create table "public"."artist_genres" (
    "artist_id" uuid not null,
    "genre_id" uuid not null
);


alter table "public"."artist_genres" enable row level security;

create table "public"."artists" (
    "id" uuid not null,
    "artist_name" text not null,
    "bio" text,
    "genre" text[],
    "location" text,
    "website" text,
    "social_links" jsonb default '{}'::jsonb,
    "verified" boolean default false,
    "approved" boolean default false,
    "application_date" timestamp with time zone,
    "application_notes" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."artists" enable row level security;

create table "public"."genres" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "image_url" text,
    "color" text,
    "slug" text,
    "popularity" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."genres" enable row level security;

create table "public"."payment_status_history" (
    "id" uuid not null default uuid_generate_v4(),
    "payment_id" uuid not null,
    "old_status" text,
    "new_status" text not null,
    "notes" text,
    "changed_at" timestamp with time zone not null default now(),
    "changed_by" text not null default 'system'::text
);


alter table "public"."payment_status_history" enable row level security;

create table "public"."payments" (
    "id" uuid not null default uuid_generate_v4(),
    "sender_id" uuid not null,
    "recipient_id" uuid not null,
    "amount" numeric(20,9) not null,
    "currency" text not null default 'SUI'::text,
    "transaction_hash" text,
    "status" text not null,
    "payment_type" text not null,
    "track_id" uuid,
    "album_id" uuid,
    "message" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."payments" enable row level security;

create table "public"."play_history" (
    "id" uuid not null default uuid_generate_v4(),
    "track_id" uuid not null,
    "user_id" uuid,
    "played_at" timestamp with time zone not null default now(),
    "play_duration" integer,
    "completed" boolean default false,
    "source" text,
    "context_id" uuid,
    "client_ip" text,
    "user_agent" text
);


alter table "public"."play_history" enable row level security;

create table "public"."playlist_likes" (
    "playlist_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "public"."playlist_likes" enable row level security;

create table "public"."playlist_tracks" (
    "playlist_id" uuid not null,
    "track_id" uuid not null,
    "added_by" uuid not null,
    "added_at" timestamp with time zone not null default now(),
    "position" integer not null
);


alter table "public"."playlist_tracks" enable row level security;

create table "public"."playlists" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "user_id" uuid not null,
    "cover_url" text,
    "is_public" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."playlists" enable row level security;

create table "public"."related_genres" (
    "genre_id" uuid not null,
    "related_genre_id" uuid not null,
    "weight" integer default 1
);


alter table "public"."related_genres" enable row level security;

create table "public"."track_genres" (
    "track_id" uuid not null,
    "genre_id" uuid not null
);


alter table "public"."track_genres" enable row level security;

create table "public"."track_likes" (
    "track_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "public"."track_likes" enable row level security;

create table "public"."tracks" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "artist_id" uuid not null,
    "album_id" uuid,
    "duration" integer not null,
    "audio_url" text not null,
    "cover_url" text,
    "track_number" integer,
    "lyrics" text,
    "genre" text[] default '{}'::text[],
    "explicit" boolean default false,
    "release_date" date,
    "isrc" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."tracks" enable row level security;

create table "public"."user_library_albums" (
    "user_id" uuid not null,
    "album_id" uuid not null,
    "added_at" timestamp with time zone not null default now()
);


alter table "public"."user_library_albums" enable row level security;

create table "public"."user_library_tracks" (
    "user_id" uuid not null,
    "track_id" uuid not null,
    "added_at" timestamp with time zone not null default now()
);


alter table "public"."user_library_tracks" enable row level security;

create table "public"."user_recently_played" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "track_id" uuid not null,
    "played_at" timestamp with time zone not null default now(),
    "context_type" text,
    "context_id" uuid
);


alter table "public"."user_recently_played" enable row level security;

create table "public"."user_settings" (
    "user_id" uuid not null,
    "theme" text default 'auto'::text,
    "audio_quality" text default 'high'::text,
    "enable_explicit_content" boolean default true,
    "enable_autoplay" boolean default true,
    "enable_crossfade" boolean default true,
    "crossfade_duration" integer default 5,
    "enable_gapless_playback" boolean default true,
    "volume_level" integer default 70,
    "enable_equalizer" boolean default false,
    "equalizer_settings" jsonb default '{}'::jsonb,
    "enable_notifications" boolean default true,
    "notification_settings" jsonb default '{}'::jsonb,
    "preferred_language" text default 'en'::text,
    "auto_add_to_library" boolean default false,
    "privacy_level" text default 'friends'::text,
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."user_settings" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "username" text not null,
    "display_name" text,
    "email" text not null,
    "wallet_address" text,
    "profile_url" text,
    "email_verified" boolean default false,
    "role" text default 'user'::text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX album_genres_pkey ON public.album_genres USING btree (album_id, genre_id);

CREATE UNIQUE INDEX album_likes_pkey ON public.album_likes USING btree (album_id, user_id);

CREATE UNIQUE INDEX albums_pkey ON public.albums USING btree (id);

CREATE UNIQUE INDEX artist_followers_pkey ON public.artist_followers USING btree (artist_id, user_id);

CREATE UNIQUE INDEX artist_genres_pkey ON public.artist_genres USING btree (artist_id, genre_id);

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (id);

CREATE UNIQUE INDEX genres_name_key ON public.genres USING btree (name);

CREATE UNIQUE INDEX genres_pkey ON public.genres USING btree (id);

CREATE UNIQUE INDEX genres_slug_key ON public.genres USING btree (slug);

CREATE INDEX idx_album_genres_genre_id ON public.album_genres USING btree (genre_id);

CREATE INDEX idx_album_likes_user_id ON public.album_likes USING btree (user_id);

CREATE INDEX idx_albums_artist_id ON public.albums USING btree (artist_id);

CREATE INDEX idx_albums_cover_url ON public.albums USING btree (cover_url);

CREATE INDEX idx_albums_genre ON public.albums USING gin (genre);

CREATE INDEX idx_albums_release_date ON public.albums USING btree (release_date);

CREATE INDEX idx_albums_title ON public.albums USING btree (title);

CREATE INDEX idx_artist_followers_user_id ON public.artist_followers USING btree (user_id);

CREATE INDEX idx_artist_genres_genre_id ON public.artist_genres USING btree (genre_id);

CREATE INDEX idx_artists_genre ON public.artists USING gin (genre);

CREATE INDEX idx_artists_name ON public.artists USING btree (artist_name);

CREATE INDEX idx_genres_name ON public.genres USING btree (name);

CREATE INDEX idx_genres_popularity ON public.genres USING btree (popularity);

CREATE INDEX idx_genres_slug ON public.genres USING btree (slug);

CREATE INDEX idx_payment_status_history_payment_id ON public.payment_status_history USING btree (payment_id);

CREATE INDEX idx_payments_album_id ON public.payments USING btree (album_id);

CREATE INDEX idx_payments_created_at ON public.payments USING btree (created_at);

CREATE INDEX idx_payments_recipient_id ON public.payments USING btree (recipient_id);

CREATE INDEX idx_payments_sender_id ON public.payments USING btree (sender_id);

CREATE INDEX idx_payments_status ON public.payments USING btree (status);

CREATE INDEX idx_payments_track_id ON public.payments USING btree (track_id);

CREATE INDEX idx_play_history_played_at ON public.play_history USING btree (played_at);

CREATE INDEX idx_play_history_track_id ON public.play_history USING btree (track_id);

CREATE INDEX idx_play_history_user_id ON public.play_history USING btree (user_id);

CREATE INDEX idx_playlist_likes_user_id ON public.playlist_likes USING btree (user_id);

CREATE INDEX idx_playlist_tracks_added_by ON public.playlist_tracks USING btree (added_by);

CREATE INDEX idx_playlist_tracks_position ON public.playlist_tracks USING btree ("position");

CREATE INDEX idx_playlist_tracks_track_id ON public.playlist_tracks USING btree (track_id);

CREATE INDEX idx_playlists_cover_url ON public.playlists USING btree (cover_url);

CREATE INDEX idx_playlists_name ON public.playlists USING btree (name);

CREATE INDEX idx_playlists_user_id ON public.playlists USING btree (user_id);

CREATE INDEX idx_track_genres_genre_id ON public.track_genres USING btree (genre_id);

CREATE INDEX idx_track_likes_user_id ON public.track_likes USING btree (user_id);

CREATE INDEX idx_tracks_album_id ON public.tracks USING btree (album_id);

CREATE INDEX idx_tracks_artist_id ON public.tracks USING btree (artist_id);

CREATE INDEX idx_tracks_cover_url ON public.tracks USING btree (cover_url);

CREATE INDEX idx_tracks_genre ON public.tracks USING gin (genre);

CREATE INDEX idx_tracks_title ON public.tracks USING btree (title);

CREATE INDEX idx_user_library_albums_album_id ON public.user_library_albums USING btree (album_id);

CREATE INDEX idx_user_library_tracks_track_id ON public.user_library_tracks USING btree (track_id);

CREATE INDEX idx_user_recently_played_context_id ON public.user_recently_played USING btree (context_id);

CREATE INDEX idx_user_recently_played_played_at ON public.user_recently_played USING btree (played_at);

CREATE INDEX idx_user_recently_played_track_id ON public.user_recently_played USING btree (track_id);

CREATE INDEX idx_user_recently_played_user_id ON public.user_recently_played USING btree (user_id);

CREATE INDEX idx_users_profile_url ON public.users USING btree (profile_url);

CREATE INDEX idx_users_username ON public.users USING btree (username);

CREATE INDEX idx_users_wallet_address ON public.users USING btree (wallet_address);

CREATE UNIQUE INDEX payment_status_history_pkey ON public.payment_status_history USING btree (id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX payments_transaction_hash_key ON public.payments USING btree (transaction_hash);

CREATE UNIQUE INDEX play_history_pkey ON public.play_history USING btree (id);

CREATE UNIQUE INDEX playlist_likes_pkey ON public.playlist_likes USING btree (playlist_id, user_id);

CREATE UNIQUE INDEX playlist_tracks_pkey ON public.playlist_tracks USING btree (playlist_id, track_id);

CREATE UNIQUE INDEX playlists_pkey ON public.playlists USING btree (id);

CREATE UNIQUE INDEX related_genres_pkey ON public.related_genres USING btree (genre_id, related_genre_id);

CREATE UNIQUE INDEX track_genres_pkey ON public.track_genres USING btree (track_id, genre_id);

CREATE UNIQUE INDEX track_likes_pkey ON public.track_likes USING btree (track_id, user_id);

CREATE UNIQUE INDEX tracks_pkey ON public.tracks USING btree (id);

CREATE UNIQUE INDEX user_library_albums_pkey ON public.user_library_albums USING btree (user_id, album_id);

CREATE UNIQUE INDEX user_library_tracks_pkey ON public.user_library_tracks USING btree (user_id, track_id);

CREATE UNIQUE INDEX user_recently_played_pkey ON public.user_recently_played USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

CREATE UNIQUE INDEX users_wallet_address_key ON public.users USING btree (wallet_address);

alter table "public"."album_genres" add constraint "album_genres_pkey" PRIMARY KEY using index "album_genres_pkey";

alter table "public"."album_likes" add constraint "album_likes_pkey" PRIMARY KEY using index "album_likes_pkey";

alter table "public"."albums" add constraint "albums_pkey" PRIMARY KEY using index "albums_pkey";

alter table "public"."artist_followers" add constraint "artist_followers_pkey" PRIMARY KEY using index "artist_followers_pkey";

alter table "public"."artist_genres" add constraint "artist_genres_pkey" PRIMARY KEY using index "artist_genres_pkey";

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."genres" add constraint "genres_pkey" PRIMARY KEY using index "genres_pkey";

alter table "public"."payment_status_history" add constraint "payment_status_history_pkey" PRIMARY KEY using index "payment_status_history_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."play_history" add constraint "play_history_pkey" PRIMARY KEY using index "play_history_pkey";

alter table "public"."playlist_likes" add constraint "playlist_likes_pkey" PRIMARY KEY using index "playlist_likes_pkey";

alter table "public"."playlist_tracks" add constraint "playlist_tracks_pkey" PRIMARY KEY using index "playlist_tracks_pkey";

alter table "public"."playlists" add constraint "playlists_pkey" PRIMARY KEY using index "playlists_pkey";

alter table "public"."related_genres" add constraint "related_genres_pkey" PRIMARY KEY using index "related_genres_pkey";

alter table "public"."track_genres" add constraint "track_genres_pkey" PRIMARY KEY using index "track_genres_pkey";

alter table "public"."track_likes" add constraint "track_likes_pkey" PRIMARY KEY using index "track_likes_pkey";

alter table "public"."tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."user_library_albums" add constraint "user_library_albums_pkey" PRIMARY KEY using index "user_library_albums_pkey";

alter table "public"."user_library_tracks" add constraint "user_library_tracks_pkey" PRIMARY KEY using index "user_library_tracks_pkey";

alter table "public"."user_recently_played" add constraint "user_recently_played_pkey" PRIMARY KEY using index "user_recently_played_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."album_genres" add constraint "album_genres_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE not valid;

alter table "public"."album_genres" validate constraint "album_genres_album_id_fkey";

alter table "public"."album_genres" add constraint "album_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE not valid;

alter table "public"."album_genres" validate constraint "album_genres_genre_id_fkey";

alter table "public"."album_likes" add constraint "album_likes_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE not valid;

alter table "public"."album_likes" validate constraint "album_likes_album_id_fkey";

alter table "public"."album_likes" add constraint "album_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."album_likes" validate constraint "album_likes_user_id_fkey";

alter table "public"."albums" add constraint "albums_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."albums" validate constraint "albums_artist_id_fkey";

alter table "public"."albums" add constraint "albums_type_check" CHECK ((type = ANY (ARRAY['album'::text, 'ep'::text, 'single'::text, 'compilation'::text]))) not valid;

alter table "public"."albums" validate constraint "albums_type_check";

alter table "public"."artist_followers" add constraint "artist_followers_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."artist_followers" validate constraint "artist_followers_artist_id_fkey";

alter table "public"."artist_followers" add constraint "artist_followers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."artist_followers" validate constraint "artist_followers_user_id_fkey";

alter table "public"."artist_genres" add constraint "artist_genres_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."artist_genres" validate constraint "artist_genres_artist_id_fkey";

alter table "public"."artist_genres" add constraint "artist_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE not valid;

alter table "public"."artist_genres" validate constraint "artist_genres_genre_id_fkey";

alter table "public"."artists" add constraint "artists_id_fkey" FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."artists" validate constraint "artists_id_fkey";

alter table "public"."genres" add constraint "genres_name_key" UNIQUE using index "genres_name_key";

alter table "public"."genres" add constraint "genres_slug_key" UNIQUE using index "genres_slug_key";

alter table "public"."payment_status_history" add constraint "payment_status_history_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE not valid;

alter table "public"."payment_status_history" validate constraint "payment_status_history_payment_id_fkey";

alter table "public"."payments" add constraint "payments_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_album_id_fkey";

alter table "public"."payments" add constraint "payments_payment_type_check" CHECK ((payment_type = ANY (ARRAY['tip'::text, 'subscription'::text, 'purchase'::text]))) not valid;

alter table "public"."payments" validate constraint "payments_payment_type_check";

alter table "public"."payments" add constraint "payments_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES artists(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_recipient_id_fkey";

alter table "public"."payments" add constraint "payments_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_sender_id_fkey";

alter table "public"."payments" add constraint "payments_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."payments" validate constraint "payments_status_check";

alter table "public"."payments" add constraint "payments_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_track_id_fkey";

alter table "public"."payments" add constraint "payments_transaction_hash_key" UNIQUE using index "payments_transaction_hash_key";

alter table "public"."play_history" add constraint "play_history_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."play_history" validate constraint "play_history_track_id_fkey";

alter table "public"."play_history" add constraint "play_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."play_history" validate constraint "play_history_user_id_fkey";

alter table "public"."playlist_likes" add constraint "playlist_likes_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_likes" validate constraint "playlist_likes_playlist_id_fkey";

alter table "public"."playlist_likes" add constraint "playlist_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_likes" validate constraint "playlist_likes_user_id_fkey";

alter table "public"."playlist_tracks" add constraint "playlist_tracks_added_by_fkey" FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL not valid;

alter table "public"."playlist_tracks" validate constraint "playlist_tracks_added_by_fkey";

alter table "public"."playlist_tracks" add constraint "playlist_tracks_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_tracks" validate constraint "playlist_tracks_playlist_id_fkey";

alter table "public"."playlist_tracks" add constraint "playlist_tracks_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."playlist_tracks" validate constraint "playlist_tracks_track_id_fkey";

alter table "public"."playlists" add constraint "playlists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."playlists" validate constraint "playlists_user_id_fkey";

alter table "public"."related_genres" add constraint "related_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE not valid;

alter table "public"."related_genres" validate constraint "related_genres_genre_id_fkey";

alter table "public"."related_genres" add constraint "related_genres_related_genre_id_fkey" FOREIGN KEY (related_genre_id) REFERENCES genres(id) ON DELETE CASCADE not valid;

alter table "public"."related_genres" validate constraint "related_genres_related_genre_id_fkey";

alter table "public"."track_genres" add constraint "track_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE not valid;

alter table "public"."track_genres" validate constraint "track_genres_genre_id_fkey";

alter table "public"."track_genres" add constraint "track_genres_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."track_genres" validate constraint "track_genres_track_id_fkey";

alter table "public"."track_likes" add constraint "track_likes_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."track_likes" validate constraint "track_likes_track_id_fkey";

alter table "public"."track_likes" add constraint "track_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."track_likes" validate constraint "track_likes_user_id_fkey";

alter table "public"."tracks" add constraint "tracks_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE SET NULL not valid;

alter table "public"."tracks" validate constraint "tracks_album_id_fkey";

alter table "public"."tracks" add constraint "tracks_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE not valid;

alter table "public"."tracks" validate constraint "tracks_artist_id_fkey";

alter table "public"."user_library_albums" add constraint "user_library_albums_album_id_fkey" FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE not valid;

alter table "public"."user_library_albums" validate constraint "user_library_albums_album_id_fkey";

alter table "public"."user_library_albums" add constraint "user_library_albums_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_library_albums" validate constraint "user_library_albums_user_id_fkey";

alter table "public"."user_library_tracks" add constraint "user_library_tracks_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."user_library_tracks" validate constraint "user_library_tracks_track_id_fkey";

alter table "public"."user_library_tracks" add constraint "user_library_tracks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_library_tracks" validate constraint "user_library_tracks_user_id_fkey";

alter table "public"."user_recently_played" add constraint "user_recently_played_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."user_recently_played" validate constraint "user_recently_played_track_id_fkey";

alter table "public"."user_recently_played" add constraint "user_recently_played_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_recently_played" validate constraint "user_recently_played_user_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "public"."users" add constraint "users_wallet_address_key" UNIQUE using index "users_wallet_address_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_album_to_library(album_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Add album to library
  INSERT INTO public.user_library_albums (
    user_id,
    album_id
  )
  VALUES (
    current_user_id,
    album_id
  )
  ON CONFLICT (user_id, album_id) DO NOTHING;
  
  -- Also add all tracks from the album to library (will be populated when tracks are created)
  INSERT INTO public.user_library_tracks (
    user_id,
    track_id
  )
  SELECT 
    current_user_id,
    id
  FROM 
    public.tracks
  WHERE 
    album_id = add_album_to_library.album_id
  ON CONFLICT (user_id, track_id) DO NOTHING;
  
  RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_track_to_library(track_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Add track to library
  INSERT INTO public.user_library_tracks (
    user_id,
    track_id
  )
  VALUES (
    current_user_id,
    track_id
  )
  ON CONFLICT (user_id, track_id) DO NOTHING;
  
  RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_track_to_playlist(playlist_id uuid, track_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  max_position INTEGER;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if playlist exists and user has permission
  IF NOT EXISTS (
    SELECT 1 FROM public.playlists
    WHERE id = playlist_id
    AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'Playlist not found or no permission to add tracks';
  END IF;
  
  -- Get the maximum position in the playlist
  SELECT COALESCE(MAX(position), 0) INTO max_position
  FROM public.playlist_tracks
  WHERE playlist_id = add_track_to_playlist.playlist_id;
  
  -- Add track to playlist
  INSERT INTO public.playlist_tracks (
    playlist_id,
    track_id,
    added_by,
    position
  )
  VALUES (
    playlist_id,
    track_id,
    current_user_id,
    max_position + 1
  )
  ON CONFLICT (playlist_id, track_id) DO NOTHING;
END;
$function$
;

create or replace view "public"."album_play_counts" as  SELECT tracks.album_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    count(DISTINCT play_history.track_id) AS tracks_played,
    max(play_history.played_at) AS last_played_at
   FROM (play_history
     JOIN tracks ON ((play_history.track_id = tracks.id)))
  WHERE (tracks.album_id IS NOT NULL)
  GROUP BY tracks.album_id;


CREATE OR REPLACE FUNCTION public.apply_for_artist_account(artist_name text, bio text DEFAULT NULL::text, genre text[] DEFAULT '{}'::text[], location text DEFAULT NULL::text, website text DEFAULT NULL::text, social_links jsonb DEFAULT NULL::jsonb, application_notes text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  artist_id UUID := auth.uid();
  result JSONB;
BEGIN
  -- Check authentication
  IF artist_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if user is already an artist
  IF EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'User is already registered as an artist';
  END IF;
  
  -- Create pending artist application
  INSERT INTO public.artists (
    id,
    artist_name,
    bio,
    genre,
    location,
    website,
    social_links,
    verified,
    approved,
    application_date,
    application_notes
  )
  VALUES (
    artist_id,
    artist_name,
    bio,
    COALESCE(genre, '{}'),
    location,
    website,
    COALESCE(social_links, '{}'::jsonb),
    FALSE,           -- Not verified initially
    FALSE,           -- Not approved initially
    NOW(),           -- Application timestamp
    application_notes
  );
  
  -- Update user role to indicate pending artist status
  UPDATE public.users 
  SET role = 'pending_artist'
  WHERE id = artist_id;
  
  -- Return application status
  result := json_build_object(
    'artist_id', artist_id,
    'status', 'pending_approval',
    'application_date', NOW()
  );
  
  RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.approve_artist_application(artist_id uuid, approved boolean, admin_notes text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  current_user_role TEXT;
  result JSONB;
BEGIN
  -- Check administrator privileges
  SELECT role INTO current_user_role FROM public.users WHERE id = current_user_id;
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Administrator privileges required';
  END IF;
  
  -- Check if artist record exists
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Update artist approval status
  UPDATE public.artists
  SET 
    approved = approve_artist_application.approved,
    application_notes = CASE 
      WHEN admin_notes IS NOT NULL 
      THEN COALESCE(application_notes, '') || E'\n\nAdmin Notes (' || NOW() || '): ' || admin_notes
      ELSE application_notes
    END
  WHERE id = artist_id;
  
  -- Update user role based on approval
  IF approved THEN
    UPDATE public.users
    SET role = 'artist'
    WHERE id = artist_id;
  ELSE
    UPDATE public.users
    SET role = 'user'
    WHERE id = artist_id;
  END IF;
  
  -- Return result
  result := json_build_object(
    'artist_id', artist_id,
    'approved', approved,
    'processed_at', NOW()
  );
  
  RETURN result;
END;
$function$
;

create or replace view "public"."artist_play_counts" as  SELECT tracks.artist_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    count(DISTINCT play_history.track_id) AS tracks_played,
    max(play_history.played_at) AS last_played_at
   FROM (play_history
     JOIN tracks ON ((play_history.track_id = tracks.id)))
  GROUP BY tracks.artist_id;


CREATE OR REPLACE FUNCTION public.create_playlist(name text, description text DEFAULT NULL::text, is_public boolean DEFAULT true)
 RETURNS playlists
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  new_playlist public.playlists;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Create playlist
  INSERT INTO public.playlists (
    name,
    description,
    user_id,
    is_public
  )
  VALUES (
    name,
    description,
    current_user_id,
    is_public
  )
  RETURNING * INTO new_playlist;
  
  RETURN new_playlist;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_track(title text, duration integer, audio_url text, album_id uuid DEFAULT NULL::uuid, cover_url text DEFAULT NULL::text, track_number integer DEFAULT NULL::integer, lyrics text DEFAULT NULL::text, genre text[] DEFAULT '{}'::text[], explicit boolean DEFAULT false, release_date date DEFAULT NULL::date, isrc text DEFAULT NULL::text)
 RETURNS tracks
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  artist_id UUID := auth.uid();
  new_track public.tracks;
BEGIN
  -- Verify authentication
  IF artist_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify user is an approved artist
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id AND approved = TRUE) THEN
    RAISE EXCEPTION 'User must be an approved artist to create tracks';
  END IF;
  
  -- Verify album exists if provided and belongs to artist
  IF album_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.albums 
    WHERE id = album_id AND artist_id = create_track.artist_id
  ) THEN
    RAISE EXCEPTION 'Album not found or does not belong to artist';
  END IF;
  
  -- Create track
  INSERT INTO public.tracks (
    title,
    artist_id,
    album_id,
    duration,
    audio_url,
    cover_url,
    track_number,
    lyrics,
    genre,
    explicit,
    release_date,
    isrc
  )
  VALUES (
    title,
    artist_id,
    album_id,
    duration,
    audio_url,
    cover_url,
    track_number,
    lyrics,
    genre,
    explicit,
    release_date,
    isrc
  )
  RETURNING * INTO new_track;
  
  RETURN new_track;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_albums_by_genre(p_genre_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS SETOF albums
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM public.albums a
  JOIN public.album_genres ag ON ag.album_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_artist_payment_stats(time_period text DEFAULT 'all_time'::text)
 RETURNS TABLE(total_payments bigint, total_amount numeric, avg_amount numeric, payment_type text, period text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  start_date TIMESTAMPTZ;
BEGIN
  -- Check authentication and artist status
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User must be an artist to view payment statistics';
  END IF;
  
  -- Set date range based on requested time period
  CASE time_period
    WHEN 'last_7_days' THEN
      start_date := NOW() - INTERVAL '7 days';
    WHEN 'last_30_days' THEN
      start_date := NOW() - INTERVAL '30 days';
    WHEN 'last_90_days' THEN
      start_date := NOW() - INTERVAL '90 days';
    WHEN 'last_year' THEN
      start_date := NOW() - INTERVAL '1 year';
    ELSE
      start_date := '1970-01-01'::TIMESTAMPTZ; -- all time
  END CASE;
  
  -- Return payment statistics
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_payments,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    p.payment_type,
    CASE time_period
      WHEN 'last_7_days' THEN 'Last 7 days'
      WHEN 'last_30_days' THEN 'Last 30 days'
      WHEN 'last_90_days' THEN 'Last 90 days'
      WHEN 'last_year' THEN 'Last year'
      ELSE 'All time'
    END as period
  FROM 
    public.payments p
  WHERE 
    p.recipient_id = current_user_id
    AND p.status = 'completed'
    AND p.created_at >= start_date
  GROUP BY 
    p.payment_type;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_artists_by_genre(p_genre_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS SETOF artists
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM public.artists a
  JOIN public.artist_genres ag ON ag.artist_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.artist_name
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_monthly_payment_trends(months_back integer DEFAULT 12)
 RETURNS TABLE(month text, total_amount numeric, payment_count bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  start_date TIMESTAMPTZ := NOW() - (months_back || ' months')::INTERVAL;
BEGIN
  -- Check authentication and artist status
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User must be an artist to view payment statistics';
  END IF;
  
  -- Return monthly trends
  RETURN QUERY
  SELECT 
    TO_CHAR(p.created_at, 'YYYY-MM') as month,
    SUM(p.amount) as total_amount,
    COUNT(*)::BIGINT as payment_count
  FROM 
    public.payments p
  WHERE 
    p.recipient_id = current_user_id
    AND p.status = 'completed'
    AND p.created_at >= start_date
  GROUP BY 
    TO_CHAR(p.created_at, 'YYYY-MM')
  ORDER BY 
    month;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_popular_genres(p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_limit integer DEFAULT 10)
 RETURNS SETOF genres
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH popular_genres AS (
    -- Count plays for tracks in each genre during the specified period
    SELECT g.id, g.name, COUNT(*) as play_count
    FROM public.genres g
    JOIN public.track_genres tg ON tg.genre_id = g.id
    JOIN public.play_history ph ON ph.track_id = tg.track_id
    WHERE ph.played_at BETWEEN p_start_date AND p_end_date
    GROUP BY g.id, g.name
    ORDER BY play_count DESC
  )
  SELECT g.*
  FROM public.genres g
  JOIN popular_genres pg ON pg.id = g.id
  ORDER BY pg.play_count DESC
  LIMIT p_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_related_genres(p_genre_id uuid, p_limit integer DEFAULT 5)
 RETURNS SETOF genres
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH track_counts AS (
    -- Count tracks that share genres with the input genre
    SELECT g.id, g.name, COUNT(*) as common_tracks
    FROM public.genres g
    JOIN public.track_genres tg1 ON tg1.genre_id = g.id
    JOIN public.track_genres tg2 ON tg2.track_id = tg1.track_id
    WHERE tg2.genre_id = p_genre_id
    AND g.id != p_genre_id
    GROUP BY g.id, g.name
    ORDER BY common_tracks DESC
  )
  SELECT g.*
  FROM public.genres g
  JOIN track_counts tc ON tc.id = g.id
  ORDER BY tc.common_tracks DESC
  LIMIT p_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_tracks_by_genre(p_genre_id uuid, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS SETOF tracks
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM public.tracks t
  JOIN public.track_genres tg ON tg.track_id = t.id
  WHERE tg.genre_id = p_genre_id
  ORDER BY t.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.record_play(track_id uuid, play_duration integer DEFAULT NULL::integer, completed boolean DEFAULT false, source text DEFAULT NULL::text, context_id uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  anon_user_id UUID := '00000000-0000-0000-0000-000000000000'::UUID;
BEGIN
  -- Verify track exists
  IF NOT EXISTS (SELECT 1 FROM public.tracks WHERE id = track_id) THEN
    RAISE EXCEPTION 'Track not found';
  END IF;

  -- Insert play history record (even if not authenticated)
  INSERT INTO public.play_history (
    track_id,
    user_id,
    play_duration,
    completed,
    source,
    context_id,
    client_ip,
    user_agent
  )
  VALUES (
    track_id,
    COALESCE(current_user_id, anon_user_id),
    play_duration,
    completed,
    source,
    context_id,
    NULLIF(current_setting('request.headers', TRUE)::json->>'x-forwarded-for', ''),
    NULLIF(current_setting('request.headers', TRUE)::json->>'user-agent', '')
  );
  
  -- If authenticated, also add to recently played
  IF current_user_id IS NOT NULL THEN
    INSERT INTO public.user_recently_played (
      user_id,
      track_id,
      context_type,
      context_id
    )
    VALUES (
      current_user_id,
      track_id,
      source,
      context_id
    );
    
    -- Remove older entries if we have too many
    DELETE FROM public.user_recently_played
    WHERE id IN (
      SELECT id FROM public.user_recently_played
      WHERE user_id = current_user_id
      ORDER BY played_at DESC
      OFFSET 50 -- Keep only last 50 recently played tracks
    );
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.tip_artist(artist_id uuid, amount numeric, transaction_hash text, track_id uuid DEFAULT NULL::uuid, album_id uuid DEFAULT NULL::uuid, message text DEFAULT NULL::text)
 RETURNS payments
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  new_payment public.payments;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify artist exists
  IF NOT EXISTS (SELECT 1 FROM public.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Create payment record
  INSERT INTO public.payments (
    sender_id,
    recipient_id,
    amount,
    currency,
    transaction_hash,
    status,
    payment_type,
    track_id,
    album_id,
    message
  )
  VALUES (
    current_user_id,
    artist_id,
    amount,
    'SUI',
    transaction_hash,
    'completed', -- Assuming the blockchain tx is already confirmed
    'tip',
    track_id,
    album_id,
    message
  )
  RETURNING * INTO new_payment;
  
  RETURN new_payment;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.track_payment_status_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$function$
;

create or replace view "public"."track_play_counts" as  SELECT play_history.track_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    max(play_history.played_at) AS last_played_at
   FROM play_history
  GROUP BY play_history.track_id;


create or replace view "public"."tracks_with_details" as  SELECT t.id,
    t.title,
    t.artist_id,
    t.album_id,
    t.duration,
    t.audio_url,
    t.cover_url,
    t.track_number,
    t.lyrics,
    t.genre,
    t.explicit,
    t.release_date,
    t.isrc,
    t.created_at,
    t.updated_at,
    a.artist_name,
    a.verified AS artist_verified,
    al.title AS album_title,
    al.release_date AS album_release_date,
    COALESCE(pc.play_count, (0)::bigint) AS play_count,
    COALESCE(pc.unique_listeners, (0)::bigint) AS unique_listeners
   FROM (((tracks t
     JOIN artists a ON ((t.artist_id = a.id)))
     LEFT JOIN albums al ON ((t.album_id = al.id)))
     LEFT JOIN track_play_counts pc ON ((t.id = pc.track_id)));


CREATE OR REPLACE FUNCTION public.update_genre_popularity()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update popularity based on track count and play count
  UPDATE public.genres g
  SET popularity = (
    SELECT COUNT(DISTINCT t.id) * 10 + COALESCE(SUM(pc.play_count), 0) / 10
    FROM public.track_genres tg
    JOIN public.tracks t ON t.id = tg.track_id
    LEFT JOIN public.track_play_counts pc ON pc.track_id = t.id
    WHERE tg.genre_id = g.id
    GROUP BY tg.genre_id
  );
END;
$function$
;

grant delete on table "public"."album_genres" to "anon";

grant insert on table "public"."album_genres" to "anon";

grant references on table "public"."album_genres" to "anon";

grant select on table "public"."album_genres" to "anon";

grant trigger on table "public"."album_genres" to "anon";

grant truncate on table "public"."album_genres" to "anon";

grant update on table "public"."album_genres" to "anon";

grant delete on table "public"."album_genres" to "authenticated";

grant insert on table "public"."album_genres" to "authenticated";

grant references on table "public"."album_genres" to "authenticated";

grant select on table "public"."album_genres" to "authenticated";

grant trigger on table "public"."album_genres" to "authenticated";

grant truncate on table "public"."album_genres" to "authenticated";

grant update on table "public"."album_genres" to "authenticated";

grant delete on table "public"."album_genres" to "service_role";

grant insert on table "public"."album_genres" to "service_role";

grant references on table "public"."album_genres" to "service_role";

grant select on table "public"."album_genres" to "service_role";

grant trigger on table "public"."album_genres" to "service_role";

grant truncate on table "public"."album_genres" to "service_role";

grant update on table "public"."album_genres" to "service_role";

grant delete on table "public"."album_likes" to "anon";

grant insert on table "public"."album_likes" to "anon";

grant references on table "public"."album_likes" to "anon";

grant select on table "public"."album_likes" to "anon";

grant trigger on table "public"."album_likes" to "anon";

grant truncate on table "public"."album_likes" to "anon";

grant update on table "public"."album_likes" to "anon";

grant delete on table "public"."album_likes" to "authenticated";

grant insert on table "public"."album_likes" to "authenticated";

grant references on table "public"."album_likes" to "authenticated";

grant select on table "public"."album_likes" to "authenticated";

grant trigger on table "public"."album_likes" to "authenticated";

grant truncate on table "public"."album_likes" to "authenticated";

grant update on table "public"."album_likes" to "authenticated";

grant delete on table "public"."album_likes" to "service_role";

grant insert on table "public"."album_likes" to "service_role";

grant references on table "public"."album_likes" to "service_role";

grant select on table "public"."album_likes" to "service_role";

grant trigger on table "public"."album_likes" to "service_role";

grant truncate on table "public"."album_likes" to "service_role";

grant update on table "public"."album_likes" to "service_role";

grant delete on table "public"."albums" to "anon";

grant insert on table "public"."albums" to "anon";

grant references on table "public"."albums" to "anon";

grant select on table "public"."albums" to "anon";

grant trigger on table "public"."albums" to "anon";

grant truncate on table "public"."albums" to "anon";

grant update on table "public"."albums" to "anon";

grant delete on table "public"."albums" to "authenticated";

grant insert on table "public"."albums" to "authenticated";

grant references on table "public"."albums" to "authenticated";

grant select on table "public"."albums" to "authenticated";

grant trigger on table "public"."albums" to "authenticated";

grant truncate on table "public"."albums" to "authenticated";

grant update on table "public"."albums" to "authenticated";

grant delete on table "public"."albums" to "service_role";

grant insert on table "public"."albums" to "service_role";

grant references on table "public"."albums" to "service_role";

grant select on table "public"."albums" to "service_role";

grant trigger on table "public"."albums" to "service_role";

grant truncate on table "public"."albums" to "service_role";

grant update on table "public"."albums" to "service_role";

grant delete on table "public"."artist_followers" to "anon";

grant insert on table "public"."artist_followers" to "anon";

grant references on table "public"."artist_followers" to "anon";

grant select on table "public"."artist_followers" to "anon";

grant trigger on table "public"."artist_followers" to "anon";

grant truncate on table "public"."artist_followers" to "anon";

grant update on table "public"."artist_followers" to "anon";

grant delete on table "public"."artist_followers" to "authenticated";

grant insert on table "public"."artist_followers" to "authenticated";

grant references on table "public"."artist_followers" to "authenticated";

grant select on table "public"."artist_followers" to "authenticated";

grant trigger on table "public"."artist_followers" to "authenticated";

grant truncate on table "public"."artist_followers" to "authenticated";

grant update on table "public"."artist_followers" to "authenticated";

grant delete on table "public"."artist_followers" to "service_role";

grant insert on table "public"."artist_followers" to "service_role";

grant references on table "public"."artist_followers" to "service_role";

grant select on table "public"."artist_followers" to "service_role";

grant trigger on table "public"."artist_followers" to "service_role";

grant truncate on table "public"."artist_followers" to "service_role";

grant update on table "public"."artist_followers" to "service_role";

grant delete on table "public"."artist_genres" to "anon";

grant insert on table "public"."artist_genres" to "anon";

grant references on table "public"."artist_genres" to "anon";

grant select on table "public"."artist_genres" to "anon";

grant trigger on table "public"."artist_genres" to "anon";

grant truncate on table "public"."artist_genres" to "anon";

grant update on table "public"."artist_genres" to "anon";

grant delete on table "public"."artist_genres" to "authenticated";

grant insert on table "public"."artist_genres" to "authenticated";

grant references on table "public"."artist_genres" to "authenticated";

grant select on table "public"."artist_genres" to "authenticated";

grant trigger on table "public"."artist_genres" to "authenticated";

grant truncate on table "public"."artist_genres" to "authenticated";

grant update on table "public"."artist_genres" to "authenticated";

grant delete on table "public"."artist_genres" to "service_role";

grant insert on table "public"."artist_genres" to "service_role";

grant references on table "public"."artist_genres" to "service_role";

grant select on table "public"."artist_genres" to "service_role";

grant trigger on table "public"."artist_genres" to "service_role";

grant truncate on table "public"."artist_genres" to "service_role";

grant update on table "public"."artist_genres" to "service_role";

grant delete on table "public"."artists" to "anon";

grant insert on table "public"."artists" to "anon";

grant references on table "public"."artists" to "anon";

grant select on table "public"."artists" to "anon";

grant trigger on table "public"."artists" to "anon";

grant truncate on table "public"."artists" to "anon";

grant update on table "public"."artists" to "anon";

grant delete on table "public"."artists" to "authenticated";

grant insert on table "public"."artists" to "authenticated";

grant references on table "public"."artists" to "authenticated";

grant select on table "public"."artists" to "authenticated";

grant trigger on table "public"."artists" to "authenticated";

grant truncate on table "public"."artists" to "authenticated";

grant update on table "public"."artists" to "authenticated";

grant delete on table "public"."artists" to "service_role";

grant insert on table "public"."artists" to "service_role";

grant references on table "public"."artists" to "service_role";

grant select on table "public"."artists" to "service_role";

grant trigger on table "public"."artists" to "service_role";

grant truncate on table "public"."artists" to "service_role";

grant update on table "public"."artists" to "service_role";

grant delete on table "public"."genres" to "anon";

grant insert on table "public"."genres" to "anon";

grant references on table "public"."genres" to "anon";

grant select on table "public"."genres" to "anon";

grant trigger on table "public"."genres" to "anon";

grant truncate on table "public"."genres" to "anon";

grant update on table "public"."genres" to "anon";

grant delete on table "public"."genres" to "authenticated";

grant insert on table "public"."genres" to "authenticated";

grant references on table "public"."genres" to "authenticated";

grant select on table "public"."genres" to "authenticated";

grant trigger on table "public"."genres" to "authenticated";

grant truncate on table "public"."genres" to "authenticated";

grant update on table "public"."genres" to "authenticated";

grant delete on table "public"."genres" to "service_role";

grant insert on table "public"."genres" to "service_role";

grant references on table "public"."genres" to "service_role";

grant select on table "public"."genres" to "service_role";

grant trigger on table "public"."genres" to "service_role";

grant truncate on table "public"."genres" to "service_role";

grant update on table "public"."genres" to "service_role";

grant delete on table "public"."payment_status_history" to "anon";

grant insert on table "public"."payment_status_history" to "anon";

grant references on table "public"."payment_status_history" to "anon";

grant select on table "public"."payment_status_history" to "anon";

grant trigger on table "public"."payment_status_history" to "anon";

grant truncate on table "public"."payment_status_history" to "anon";

grant update on table "public"."payment_status_history" to "anon";

grant delete on table "public"."payment_status_history" to "authenticated";

grant insert on table "public"."payment_status_history" to "authenticated";

grant references on table "public"."payment_status_history" to "authenticated";

grant select on table "public"."payment_status_history" to "authenticated";

grant trigger on table "public"."payment_status_history" to "authenticated";

grant truncate on table "public"."payment_status_history" to "authenticated";

grant update on table "public"."payment_status_history" to "authenticated";

grant delete on table "public"."payment_status_history" to "service_role";

grant insert on table "public"."payment_status_history" to "service_role";

grant references on table "public"."payment_status_history" to "service_role";

grant select on table "public"."payment_status_history" to "service_role";

grant trigger on table "public"."payment_status_history" to "service_role";

grant truncate on table "public"."payment_status_history" to "service_role";

grant update on table "public"."payment_status_history" to "service_role";

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant delete on table "public"."play_history" to "anon";

grant insert on table "public"."play_history" to "anon";

grant references on table "public"."play_history" to "anon";

grant select on table "public"."play_history" to "anon";

grant trigger on table "public"."play_history" to "anon";

grant truncate on table "public"."play_history" to "anon";

grant update on table "public"."play_history" to "anon";

grant delete on table "public"."play_history" to "authenticated";

grant insert on table "public"."play_history" to "authenticated";

grant references on table "public"."play_history" to "authenticated";

grant select on table "public"."play_history" to "authenticated";

grant trigger on table "public"."play_history" to "authenticated";

grant truncate on table "public"."play_history" to "authenticated";

grant update on table "public"."play_history" to "authenticated";

grant delete on table "public"."play_history" to "service_role";

grant insert on table "public"."play_history" to "service_role";

grant references on table "public"."play_history" to "service_role";

grant select on table "public"."play_history" to "service_role";

grant trigger on table "public"."play_history" to "service_role";

grant truncate on table "public"."play_history" to "service_role";

grant update on table "public"."play_history" to "service_role";

grant delete on table "public"."playlist_likes" to "anon";

grant insert on table "public"."playlist_likes" to "anon";

grant references on table "public"."playlist_likes" to "anon";

grant select on table "public"."playlist_likes" to "anon";

grant trigger on table "public"."playlist_likes" to "anon";

grant truncate on table "public"."playlist_likes" to "anon";

grant update on table "public"."playlist_likes" to "anon";

grant delete on table "public"."playlist_likes" to "authenticated";

grant insert on table "public"."playlist_likes" to "authenticated";

grant references on table "public"."playlist_likes" to "authenticated";

grant select on table "public"."playlist_likes" to "authenticated";

grant trigger on table "public"."playlist_likes" to "authenticated";

grant truncate on table "public"."playlist_likes" to "authenticated";

grant update on table "public"."playlist_likes" to "authenticated";

grant delete on table "public"."playlist_likes" to "service_role";

grant insert on table "public"."playlist_likes" to "service_role";

grant references on table "public"."playlist_likes" to "service_role";

grant select on table "public"."playlist_likes" to "service_role";

grant trigger on table "public"."playlist_likes" to "service_role";

grant truncate on table "public"."playlist_likes" to "service_role";

grant update on table "public"."playlist_likes" to "service_role";

grant delete on table "public"."playlist_tracks" to "anon";

grant insert on table "public"."playlist_tracks" to "anon";

grant references on table "public"."playlist_tracks" to "anon";

grant select on table "public"."playlist_tracks" to "anon";

grant trigger on table "public"."playlist_tracks" to "anon";

grant truncate on table "public"."playlist_tracks" to "anon";

grant update on table "public"."playlist_tracks" to "anon";

grant delete on table "public"."playlist_tracks" to "authenticated";

grant insert on table "public"."playlist_tracks" to "authenticated";

grant references on table "public"."playlist_tracks" to "authenticated";

grant select on table "public"."playlist_tracks" to "authenticated";

grant trigger on table "public"."playlist_tracks" to "authenticated";

grant truncate on table "public"."playlist_tracks" to "authenticated";

grant update on table "public"."playlist_tracks" to "authenticated";

grant delete on table "public"."playlist_tracks" to "service_role";

grant insert on table "public"."playlist_tracks" to "service_role";

grant references on table "public"."playlist_tracks" to "service_role";

grant select on table "public"."playlist_tracks" to "service_role";

grant trigger on table "public"."playlist_tracks" to "service_role";

grant truncate on table "public"."playlist_tracks" to "service_role";

grant update on table "public"."playlist_tracks" to "service_role";

grant delete on table "public"."playlists" to "anon";

grant insert on table "public"."playlists" to "anon";

grant references on table "public"."playlists" to "anon";

grant select on table "public"."playlists" to "anon";

grant trigger on table "public"."playlists" to "anon";

grant truncate on table "public"."playlists" to "anon";

grant update on table "public"."playlists" to "anon";

grant delete on table "public"."playlists" to "authenticated";

grant insert on table "public"."playlists" to "authenticated";

grant references on table "public"."playlists" to "authenticated";

grant select on table "public"."playlists" to "authenticated";

grant trigger on table "public"."playlists" to "authenticated";

grant truncate on table "public"."playlists" to "authenticated";

grant update on table "public"."playlists" to "authenticated";

grant delete on table "public"."playlists" to "service_role";

grant insert on table "public"."playlists" to "service_role";

grant references on table "public"."playlists" to "service_role";

grant select on table "public"."playlists" to "service_role";

grant trigger on table "public"."playlists" to "service_role";

grant truncate on table "public"."playlists" to "service_role";

grant update on table "public"."playlists" to "service_role";

grant delete on table "public"."related_genres" to "anon";

grant insert on table "public"."related_genres" to "anon";

grant references on table "public"."related_genres" to "anon";

grant select on table "public"."related_genres" to "anon";

grant trigger on table "public"."related_genres" to "anon";

grant truncate on table "public"."related_genres" to "anon";

grant update on table "public"."related_genres" to "anon";

grant delete on table "public"."related_genres" to "authenticated";

grant insert on table "public"."related_genres" to "authenticated";

grant references on table "public"."related_genres" to "authenticated";

grant select on table "public"."related_genres" to "authenticated";

grant trigger on table "public"."related_genres" to "authenticated";

grant truncate on table "public"."related_genres" to "authenticated";

grant update on table "public"."related_genres" to "authenticated";

grant delete on table "public"."related_genres" to "service_role";

grant insert on table "public"."related_genres" to "service_role";

grant references on table "public"."related_genres" to "service_role";

grant select on table "public"."related_genres" to "service_role";

grant trigger on table "public"."related_genres" to "service_role";

grant truncate on table "public"."related_genres" to "service_role";

grant update on table "public"."related_genres" to "service_role";

grant delete on table "public"."track_genres" to "anon";

grant insert on table "public"."track_genres" to "anon";

grant references on table "public"."track_genres" to "anon";

grant select on table "public"."track_genres" to "anon";

grant trigger on table "public"."track_genres" to "anon";

grant truncate on table "public"."track_genres" to "anon";

grant update on table "public"."track_genres" to "anon";

grant delete on table "public"."track_genres" to "authenticated";

grant insert on table "public"."track_genres" to "authenticated";

grant references on table "public"."track_genres" to "authenticated";

grant select on table "public"."track_genres" to "authenticated";

grant trigger on table "public"."track_genres" to "authenticated";

grant truncate on table "public"."track_genres" to "authenticated";

grant update on table "public"."track_genres" to "authenticated";

grant delete on table "public"."track_genres" to "service_role";

grant insert on table "public"."track_genres" to "service_role";

grant references on table "public"."track_genres" to "service_role";

grant select on table "public"."track_genres" to "service_role";

grant trigger on table "public"."track_genres" to "service_role";

grant truncate on table "public"."track_genres" to "service_role";

grant update on table "public"."track_genres" to "service_role";

grant delete on table "public"."track_likes" to "anon";

grant insert on table "public"."track_likes" to "anon";

grant references on table "public"."track_likes" to "anon";

grant select on table "public"."track_likes" to "anon";

grant trigger on table "public"."track_likes" to "anon";

grant truncate on table "public"."track_likes" to "anon";

grant update on table "public"."track_likes" to "anon";

grant delete on table "public"."track_likes" to "authenticated";

grant insert on table "public"."track_likes" to "authenticated";

grant references on table "public"."track_likes" to "authenticated";

grant select on table "public"."track_likes" to "authenticated";

grant trigger on table "public"."track_likes" to "authenticated";

grant truncate on table "public"."track_likes" to "authenticated";

grant update on table "public"."track_likes" to "authenticated";

grant delete on table "public"."track_likes" to "service_role";

grant insert on table "public"."track_likes" to "service_role";

grant references on table "public"."track_likes" to "service_role";

grant select on table "public"."track_likes" to "service_role";

grant trigger on table "public"."track_likes" to "service_role";

grant truncate on table "public"."track_likes" to "service_role";

grant update on table "public"."track_likes" to "service_role";

grant delete on table "public"."tracks" to "anon";

grant insert on table "public"."tracks" to "anon";

grant references on table "public"."tracks" to "anon";

grant select on table "public"."tracks" to "anon";

grant trigger on table "public"."tracks" to "anon";

grant truncate on table "public"."tracks" to "anon";

grant update on table "public"."tracks" to "anon";

grant delete on table "public"."tracks" to "authenticated";

grant insert on table "public"."tracks" to "authenticated";

grant references on table "public"."tracks" to "authenticated";

grant select on table "public"."tracks" to "authenticated";

grant trigger on table "public"."tracks" to "authenticated";

grant truncate on table "public"."tracks" to "authenticated";

grant update on table "public"."tracks" to "authenticated";

grant delete on table "public"."tracks" to "service_role";

grant insert on table "public"."tracks" to "service_role";

grant references on table "public"."tracks" to "service_role";

grant select on table "public"."tracks" to "service_role";

grant trigger on table "public"."tracks" to "service_role";

grant truncate on table "public"."tracks" to "service_role";

grant update on table "public"."tracks" to "service_role";

grant delete on table "public"."user_library_albums" to "anon";

grant insert on table "public"."user_library_albums" to "anon";

grant references on table "public"."user_library_albums" to "anon";

grant select on table "public"."user_library_albums" to "anon";

grant trigger on table "public"."user_library_albums" to "anon";

grant truncate on table "public"."user_library_albums" to "anon";

grant update on table "public"."user_library_albums" to "anon";

grant delete on table "public"."user_library_albums" to "authenticated";

grant insert on table "public"."user_library_albums" to "authenticated";

grant references on table "public"."user_library_albums" to "authenticated";

grant select on table "public"."user_library_albums" to "authenticated";

grant trigger on table "public"."user_library_albums" to "authenticated";

grant truncate on table "public"."user_library_albums" to "authenticated";

grant update on table "public"."user_library_albums" to "authenticated";

grant delete on table "public"."user_library_albums" to "service_role";

grant insert on table "public"."user_library_albums" to "service_role";

grant references on table "public"."user_library_albums" to "service_role";

grant select on table "public"."user_library_albums" to "service_role";

grant trigger on table "public"."user_library_albums" to "service_role";

grant truncate on table "public"."user_library_albums" to "service_role";

grant update on table "public"."user_library_albums" to "service_role";

grant delete on table "public"."user_library_tracks" to "anon";

grant insert on table "public"."user_library_tracks" to "anon";

grant references on table "public"."user_library_tracks" to "anon";

grant select on table "public"."user_library_tracks" to "anon";

grant trigger on table "public"."user_library_tracks" to "anon";

grant truncate on table "public"."user_library_tracks" to "anon";

grant update on table "public"."user_library_tracks" to "anon";

grant delete on table "public"."user_library_tracks" to "authenticated";

grant insert on table "public"."user_library_tracks" to "authenticated";

grant references on table "public"."user_library_tracks" to "authenticated";

grant select on table "public"."user_library_tracks" to "authenticated";

grant trigger on table "public"."user_library_tracks" to "authenticated";

grant truncate on table "public"."user_library_tracks" to "authenticated";

grant update on table "public"."user_library_tracks" to "authenticated";

grant delete on table "public"."user_library_tracks" to "service_role";

grant insert on table "public"."user_library_tracks" to "service_role";

grant references on table "public"."user_library_tracks" to "service_role";

grant select on table "public"."user_library_tracks" to "service_role";

grant trigger on table "public"."user_library_tracks" to "service_role";

grant truncate on table "public"."user_library_tracks" to "service_role";

grant update on table "public"."user_library_tracks" to "service_role";

grant delete on table "public"."user_recently_played" to "anon";

grant insert on table "public"."user_recently_played" to "anon";

grant references on table "public"."user_recently_played" to "anon";

grant select on table "public"."user_recently_played" to "anon";

grant trigger on table "public"."user_recently_played" to "anon";

grant truncate on table "public"."user_recently_played" to "anon";

grant update on table "public"."user_recently_played" to "anon";

grant delete on table "public"."user_recently_played" to "authenticated";

grant insert on table "public"."user_recently_played" to "authenticated";

grant references on table "public"."user_recently_played" to "authenticated";

grant select on table "public"."user_recently_played" to "authenticated";

grant trigger on table "public"."user_recently_played" to "authenticated";

grant truncate on table "public"."user_recently_played" to "authenticated";

grant update on table "public"."user_recently_played" to "authenticated";

grant delete on table "public"."user_recently_played" to "service_role";

grant insert on table "public"."user_recently_played" to "service_role";

grant references on table "public"."user_recently_played" to "service_role";

grant select on table "public"."user_recently_played" to "service_role";

grant trigger on table "public"."user_recently_played" to "service_role";

grant truncate on table "public"."user_recently_played" to "service_role";

grant update on table "public"."user_recently_played" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Album genres are viewable by everyone"
on "public"."album_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their album genres"
on "public"."album_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM albums
  WHERE ((albums.id = album_genres.album_id) AND (albums.artist_id = auth.uid())))));


create policy "Album likes are viewable by everyone"
on "public"."album_likes"
as permissive
for select
to public
using (true);


create policy "Users can like albums"
on "public"."album_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike albums"
on "public"."album_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Albums are viewable by everyone"
on "public"."albums"
as permissive
for select
to public
using (true);


create policy "Artists can create their own albums"
on "public"."albums"
as permissive
for insert
to public
with check (((auth.uid() = artist_id) AND (EXISTS ( SELECT 1
   FROM artists
  WHERE ((artists.id = auth.uid()) AND (artists.approved = true))))));


create policy "Artists can delete their own albums"
on "public"."albums"
as permissive
for delete
to public
using ((auth.uid() = artist_id));


create policy "Artists can update their own albums"
on "public"."albums"
as permissive
for update
to public
using ((auth.uid() = artist_id));


create policy "Artist followers are viewable by everyone"
on "public"."artist_followers"
as permissive
for select
to public
using (true);


create policy "Users can follow artists"
on "public"."artist_followers"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unfollow artists"
on "public"."artist_followers"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Artist genres are viewable by everyone"
on "public"."artist_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their own genres"
on "public"."artist_genres"
as permissive
for all
to public
using ((artist_id = auth.uid()));


create policy "Artists are viewable by everyone"
on "public"."artists"
as permissive
for select
to public
using (true);


create policy "Artists can update their own profiles"
on "public"."artists"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can apply to become artists"
on "public"."artists"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Admins can manage genres"
on "public"."genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Genres are viewable by everyone"
on "public"."genres"
as permissive
for select
to public
using (true);


create policy "Admins can access payment history"
on "public"."payment_status_history"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Artists can see their own payment history"
on "public"."payment_status_history"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM payments p
  WHERE ((p.id = payment_status_history.payment_id) AND (p.recipient_id = auth.uid())))));


create policy "Users can create payments"
on "public"."payments"
as permissive
for insert
to public
with check ((auth.uid() = sender_id));


create policy "Users can view their own payments"
on "public"."payments"
as permissive
for select
to public
using (((auth.uid() = sender_id) OR (auth.uid() = recipient_id)));


create policy "Artists can view play history for their tracks"
on "public"."play_history"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM tracks
  WHERE ((tracks.id = play_history.track_id) AND (tracks.artist_id = auth.uid())))));


create policy "Users can record plays"
on "public"."play_history"
as permissive
for insert
to public
with check (true);


create policy "Users can view their own play history"
on "public"."play_history"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Playlist likes are viewable by everyone"
on "public"."playlist_likes"
as permissive
for select
to public
using (true);


create policy "Users can like playlists"
on "public"."playlist_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike playlists"
on "public"."playlist_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can add tracks to their own playlists"
on "public"."playlist_tracks"
as permissive
for insert
to public
with check (((EXISTS ( SELECT 1
   FROM playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND (playlists.user_id = auth.uid())))) AND (added_by = auth.uid())));


create policy "Users can delete tracks from their own playlists"
on "public"."playlist_tracks"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND (playlists.user_id = auth.uid())))));


create policy "Users can view tracks in playlists they can access"
on "public"."playlist_tracks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND ((playlists.is_public = true) OR (playlists.user_id = auth.uid()))))));


create policy "Public playlists are viewable by everyone"
on "public"."playlists"
as permissive
for select
to public
using (((is_public = true) OR (auth.uid() = user_id)));


create policy "Users can create their own playlists"
on "public"."playlists"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own playlists"
on "public"."playlists"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own playlists"
on "public"."playlists"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Admins can manage related genres"
on "public"."related_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Everyone can view related genres"
on "public"."related_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their track genres"
on "public"."track_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM tracks
  WHERE ((tracks.id = track_genres.track_id) AND (tracks.artist_id = auth.uid())))));


create policy "Track genres are viewable by everyone"
on "public"."track_genres"
as permissive
for select
to public
using (true);


create policy "Track likes are viewable by everyone"
on "public"."track_likes"
as permissive
for select
to public
using (true);


create policy "Users can like tracks"
on "public"."track_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike tracks"
on "public"."track_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Artists can create their own tracks"
on "public"."tracks"
as permissive
for insert
to public
with check (((auth.uid() = artist_id) AND (EXISTS ( SELECT 1
   FROM artists
  WHERE ((artists.id = auth.uid()) AND (artists.approved = true))))));


create policy "Artists can delete their own tracks"
on "public"."tracks"
as permissive
for delete
to public
using ((auth.uid() = artist_id));


create policy "Artists can update their own tracks"
on "public"."tracks"
as permissive
for update
to public
using ((auth.uid() = artist_id));


create policy "Tracks are viewable by everyone"
on "public"."tracks"
as permissive
for select
to public
using (true);


create policy "Users can add albums to their library"
on "public"."user_library_albums"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can remove albums from their library"
on "public"."user_library_albums"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can view their own album library"
on "public"."user_library_albums"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can add tracks to their library"
on "public"."user_library_tracks"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can remove tracks from their library"
on "public"."user_library_tracks"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can view their own track library"
on "public"."user_library_tracks"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can add to recently played"
on "public"."user_recently_played"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their recently played tracks"
on "public"."user_recently_played"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own settings"
on "public"."user_settings"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own settings"
on "public"."user_settings"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own settings"
on "public"."user_settings"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users are viewable by everyone"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Users can update their own information"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id));


CREATE TRIGGER set_album_updated_at BEFORE UPDATE ON public.albums FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_artist_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_genres_updated_at BEFORE UPDATE ON public.genres FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_payment_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER track_payment_status AFTER UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION track_payment_status_changes();

CREATE TRIGGER set_playlist_updated_at BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_track_updated_at BEFORE UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_user_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION set_updated_at();


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION auth.handle_email_confirmation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.users
  SET email_verified = TRUE
  WHERE id = NEW.id AND NEW.email_confirmed_at IS NOT NULL;
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION auth.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.users (
    id, 
    username,
    email,
    display_name,
    email_verified
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 6)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email_confirmed_at IS NOT NULL
  );
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.handle_new_user();

CREATE TRIGGER on_email_confirmation AFTER UPDATE OF email_confirmed_at ON auth.users FOR EACH ROW EXECUTE FUNCTION auth.handle_email_confirmation();


