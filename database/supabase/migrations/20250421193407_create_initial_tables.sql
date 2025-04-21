create schema if not exists "prettygood";

create table "prettygood"."album_genres" (
    "album_id" uuid not null,
    "genre_id" uuid not null
);


alter table "prettygood"."album_genres" enable row level security;

create table "prettygood"."album_likes" (
    "album_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "prettygood"."album_likes" enable row level security;

create table "prettygood"."albums" (
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


alter table "prettygood"."albums" enable row level security;

create table "prettygood"."artist_followers" (
    "artist_id" uuid not null,
    "user_id" uuid not null,
    "followed_at" timestamp with time zone not null default now()
);


alter table "prettygood"."artist_followers" enable row level security;

create table "prettygood"."artist_genres" (
    "artist_id" uuid not null,
    "genre_id" uuid not null
);


alter table "prettygood"."artist_genres" enable row level security;

create table "prettygood"."artists" (
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


alter table "prettygood"."artists" enable row level security;

create table "prettygood"."genres" (
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


alter table "prettygood"."genres" enable row level security;

create table "prettygood"."payment_status_history" (
    "id" uuid not null default uuid_generate_v4(),
    "payment_id" uuid not null,
    "old_status" text,
    "new_status" text not null,
    "notes" text,
    "changed_at" timestamp with time zone not null default now(),
    "changed_by" text not null default 'system'::text
);


alter table "prettygood"."payment_status_history" enable row level security;

create table "prettygood"."payments" (
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


alter table "prettygood"."payments" enable row level security;

create table "prettygood"."play_history" (
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


alter table "prettygood"."play_history" enable row level security;

create table "prettygood"."playlist_likes" (
    "playlist_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "prettygood"."playlist_likes" enable row level security;

create table "prettygood"."playlist_tracks" (
    "playlist_id" uuid not null,
    "track_id" uuid not null,
    "added_by" uuid not null,
    "added_at" timestamp with time zone not null default now(),
    "position" integer not null
);


alter table "prettygood"."playlist_tracks" enable row level security;

create table "prettygood"."playlists" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "user_id" uuid not null,
    "cover_url" text,
    "is_public" boolean default true,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "prettygood"."playlists" enable row level security;

create table "prettygood"."related_genres" (
    "genre_id" uuid not null,
    "related_genre_id" uuid not null,
    "weight" integer default 1
);


alter table "prettygood"."related_genres" enable row level security;

create table "prettygood"."track_genres" (
    "track_id" uuid not null,
    "genre_id" uuid not null
);


alter table "prettygood"."track_genres" enable row level security;

create table "prettygood"."track_likes" (
    "track_id" uuid not null,
    "user_id" uuid not null,
    "liked_at" timestamp with time zone not null default now()
);


alter table "prettygood"."track_likes" enable row level security;

create table "prettygood"."tracks" (
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


alter table "prettygood"."tracks" enable row level security;

create table "prettygood"."user_library_albums" (
    "user_id" uuid not null,
    "album_id" uuid not null,
    "added_at" timestamp with time zone not null default now()
);


alter table "prettygood"."user_library_albums" enable row level security;

create table "prettygood"."user_library_tracks" (
    "user_id" uuid not null,
    "track_id" uuid not null,
    "added_at" timestamp with time zone not null default now()
);


alter table "prettygood"."user_library_tracks" enable row level security;

create table "prettygood"."user_recently_played" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "track_id" uuid not null,
    "played_at" timestamp with time zone not null default now(),
    "context_type" text,
    "context_id" uuid
);


alter table "prettygood"."user_recently_played" enable row level security;

create table "prettygood"."user_settings" (
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


alter table "prettygood"."user_settings" enable row level security;

create table "prettygood"."users" (
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


alter table "prettygood"."users" enable row level security;

CREATE UNIQUE INDEX album_genres_pkey ON prettygood.album_genres USING btree (album_id, genre_id);

CREATE UNIQUE INDEX album_likes_pkey ON prettygood.album_likes USING btree (album_id, user_id);

CREATE UNIQUE INDEX albums_pkey ON prettygood.albums USING btree (id);

CREATE UNIQUE INDEX artist_followers_pkey ON prettygood.artist_followers USING btree (artist_id, user_id);

CREATE UNIQUE INDEX artist_genres_pkey ON prettygood.artist_genres USING btree (artist_id, genre_id);

CREATE UNIQUE INDEX artists_pkey ON prettygood.artists USING btree (id);

CREATE UNIQUE INDEX genres_name_key ON prettygood.genres USING btree (name);

CREATE UNIQUE INDEX genres_pkey ON prettygood.genres USING btree (id);

CREATE UNIQUE INDEX genres_slug_key ON prettygood.genres USING btree (slug);

CREATE INDEX idx_album_genres_genre_id ON prettygood.album_genres USING btree (genre_id);

CREATE INDEX idx_album_likes_user_id ON prettygood.album_likes USING btree (user_id);

CREATE INDEX idx_albums_artist_id ON prettygood.albums USING btree (artist_id);

CREATE INDEX idx_albums_cover_url ON prettygood.albums USING btree (cover_url);

CREATE INDEX idx_albums_genre ON prettygood.albums USING gin (genre);

CREATE INDEX idx_albums_release_date ON prettygood.albums USING btree (release_date);

CREATE INDEX idx_albums_title ON prettygood.albums USING btree (title);

CREATE INDEX idx_artist_followers_user_id ON prettygood.artist_followers USING btree (user_id);

CREATE INDEX idx_artist_genres_genre_id ON prettygood.artist_genres USING btree (genre_id);

CREATE INDEX idx_artists_genre ON prettygood.artists USING gin (genre);

CREATE INDEX idx_artists_name ON prettygood.artists USING btree (artist_name);

CREATE INDEX idx_genres_name ON prettygood.genres USING btree (name);

CREATE INDEX idx_genres_popularity ON prettygood.genres USING btree (popularity);

CREATE INDEX idx_genres_slug ON prettygood.genres USING btree (slug);

CREATE INDEX idx_payment_status_history_payment_id ON prettygood.payment_status_history USING btree (payment_id);

CREATE INDEX idx_payments_album_id ON prettygood.payments USING btree (album_id);

CREATE INDEX idx_payments_created_at ON prettygood.payments USING btree (created_at);

CREATE INDEX idx_payments_recipient_id ON prettygood.payments USING btree (recipient_id);

CREATE INDEX idx_payments_sender_id ON prettygood.payments USING btree (sender_id);

CREATE INDEX idx_payments_status ON prettygood.payments USING btree (status);

CREATE INDEX idx_payments_track_id ON prettygood.payments USING btree (track_id);

CREATE INDEX idx_play_history_played_at ON prettygood.play_history USING btree (played_at);

CREATE INDEX idx_play_history_track_id ON prettygood.play_history USING btree (track_id);

CREATE INDEX idx_play_history_user_id ON prettygood.play_history USING btree (user_id);

CREATE INDEX idx_playlist_likes_user_id ON prettygood.playlist_likes USING btree (user_id);

CREATE INDEX idx_playlist_tracks_added_by ON prettygood.playlist_tracks USING btree (added_by);

CREATE INDEX idx_playlist_tracks_position ON prettygood.playlist_tracks USING btree ("position");

CREATE INDEX idx_playlist_tracks_track_id ON prettygood.playlist_tracks USING btree (track_id);

CREATE INDEX idx_playlists_cover_url ON prettygood.playlists USING btree (cover_url);

CREATE INDEX idx_playlists_name ON prettygood.playlists USING btree (name);

CREATE INDEX idx_playlists_user_id ON prettygood.playlists USING btree (user_id);

CREATE INDEX idx_track_genres_genre_id ON prettygood.track_genres USING btree (genre_id);

CREATE INDEX idx_track_likes_user_id ON prettygood.track_likes USING btree (user_id);

CREATE INDEX idx_tracks_album_id ON prettygood.tracks USING btree (album_id);

CREATE INDEX idx_tracks_artist_id ON prettygood.tracks USING btree (artist_id);

CREATE INDEX idx_tracks_cover_url ON prettygood.tracks USING btree (cover_url);

CREATE INDEX idx_tracks_genre ON prettygood.tracks USING gin (genre);

CREATE INDEX idx_tracks_title ON prettygood.tracks USING btree (title);

CREATE INDEX idx_user_library_albums_album_id ON prettygood.user_library_albums USING btree (album_id);

CREATE INDEX idx_user_library_tracks_track_id ON prettygood.user_library_tracks USING btree (track_id);

CREATE INDEX idx_user_recently_played_context_id ON prettygood.user_recently_played USING btree (context_id);

CREATE INDEX idx_user_recently_played_played_at ON prettygood.user_recently_played USING btree (played_at);

CREATE INDEX idx_user_recently_played_track_id ON prettygood.user_recently_played USING btree (track_id);

CREATE INDEX idx_user_recently_played_user_id ON prettygood.user_recently_played USING btree (user_id);

CREATE INDEX idx_users_profile_url ON prettygood.users USING btree (profile_url);

CREATE INDEX idx_users_username ON prettygood.users USING btree (username);

CREATE INDEX idx_users_wallet_address ON prettygood.users USING btree (wallet_address);

CREATE UNIQUE INDEX payment_status_history_pkey ON prettygood.payment_status_history USING btree (id);

CREATE UNIQUE INDEX payments_pkey ON prettygood.payments USING btree (id);

CREATE UNIQUE INDEX payments_transaction_hash_key ON prettygood.payments USING btree (transaction_hash);

CREATE UNIQUE INDEX play_history_pkey ON prettygood.play_history USING btree (id);

CREATE UNIQUE INDEX playlist_likes_pkey ON prettygood.playlist_likes USING btree (playlist_id, user_id);

CREATE UNIQUE INDEX playlist_tracks_pkey ON prettygood.playlist_tracks USING btree (playlist_id, track_id);

CREATE UNIQUE INDEX playlists_pkey ON prettygood.playlists USING btree (id);

CREATE UNIQUE INDEX related_genres_pkey ON prettygood.related_genres USING btree (genre_id, related_genre_id);

CREATE UNIQUE INDEX track_genres_pkey ON prettygood.track_genres USING btree (track_id, genre_id);

CREATE UNIQUE INDEX track_likes_pkey ON prettygood.track_likes USING btree (track_id, user_id);

CREATE UNIQUE INDEX tracks_pkey ON prettygood.tracks USING btree (id);

CREATE UNIQUE INDEX user_library_albums_pkey ON prettygood.user_library_albums USING btree (user_id, album_id);

CREATE UNIQUE INDEX user_library_tracks_pkey ON prettygood.user_library_tracks USING btree (user_id, track_id);

CREATE UNIQUE INDEX user_recently_played_pkey ON prettygood.user_recently_played USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON prettygood.user_settings USING btree (user_id);

CREATE UNIQUE INDEX users_email_key ON prettygood.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON prettygood.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON prettygood.users USING btree (username);

CREATE UNIQUE INDEX users_wallet_address_key ON prettygood.users USING btree (wallet_address);

alter table "prettygood"."album_genres" add constraint "album_genres_pkey" PRIMARY KEY using index "album_genres_pkey";

alter table "prettygood"."album_likes" add constraint "album_likes_pkey" PRIMARY KEY using index "album_likes_pkey";

alter table "prettygood"."albums" add constraint "albums_pkey" PRIMARY KEY using index "albums_pkey";

alter table "prettygood"."artist_followers" add constraint "artist_followers_pkey" PRIMARY KEY using index "artist_followers_pkey";

alter table "prettygood"."artist_genres" add constraint "artist_genres_pkey" PRIMARY KEY using index "artist_genres_pkey";

alter table "prettygood"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "prettygood"."genres" add constraint "genres_pkey" PRIMARY KEY using index "genres_pkey";

alter table "prettygood"."payment_status_history" add constraint "payment_status_history_pkey" PRIMARY KEY using index "payment_status_history_pkey";

alter table "prettygood"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "prettygood"."play_history" add constraint "play_history_pkey" PRIMARY KEY using index "play_history_pkey";

alter table "prettygood"."playlist_likes" add constraint "playlist_likes_pkey" PRIMARY KEY using index "playlist_likes_pkey";

alter table "prettygood"."playlist_tracks" add constraint "playlist_tracks_pkey" PRIMARY KEY using index "playlist_tracks_pkey";

alter table "prettygood"."playlists" add constraint "playlists_pkey" PRIMARY KEY using index "playlists_pkey";

alter table "prettygood"."related_genres" add constraint "related_genres_pkey" PRIMARY KEY using index "related_genres_pkey";

alter table "prettygood"."track_genres" add constraint "track_genres_pkey" PRIMARY KEY using index "track_genres_pkey";

alter table "prettygood"."track_likes" add constraint "track_likes_pkey" PRIMARY KEY using index "track_likes_pkey";

alter table "prettygood"."tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "prettygood"."user_library_albums" add constraint "user_library_albums_pkey" PRIMARY KEY using index "user_library_albums_pkey";

alter table "prettygood"."user_library_tracks" add constraint "user_library_tracks_pkey" PRIMARY KEY using index "user_library_tracks_pkey";

alter table "prettygood"."user_recently_played" add constraint "user_recently_played_pkey" PRIMARY KEY using index "user_recently_played_pkey";

alter table "prettygood"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "prettygood"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "prettygood"."album_genres" add constraint "album_genres_album_id_fkey" FOREIGN KEY (album_id) REFERENCES prettygood.albums(id) ON DELETE CASCADE not valid;

alter table "prettygood"."album_genres" validate constraint "album_genres_album_id_fkey";

alter table "prettygood"."album_genres" add constraint "album_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES prettygood.genres(id) ON DELETE CASCADE not valid;

alter table "prettygood"."album_genres" validate constraint "album_genres_genre_id_fkey";

alter table "prettygood"."album_likes" add constraint "album_likes_album_id_fkey" FOREIGN KEY (album_id) REFERENCES prettygood.albums(id) ON DELETE CASCADE not valid;

alter table "prettygood"."album_likes" validate constraint "album_likes_album_id_fkey";

alter table "prettygood"."album_likes" add constraint "album_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."album_likes" validate constraint "album_likes_user_id_fkey";

alter table "prettygood"."albums" add constraint "albums_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES prettygood.artists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."albums" validate constraint "albums_artist_id_fkey";

alter table "prettygood"."albums" add constraint "albums_type_check" CHECK ((type = ANY (ARRAY['album'::text, 'ep'::text, 'single'::text, 'compilation'::text]))) not valid;

alter table "prettygood"."albums" validate constraint "albums_type_check";

alter table "prettygood"."artist_followers" add constraint "artist_followers_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES prettygood.artists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."artist_followers" validate constraint "artist_followers_artist_id_fkey";

alter table "prettygood"."artist_followers" add constraint "artist_followers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."artist_followers" validate constraint "artist_followers_user_id_fkey";

alter table "prettygood"."artist_genres" add constraint "artist_genres_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES prettygood.artists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."artist_genres" validate constraint "artist_genres_artist_id_fkey";

alter table "prettygood"."artist_genres" add constraint "artist_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES prettygood.genres(id) ON DELETE CASCADE not valid;

alter table "prettygood"."artist_genres" validate constraint "artist_genres_genre_id_fkey";

alter table "prettygood"."artists" add constraint "artists_id_fkey" FOREIGN KEY (id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."artists" validate constraint "artists_id_fkey";

alter table "prettygood"."genres" add constraint "genres_name_key" UNIQUE using index "genres_name_key";

alter table "prettygood"."genres" add constraint "genres_slug_key" UNIQUE using index "genres_slug_key";

alter table "prettygood"."payment_status_history" add constraint "payment_status_history_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES prettygood.payments(id) ON DELETE CASCADE not valid;

alter table "prettygood"."payment_status_history" validate constraint "payment_status_history_payment_id_fkey";

alter table "prettygood"."payments" add constraint "payments_album_id_fkey" FOREIGN KEY (album_id) REFERENCES prettygood.albums(id) ON DELETE SET NULL not valid;

alter table "prettygood"."payments" validate constraint "payments_album_id_fkey";

alter table "prettygood"."payments" add constraint "payments_payment_type_check" CHECK ((payment_type = ANY (ARRAY['tip'::text, 'subscription'::text, 'purchase'::text]))) not valid;

alter table "prettygood"."payments" validate constraint "payments_payment_type_check";

alter table "prettygood"."payments" add constraint "payments_recipient_id_fkey" FOREIGN KEY (recipient_id) REFERENCES prettygood.artists(id) ON DELETE SET NULL not valid;

alter table "prettygood"."payments" validate constraint "payments_recipient_id_fkey";

alter table "prettygood"."payments" add constraint "payments_sender_id_fkey" FOREIGN KEY (sender_id) REFERENCES prettygood.users(id) ON DELETE SET NULL not valid;

alter table "prettygood"."payments" validate constraint "payments_sender_id_fkey";

alter table "prettygood"."payments" add constraint "payments_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "prettygood"."payments" validate constraint "payments_status_check";

alter table "prettygood"."payments" add constraint "payments_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE SET NULL not valid;

alter table "prettygood"."payments" validate constraint "payments_track_id_fkey";

alter table "prettygood"."payments" add constraint "payments_transaction_hash_key" UNIQUE using index "payments_transaction_hash_key";

alter table "prettygood"."play_history" add constraint "play_history_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."play_history" validate constraint "play_history_track_id_fkey";

alter table "prettygood"."play_history" add constraint "play_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."play_history" validate constraint "play_history_user_id_fkey";

alter table "prettygood"."playlist_likes" add constraint "playlist_likes_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES prettygood.playlists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."playlist_likes" validate constraint "playlist_likes_playlist_id_fkey";

alter table "prettygood"."playlist_likes" add constraint "playlist_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."playlist_likes" validate constraint "playlist_likes_user_id_fkey";

alter table "prettygood"."playlist_tracks" add constraint "playlist_tracks_added_by_fkey" FOREIGN KEY (added_by) REFERENCES prettygood.users(id) ON DELETE SET NULL not valid;

alter table "prettygood"."playlist_tracks" validate constraint "playlist_tracks_added_by_fkey";

alter table "prettygood"."playlist_tracks" add constraint "playlist_tracks_playlist_id_fkey" FOREIGN KEY (playlist_id) REFERENCES prettygood.playlists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."playlist_tracks" validate constraint "playlist_tracks_playlist_id_fkey";

alter table "prettygood"."playlist_tracks" add constraint "playlist_tracks_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."playlist_tracks" validate constraint "playlist_tracks_track_id_fkey";

alter table "prettygood"."playlists" add constraint "playlists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."playlists" validate constraint "playlists_user_id_fkey";

alter table "prettygood"."related_genres" add constraint "related_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES prettygood.genres(id) ON DELETE CASCADE not valid;

alter table "prettygood"."related_genres" validate constraint "related_genres_genre_id_fkey";

alter table "prettygood"."related_genres" add constraint "related_genres_related_genre_id_fkey" FOREIGN KEY (related_genre_id) REFERENCES prettygood.genres(id) ON DELETE CASCADE not valid;

alter table "prettygood"."related_genres" validate constraint "related_genres_related_genre_id_fkey";

alter table "prettygood"."track_genres" add constraint "track_genres_genre_id_fkey" FOREIGN KEY (genre_id) REFERENCES prettygood.genres(id) ON DELETE CASCADE not valid;

alter table "prettygood"."track_genres" validate constraint "track_genres_genre_id_fkey";

alter table "prettygood"."track_genres" add constraint "track_genres_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."track_genres" validate constraint "track_genres_track_id_fkey";

alter table "prettygood"."track_likes" add constraint "track_likes_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."track_likes" validate constraint "track_likes_track_id_fkey";

alter table "prettygood"."track_likes" add constraint "track_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."track_likes" validate constraint "track_likes_user_id_fkey";

alter table "prettygood"."tracks" add constraint "tracks_album_id_fkey" FOREIGN KEY (album_id) REFERENCES prettygood.albums(id) ON DELETE SET NULL not valid;

alter table "prettygood"."tracks" validate constraint "tracks_album_id_fkey";

alter table "prettygood"."tracks" add constraint "tracks_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES prettygood.artists(id) ON DELETE CASCADE not valid;

alter table "prettygood"."tracks" validate constraint "tracks_artist_id_fkey";

alter table "prettygood"."user_library_albums" add constraint "user_library_albums_album_id_fkey" FOREIGN KEY (album_id) REFERENCES prettygood.albums(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_library_albums" validate constraint "user_library_albums_album_id_fkey";

alter table "prettygood"."user_library_albums" add constraint "user_library_albums_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_library_albums" validate constraint "user_library_albums_user_id_fkey";

alter table "prettygood"."user_library_tracks" add constraint "user_library_tracks_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_library_tracks" validate constraint "user_library_tracks_track_id_fkey";

alter table "prettygood"."user_library_tracks" add constraint "user_library_tracks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_library_tracks" validate constraint "user_library_tracks_user_id_fkey";

alter table "prettygood"."user_recently_played" add constraint "user_recently_played_track_id_fkey" FOREIGN KEY (track_id) REFERENCES prettygood.tracks(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_recently_played" validate constraint "user_recently_played_track_id_fkey";

alter table "prettygood"."user_recently_played" add constraint "user_recently_played_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_recently_played" validate constraint "user_recently_played_user_id_fkey";

alter table "prettygood"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES prettygood.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "prettygood"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "prettygood"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "prettygood"."users" validate constraint "users_id_fkey";

alter table "prettygood"."users" add constraint "users_username_key" UNIQUE using index "users_username_key";

alter table "prettygood"."users" add constraint "users_wallet_address_key" UNIQUE using index "users_wallet_address_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION prettygood.add_album_to_library(album_id uuid)
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
  INSERT INTO prettygood.user_library_albums (
    user_id,
    album_id
  )
  VALUES (
    current_user_id,
    album_id
  )
  ON CONFLICT (user_id, album_id) DO NOTHING;
  
  -- Also add all tracks from the album to library (will be populated when tracks are created)
  INSERT INTO prettygood.user_library_tracks (
    user_id,
    track_id
  )
  SELECT 
    current_user_id,
    id
  FROM 
    prettygood.tracks
  WHERE 
    album_id = add_album_to_library.album_id
  ON CONFLICT (user_id, track_id) DO NOTHING;
  
  RETURN TRUE;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.add_track_to_library(track_id uuid)
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
  INSERT INTO prettygood.user_library_tracks (
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

CREATE OR REPLACE FUNCTION prettygood.add_track_to_playlist(playlist_id uuid, track_id uuid)
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
    SELECT 1 FROM prettygood.playlists
    WHERE id = playlist_id
    AND user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'Playlist not found or no permission to add tracks';
  END IF;
  
  -- Get the maximum position in the playlist
  SELECT COALESCE(MAX(position), 0) INTO max_position
  FROM prettygood.playlist_tracks
  WHERE playlist_id = add_track_to_playlist.playlist_id;
  
  -- Add track to playlist
  INSERT INTO prettygood.playlist_tracks (
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

create or replace view "prettygood"."album_play_counts" as  SELECT tracks.album_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    count(DISTINCT play_history.track_id) AS tracks_played,
    max(play_history.played_at) AS last_played_at
   FROM (prettygood.play_history
     JOIN prettygood.tracks ON ((play_history.track_id = tracks.id)))
  WHERE (tracks.album_id IS NOT NULL)
  GROUP BY tracks.album_id;


CREATE OR REPLACE FUNCTION prettygood.apply_for_artist_account(artist_name text, bio text DEFAULT NULL::text, genre text[] DEFAULT '{}'::text[], location text DEFAULT NULL::text, website text DEFAULT NULL::text, social_links jsonb DEFAULT NULL::jsonb, application_notes text DEFAULT NULL::text)
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
  IF EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'User is already registered as an artist';
  END IF;
  
  -- Create pending artist application
  INSERT INTO prettygood.artists (
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
  UPDATE prettygood.users 
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

CREATE OR REPLACE FUNCTION prettygood.approve_artist_application(artist_id uuid, approved boolean, admin_notes text DEFAULT NULL::text)
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
  SELECT role INTO current_user_role FROM prettygood.users WHERE id = current_user_id;
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Administrator privileges required';
  END IF;
  
  -- Check if artist record exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Update artist approval status
  UPDATE prettygood.artists
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
    UPDATE prettygood.users
    SET role = 'artist'
    WHERE id = artist_id;
  ELSE
    UPDATE prettygood.users
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

create or replace view "prettygood"."artist_play_counts" as  SELECT tracks.artist_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    count(DISTINCT play_history.track_id) AS tracks_played,
    max(play_history.played_at) AS last_played_at
   FROM (prettygood.play_history
     JOIN prettygood.tracks ON ((play_history.track_id = tracks.id)))
  GROUP BY tracks.artist_id;


CREATE OR REPLACE FUNCTION prettygood.create_playlist(name text, description text DEFAULT NULL::text, is_public boolean DEFAULT true)
 RETURNS prettygood.playlists
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  new_playlist prettygood.playlists;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Create playlist
  INSERT INTO prettygood.playlists (
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

CREATE OR REPLACE FUNCTION prettygood.create_track(title text, duration integer, audio_url text, album_id uuid DEFAULT NULL::uuid, cover_url text DEFAULT NULL::text, track_number integer DEFAULT NULL::integer, lyrics text DEFAULT NULL::text, genre text[] DEFAULT '{}'::text[], explicit boolean DEFAULT false, release_date date DEFAULT NULL::date, isrc text DEFAULT NULL::text)
 RETURNS prettygood.tracks
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  artist_id UUID := auth.uid();
  new_track prettygood.tracks;
BEGIN
  -- Verify authentication
  IF artist_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify user is an approved artist
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id AND approved = TRUE) THEN
    RAISE EXCEPTION 'User must be an approved artist to create tracks';
  END IF;
  
  -- Verify album exists if provided and belongs to artist
  IF album_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM prettygood.albums 
    WHERE id = album_id AND artist_id = create_track.artist_id
  ) THEN
    RAISE EXCEPTION 'Album not found or does not belong to artist';
  END IF;
  
  -- Create track
  INSERT INTO prettygood.tracks (
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

CREATE OR REPLACE FUNCTION prettygood.get_albums_by_genre(p_genre_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS SETOF prettygood.albums
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.albums a
  JOIN prettygood.album_genres ag ON ag.album_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.get_artist_payment_stats(time_period text DEFAULT 'all_time'::text)
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
  
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = current_user_id) THEN
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
    prettygood.payments p
  WHERE 
    p.recipient_id = current_user_id
    AND p.status = 'completed'
    AND p.created_at >= start_date
  GROUP BY 
    p.payment_type;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.get_artists_by_genre(p_genre_id uuid, p_limit integer DEFAULT 20, p_offset integer DEFAULT 0)
 RETURNS SETOF prettygood.artists
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT a.*
  FROM prettygood.artists a
  JOIN prettygood.artist_genres ag ON ag.artist_id = a.id
  WHERE ag.genre_id = p_genre_id
  ORDER BY a.artist_name
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.get_monthly_payment_trends(months_back integer DEFAULT 12)
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
  
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = current_user_id) THEN
    RAISE EXCEPTION 'User must be an artist to view payment statistics';
  END IF;
  
  -- Return monthly trends
  RETURN QUERY
  SELECT 
    TO_CHAR(p.created_at, 'YYYY-MM') as month,
    SUM(p.amount) as total_amount,
    COUNT(*)::BIGINT as payment_count
  FROM 
    prettygood.payments p
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

CREATE OR REPLACE FUNCTION prettygood.get_popular_genres(p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_limit integer DEFAULT 10)
 RETURNS SETOF prettygood.genres
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH popular_genres AS (
    -- Count plays for tracks in each genre during the specified period
    SELECT g.id, g.name, COUNT(*) as play_count
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg ON tg.genre_id = g.id
    JOIN prettygood.play_history ph ON ph.track_id = tg.track_id
    WHERE ph.played_at BETWEEN p_start_date AND p_end_date
    GROUP BY g.id, g.name
    ORDER BY play_count DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN popular_genres pg ON pg.id = g.id
  ORDER BY pg.play_count DESC
  LIMIT p_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.get_related_genres(p_genre_id uuid, p_limit integer DEFAULT 5)
 RETURNS SETOF prettygood.genres
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH track_counts AS (
    -- Count tracks that share genres with the input genre
    SELECT g.id, g.name, COUNT(*) as common_tracks
    FROM prettygood.genres g
    JOIN prettygood.track_genres tg1 ON tg1.genre_id = g.id
    JOIN prettygood.track_genres tg2 ON tg2.track_id = tg1.track_id
    WHERE tg2.genre_id = p_genre_id
    AND g.id != p_genre_id
    GROUP BY g.id, g.name
    ORDER BY common_tracks DESC
  )
  SELECT g.*
  FROM prettygood.genres g
  JOIN track_counts tc ON tc.id = g.id
  ORDER BY tc.common_tracks DESC
  LIMIT p_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.get_tracks_by_genre(p_genre_id uuid, p_limit integer DEFAULT 50, p_offset integer DEFAULT 0)
 RETURNS SETOF prettygood.tracks
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT t.*
  FROM prettygood.tracks t
  JOIN prettygood.track_genres tg ON tg.track_id = t.id
  WHERE tg.genre_id = p_genre_id
  ORDER BY t.release_date DESC NULLS LAST
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.record_play(track_id uuid, play_duration integer DEFAULT NULL::integer, completed boolean DEFAULT false, source text DEFAULT NULL::text, context_id uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  anon_user_id UUID := '00000000-0000-0000-0000-000000000000'::UUID;
BEGIN
  -- Verify track exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.tracks WHERE id = track_id) THEN
    RAISE EXCEPTION 'Track not found';
  END IF;

  -- Insert play history record (even if not authenticated)
  INSERT INTO prettygood.play_history (
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
    INSERT INTO prettygood.user_recently_played (
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
    DELETE FROM prettygood.user_recently_played
    WHERE id IN (
      SELECT id FROM prettygood.user_recently_played
      WHERE user_id = current_user_id
      ORDER BY played_at DESC
      OFFSET 50 -- Keep only last 50 recently played tracks
    );
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION prettygood.tip_artist(artist_id uuid, amount numeric, transaction_hash text, track_id uuid DEFAULT NULL::uuid, album_id uuid DEFAULT NULL::uuid, message text DEFAULT NULL::text)
 RETURNS prettygood.payments
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  current_user_id UUID := auth.uid();
  new_payment prettygood.payments;
BEGIN
  -- Check authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Verify artist exists
  IF NOT EXISTS (SELECT 1 FROM prettygood.artists WHERE id = artist_id) THEN
    RAISE EXCEPTION 'Artist not found';
  END IF;
  
  -- Create payment record
  INSERT INTO prettygood.payments (
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

CREATE OR REPLACE FUNCTION prettygood.track_payment_status_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO prettygood.payment_status_history
      (payment_id, old_status, new_status)
    VALUES
      (NEW.id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$function$
;

create or replace view "prettygood"."track_play_counts" as  SELECT play_history.track_id,
    count(*) AS play_count,
    count(DISTINCT play_history.user_id) AS unique_listeners,
    max(play_history.played_at) AS last_played_at
   FROM prettygood.play_history
  GROUP BY play_history.track_id;


create or replace view "prettygood"."tracks_with_details" as  SELECT t.id,
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
   FROM (((prettygood.tracks t
     JOIN prettygood.artists a ON ((t.artist_id = a.id)))
     LEFT JOIN prettygood.albums al ON ((t.album_id = al.id)))
     LEFT JOIN prettygood.track_play_counts pc ON ((t.id = pc.track_id)));


CREATE OR REPLACE FUNCTION prettygood.update_genre_popularity()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Update popularity based on track count and play count
  UPDATE prettygood.genres g
  SET popularity = (
    SELECT COUNT(DISTINCT t.id) * 10 + COALESCE(SUM(pc.play_count), 0) / 10
    FROM prettygood.track_genres tg
    JOIN prettygood.tracks t ON t.id = tg.track_id
    LEFT JOIN prettygood.track_play_counts pc ON pc.track_id = t.id
    WHERE tg.genre_id = g.id
    GROUP BY tg.genre_id
  );
END;
$function$
;

create policy "Album genres are viewable by everyone"
on "prettygood"."album_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their album genres"
on "prettygood"."album_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.albums
  WHERE ((albums.id = album_genres.album_id) AND (albums.artist_id = auth.uid())))));


create policy "Album likes are viewable by everyone"
on "prettygood"."album_likes"
as permissive
for select
to public
using (true);


create policy "Users can like albums"
on "prettygood"."album_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike albums"
on "prettygood"."album_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Albums are viewable by everyone"
on "prettygood"."albums"
as permissive
for select
to public
using (true);


create policy "Artists can create their own albums"
on "prettygood"."albums"
as permissive
for insert
to public
with check (((auth.uid() = artist_id) AND (EXISTS ( SELECT 1
   FROM prettygood.artists
  WHERE ((artists.id = auth.uid()) AND (artists.approved = true))))));


create policy "Artists can delete their own albums"
on "prettygood"."albums"
as permissive
for delete
to public
using ((auth.uid() = artist_id));


create policy "Artists can update their own albums"
on "prettygood"."albums"
as permissive
for update
to public
using ((auth.uid() = artist_id));


create policy "Artist followers are viewable by everyone"
on "prettygood"."artist_followers"
as permissive
for select
to public
using (true);


create policy "Users can follow artists"
on "prettygood"."artist_followers"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unfollow artists"
on "prettygood"."artist_followers"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Artist genres are viewable by everyone"
on "prettygood"."artist_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their own genres"
on "prettygood"."artist_genres"
as permissive
for all
to public
using ((artist_id = auth.uid()));


create policy "Artists are viewable by everyone"
on "prettygood"."artists"
as permissive
for select
to public
using (true);


create policy "Artists can update their own profiles"
on "prettygood"."artists"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can apply to become artists"
on "prettygood"."artists"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Admins can manage genres"
on "prettygood"."genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Genres are viewable by everyone"
on "prettygood"."genres"
as permissive
for select
to public
using (true);


create policy "Admins can access payment history"
on "prettygood"."payment_status_history"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Artists can see their own payment history"
on "prettygood"."payment_status_history"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.payments p
  WHERE ((p.id = payment_status_history.payment_id) AND (p.recipient_id = auth.uid())))));


create policy "Users can create payments"
on "prettygood"."payments"
as permissive
for insert
to public
with check ((auth.uid() = sender_id));


create policy "Users can view their own payments"
on "prettygood"."payments"
as permissive
for select
to public
using (((auth.uid() = sender_id) OR (auth.uid() = recipient_id)));


create policy "Artists can view play history for their tracks"
on "prettygood"."play_history"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.tracks
  WHERE ((tracks.id = play_history.track_id) AND (tracks.artist_id = auth.uid())))));


create policy "Users can record plays"
on "prettygood"."play_history"
as permissive
for insert
to public
with check (true);


create policy "Users can view their own play history"
on "prettygood"."play_history"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "Playlist likes are viewable by everyone"
on "prettygood"."playlist_likes"
as permissive
for select
to public
using (true);


create policy "Users can like playlists"
on "prettygood"."playlist_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike playlists"
on "prettygood"."playlist_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can add tracks to their own playlists"
on "prettygood"."playlist_tracks"
as permissive
for insert
to public
with check (((EXISTS ( SELECT 1
   FROM prettygood.playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND (playlists.user_id = auth.uid())))) AND (added_by = auth.uid())));


create policy "Users can delete tracks from their own playlists"
on "prettygood"."playlist_tracks"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND (playlists.user_id = auth.uid())))));


create policy "Users can view tracks in playlists they can access"
on "prettygood"."playlist_tracks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.playlists
  WHERE ((playlists.id = playlist_tracks.playlist_id) AND ((playlists.is_public = true) OR (playlists.user_id = auth.uid()))))));


create policy "Public playlists are viewable by everyone"
on "prettygood"."playlists"
as permissive
for select
to public
using (((is_public = true) OR (auth.uid() = user_id)));


create policy "Users can create their own playlists"
on "prettygood"."playlists"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can delete their own playlists"
on "prettygood"."playlists"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update their own playlists"
on "prettygood"."playlists"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Admins can manage related genres"
on "prettygood"."related_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::text)))));


create policy "Everyone can view related genres"
on "prettygood"."related_genres"
as permissive
for select
to public
using (true);


create policy "Artists can manage their track genres"
on "prettygood"."track_genres"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM prettygood.tracks
  WHERE ((tracks.id = track_genres.track_id) AND (tracks.artist_id = auth.uid())))));


create policy "Track genres are viewable by everyone"
on "prettygood"."track_genres"
as permissive
for select
to public
using (true);


create policy "Track likes are viewable by everyone"
on "prettygood"."track_likes"
as permissive
for select
to public
using (true);


create policy "Users can like tracks"
on "prettygood"."track_likes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can unlike tracks"
on "prettygood"."track_likes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Artists can create their own tracks"
on "prettygood"."tracks"
as permissive
for insert
to public
with check (((auth.uid() = artist_id) AND (EXISTS ( SELECT 1
   FROM prettygood.artists
  WHERE ((artists.id = auth.uid()) AND (artists.approved = true))))));


create policy "Artists can delete their own tracks"
on "prettygood"."tracks"
as permissive
for delete
to public
using ((auth.uid() = artist_id));


create policy "Artists can update their own tracks"
on "prettygood"."tracks"
as permissive
for update
to public
using ((auth.uid() = artist_id));


create policy "Tracks are viewable by everyone"
on "prettygood"."tracks"
as permissive
for select
to public
using (true);


create policy "Users can add albums to their library"
on "prettygood"."user_library_albums"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can remove albums from their library"
on "prettygood"."user_library_albums"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can view their own album library"
on "prettygood"."user_library_albums"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can add tracks to their library"
on "prettygood"."user_library_tracks"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can remove tracks from their library"
on "prettygood"."user_library_tracks"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can view their own track library"
on "prettygood"."user_library_tracks"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can add to recently played"
on "prettygood"."user_recently_played"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can view their recently played tracks"
on "prettygood"."user_recently_played"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own settings"
on "prettygood"."user_settings"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own settings"
on "prettygood"."user_settings"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own settings"
on "prettygood"."user_settings"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users are viewable by everyone"
on "prettygood"."users"
as permissive
for select
to public
using (true);


create policy "Users can update their own information"
on "prettygood"."users"
as permissive
for update
to public
using ((auth.uid() = id));


CREATE TRIGGER set_album_updated_at BEFORE UPDATE ON prettygood.albums FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_artist_updated_at BEFORE UPDATE ON prettygood.artists FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_genres_updated_at BEFORE UPDATE ON prettygood.genres FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_payment_updated_at BEFORE UPDATE ON prettygood.payments FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER track_payment_status AFTER UPDATE ON prettygood.payments FOR EACH ROW EXECUTE FUNCTION prettygood.track_payment_status_changes();

CREATE TRIGGER set_playlist_updated_at BEFORE UPDATE ON prettygood.playlists FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_track_updated_at BEFORE UPDATE ON prettygood.tracks FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_user_settings_updated_at BEFORE UPDATE ON prettygood.user_settings FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON prettygood.users FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();


