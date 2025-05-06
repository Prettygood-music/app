import { PostgrestClient } from '@supabase/postgrest-js';
import { Database } from './types';
export * from '@supabase/supabase-js';
export * from './database.schema';
export * from './types';
/**
 * @deprecated
 * @description This function is deprecated. Use createClientV2 instead.
 * @param url
 * @param headers
 * @returns
 */
export declare function createClient(url: string, headers?: Record<string, string>): PostgrestClient<Database, "public", {
    Tables: {
        album_genres: {
            Row: {
                album_id: string;
                genre_id: string;
            };
            Insert: {
                album_id: string;
                genre_id: string;
            };
            Update: {
                album_id?: string;
                genre_id?: string;
            };
            Relationships: [{
                foreignKeyName: "album_genres_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "album_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        album_likes: {
            Row: {
                album_id: string;
                liked_at: string;
                user_id: string;
            };
            Insert: {
                album_id: string;
                liked_at?: string;
                user_id: string;
            };
            Update: {
                album_id?: string;
                liked_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "album_likes_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "album_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        albums: {
            Row: {
                artist_id: string;
                cover_url: string | null;
                created_at: string;
                description: string | null;
                genre: string[] | null;
                id: string;
                release_date: string | null;
                title: string;
                type: string | null;
                updated_at: string;
            };
            Insert: {
                artist_id: string;
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                genre?: string[] | null;
                id?: string;
                release_date?: string | null;
                title: string;
                type?: string | null;
                updated_at?: string;
            };
            Update: {
                artist_id?: string;
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                genre?: string[] | null;
                id?: string;
                release_date?: string | null;
                title?: string;
                type?: string | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "albums_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        artist_followers: {
            Row: {
                artist_id: string;
                followed_at: string;
                user_id: string;
            };
            Insert: {
                artist_id: string;
                followed_at?: string;
                user_id: string;
            };
            Update: {
                artist_id?: string;
                followed_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "artist_followers_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "artist_followers_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        artist_genres: {
            Row: {
                artist_id: string;
                genre_id: string;
            };
            Insert: {
                artist_id: string;
                genre_id: string;
            };
            Update: {
                artist_id?: string;
                genre_id?: string;
            };
            Relationships: [{
                foreignKeyName: "artist_genres_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "artist_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        artists: {
            Row: {
                application_date: string | null;
                application_notes: string | null;
                approved: boolean | null;
                artist_name: string;
                avatar: string | null;
                bio: string | null;
                created_at: string;
                genre: string[] | null;
                id: string;
                location: string | null;
                social_links: import('./types').Json | null;
                updated_at: string;
                verified: boolean | null;
                website: string | null;
            };
            Insert: {
                application_date?: string | null;
                application_notes?: string | null;
                approved?: boolean | null;
                artist_name: string;
                avatar?: string | null;
                bio?: string | null;
                created_at?: string;
                genre?: string[] | null;
                id: string;
                location?: string | null;
                social_links?: import('./types').Json | null;
                updated_at?: string;
                verified?: boolean | null;
                website?: string | null;
            };
            Update: {
                application_date?: string | null;
                application_notes?: string | null;
                approved?: boolean | null;
                artist_name?: string;
                avatar?: string | null;
                bio?: string | null;
                created_at?: string;
                genre?: string[] | null;
                id?: string;
                location?: string | null;
                social_links?: import('./types').Json | null;
                updated_at?: string;
                verified?: boolean | null;
                website?: string | null;
            };
            Relationships: [{
                foreignKeyName: "artists_id_fkey";
                columns: ["id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        genres: {
            Row: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            };
            Insert: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                image_url?: string | null;
                name: string;
                popularity?: number | null;
                slug?: string | null;
                updated_at?: string;
            };
            Update: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                image_url?: string | null;
                name?: string;
                popularity?: number | null;
                slug?: string | null;
                updated_at?: string;
            };
            Relationships: [];
        };
        payment_status_history: {
            Row: {
                changed_at: string;
                changed_by: string;
                id: string;
                new_status: string;
                notes: string | null;
                old_status: string | null;
                payment_id: string;
            };
            Insert: {
                changed_at?: string;
                changed_by?: string;
                id?: string;
                new_status: string;
                notes?: string | null;
                old_status?: string | null;
                payment_id: string;
            };
            Update: {
                changed_at?: string;
                changed_by?: string;
                id?: string;
                new_status?: string;
                notes?: string | null;
                old_status?: string | null;
                payment_id?: string;
            };
            Relationships: [{
                foreignKeyName: "payment_status_history_payment_id_fkey";
                columns: ["payment_id"];
                isOneToOne: false;
                referencedRelation: "payments";
                referencedColumns: ["id"];
            }];
        };
        payments: {
            Row: {
                album_id: string | null;
                amount: number;
                created_at: string;
                currency: string;
                id: string;
                message: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id: string | null;
                transaction_hash: string | null;
                updated_at: string;
            };
            Insert: {
                album_id?: string | null;
                amount: number;
                created_at?: string;
                currency?: string;
                id?: string;
                message?: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id?: string | null;
                transaction_hash?: string | null;
                updated_at?: string;
            };
            Update: {
                album_id?: string | null;
                amount?: number;
                created_at?: string;
                currency?: string;
                id?: string;
                message?: string | null;
                payment_type?: string;
                recipient_id?: string;
                sender_id?: string;
                status?: string;
                track_id?: string | null;
                transaction_hash?: string | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "payments_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_recipient_id_fkey";
                columns: ["recipient_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_sender_id_fkey";
                columns: ["sender_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        play_history: {
            Row: {
                client_ip: string | null;
                completed: boolean | null;
                context_id: string | null;
                id: string;
                play_duration: number | null;
                played_at: string;
                source: string | null;
                track_id: string;
                user_agent: string | null;
                user_id: string | null;
            };
            Insert: {
                client_ip?: string | null;
                completed?: boolean | null;
                context_id?: string | null;
                id?: string;
                play_duration?: number | null;
                played_at?: string;
                source?: string | null;
                track_id: string;
                user_agent?: string | null;
                user_id?: string | null;
            };
            Update: {
                client_ip?: string | null;
                completed?: boolean | null;
                context_id?: string | null;
                id?: string;
                play_duration?: number | null;
                played_at?: string;
                source?: string | null;
                track_id?: string;
                user_agent?: string | null;
                user_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        playlist_likes: {
            Row: {
                liked_at: string;
                playlist_id: string;
                user_id: string;
            };
            Insert: {
                liked_at?: string;
                playlist_id: string;
                user_id: string;
            };
            Update: {
                liked_at?: string;
                playlist_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlist_likes_playlist_id_fkey";
                columns: ["playlist_id"];
                isOneToOne: false;
                referencedRelation: "playlists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        playlist_tracks: {
            Row: {
                added_at: string;
                added_by: string;
                playlist_id: string;
                position: number;
                track_id: string;
            };
            Insert: {
                added_at?: string;
                added_by: string;
                playlist_id: string;
                position: number;
                track_id: string;
            };
            Update: {
                added_at?: string;
                added_by?: string;
                playlist_id?: string;
                position?: number;
                track_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlist_tracks_added_by_fkey";
                columns: ["added_by"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_playlist_id_fkey";
                columns: ["playlist_id"];
                isOneToOne: false;
                referencedRelation: "playlists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        playlists: {
            Row: {
                cover_url: string | null;
                created_at: string;
                description: string | null;
                id: string;
                is_public: boolean | null;
                name: string;
                updated_at: string;
                user_id: string;
            };
            Insert: {
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                is_public?: boolean | null;
                name: string;
                updated_at?: string;
                user_id: string;
            };
            Update: {
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                is_public?: boolean | null;
                name?: string;
                updated_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlists_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        related_genres: {
            Row: {
                genre_id: string;
                related_genre_id: string;
                weight: number | null;
            };
            Insert: {
                genre_id: string;
                related_genre_id: string;
                weight?: number | null;
            };
            Update: {
                genre_id?: string;
                related_genre_id?: string;
                weight?: number | null;
            };
            Relationships: [{
                foreignKeyName: "related_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "related_genres_related_genre_id_fkey";
                columns: ["related_genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        track_genres: {
            Row: {
                genre_id: string;
                track_id: string;
            };
            Insert: {
                genre_id: string;
                track_id: string;
            };
            Update: {
                genre_id?: string;
                track_id?: string;
            };
            Relationships: [{
                foreignKeyName: "track_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_genres_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_genres_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        track_likes: {
            Row: {
                liked_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                liked_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                liked_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "track_likes_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_likes_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        tracks: {
            Row: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            };
            Insert: {
                album_id?: string | null;
                artist_id: string;
                audio_url: string;
                cover_url?: string | null;
                created_at?: string;
                duration: number;
                explicit?: boolean | null;
                genre?: string[] | null;
                id?: string;
                isrc?: string | null;
                lyrics?: string | null;
                release_date?: string | null;
                title: string;
                track_number?: number | null;
                updated_at?: string;
            };
            Update: {
                album_id?: string | null;
                artist_id?: string;
                audio_url?: string;
                cover_url?: string | null;
                created_at?: string;
                duration?: number;
                explicit?: boolean | null;
                genre?: string[] | null;
                id?: string;
                isrc?: string | null;
                lyrics?: string | null;
                release_date?: string | null;
                title?: string;
                track_number?: number | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        user_library_albums: {
            Row: {
                added_at: string;
                album_id: string;
                user_id: string;
            };
            Insert: {
                added_at?: string;
                album_id: string;
                user_id: string;
            };
            Update: {
                added_at?: string;
                album_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_library_albums_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_albums_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_library_tracks: {
            Row: {
                added_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                added_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                added_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_library_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_tracks_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_recently_played: {
            Row: {
                context_id: string | null;
                context_type: string | null;
                id: string;
                played_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                context_id?: string | null;
                context_type?: string | null;
                id?: string;
                played_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                context_id?: string | null;
                context_type?: string | null;
                id?: string;
                played_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_recently_played_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_recently_played_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_recently_played_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_settings: {
            Row: {
                audio_quality: string | null;
                auto_add_to_library: boolean | null;
                crossfade_duration: number | null;
                enable_autoplay: boolean | null;
                enable_crossfade: boolean | null;
                enable_equalizer: boolean | null;
                enable_explicit_content: boolean | null;
                enable_gapless_playback: boolean | null;
                enable_notifications: boolean | null;
                equalizer_settings: import('./types').Json | null;
                notification_settings: import('./types').Json | null;
                preferred_language: string | null;
                privacy_level: string | null;
                theme: string | null;
                updated_at: string;
                user_id: string;
                volume_level: number | null;
            };
            Insert: {
                audio_quality?: string | null;
                auto_add_to_library?: boolean | null;
                crossfade_duration?: number | null;
                enable_autoplay?: boolean | null;
                enable_crossfade?: boolean | null;
                enable_equalizer?: boolean | null;
                enable_explicit_content?: boolean | null;
                enable_gapless_playback?: boolean | null;
                enable_notifications?: boolean | null;
                equalizer_settings?: import('./types').Json | null;
                notification_settings?: import('./types').Json | null;
                preferred_language?: string | null;
                privacy_level?: string | null;
                theme?: string | null;
                updated_at?: string;
                user_id: string;
                volume_level?: number | null;
            };
            Update: {
                audio_quality?: string | null;
                auto_add_to_library?: boolean | null;
                crossfade_duration?: number | null;
                enable_autoplay?: boolean | null;
                enable_crossfade?: boolean | null;
                enable_equalizer?: boolean | null;
                enable_explicit_content?: boolean | null;
                enable_gapless_playback?: boolean | null;
                enable_notifications?: boolean | null;
                equalizer_settings?: import('./types').Json | null;
                notification_settings?: import('./types').Json | null;
                preferred_language?: string | null;
                privacy_level?: string | null;
                theme?: string | null;
                updated_at?: string;
                user_id?: string;
                volume_level?: number | null;
            };
            Relationships: [{
                foreignKeyName: "user_settings_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        users: {
            Row: {
                created_at: string;
                display_name: string | null;
                email: string;
                email_verified: boolean | null;
                id: string;
                profile_url: string | null;
                role: string | null;
                updated_at: string;
                username: string;
                wallet_address: string | null;
            };
            Insert: {
                created_at?: string;
                display_name?: string | null;
                email: string;
                email_verified?: boolean | null;
                id: string;
                profile_url?: string | null;
                role?: string | null;
                updated_at?: string;
                username: string;
                wallet_address?: string | null;
            };
            Update: {
                created_at?: string;
                display_name?: string | null;
                email?: string;
                email_verified?: boolean | null;
                id?: string;
                profile_url?: string | null;
                role?: string | null;
                updated_at?: string;
                username?: string;
                wallet_address?: string | null;
            };
            Relationships: [];
        };
    };
    Views: {
        album_play_counts: {
            Row: {
                album_id: string | null;
                last_played_at: string | null;
                play_count: number | null;
                tracks_played: number | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }];
        };
        artist_play_counts: {
            Row: {
                artist_id: string | null;
                last_played_at: string | null;
                play_count: number | null;
                tracks_played: number | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        track_play_counts: {
            Row: {
                last_played_at: string | null;
                play_count: number | null;
                track_id: string | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        tracks_with_details: {
            Row: {
                album_id: string | null;
                album_release_date: string | null;
                album_title: string | null;
                artist_id: string | null;
                artist_name: string | null;
                artist_verified: boolean | null;
                audio_url: string | null;
                cover_url: string | null;
                created_at: string | null;
                duration: number | null;
                explicit: boolean | null;
                genre: string[] | null;
                id: string | null;
                isrc: string | null;
                lyrics: string | null;
                play_count: number | null;
                release_date: string | null;
                title: string | null;
                track_number: number | null;
                unique_listeners: number | null;
                updated_at: string | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
    };
    Functions: {
        add_album_to_library: {
            Args: {
                album_id: string;
            };
            Returns: boolean;
        };
        add_track_to_library: {
            Args: {
                track_id: string;
            };
            Returns: boolean;
        };
        add_track_to_playlist: {
            Args: {
                playlist_id: string;
                track_id: string;
            };
            Returns: undefined;
        };
        apply_for_artist_account: {
            Args: {
                artist_name: string;
                bio?: string;
                avatar?: string;
                genre?: string[];
                location?: string;
                website?: string;
                social_links?: import('./types').Json;
                application_notes?: string;
            };
            Returns: import('./types').Json;
        };
        approve_artist_application: {
            Args: {
                artist_id: string;
                approved: boolean;
                admin_notes?: string;
            };
            Returns: import('./types').Json;
        };
        create_playlist: {
            Args: {
                name: string;
                description?: string;
                is_public?: boolean;
            };
            Returns: {
                cover_url: string | null;
                created_at: string;
                description: string | null;
                id: string;
                is_public: boolean | null;
                name: string;
                updated_at: string;
                user_id: string;
            };
        };
        create_track: {
            Args: {
                title: string;
                duration: number;
                audio_url: string;
                album_id?: string;
                cover_url?: string;
                track_number?: number;
                lyrics?: string;
                genre?: string[];
                explicit?: boolean;
                release_date?: string;
                isrc?: string;
            };
            Returns: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            };
        };
        get_albums_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                artist_id: string;
                cover_url: string | null;
                created_at: string;
                description: string | null;
                genre: string[] | null;
                id: string;
                release_date: string | null;
                title: string;
                type: string | null;
                updated_at: string;
            }[];
        };
        get_artist_payment_stats: {
            Args: {
                time_period?: string;
            };
            Returns: {
                total_payments: number;
                total_amount: number;
                avg_amount: number;
                payment_type: string;
                period: string;
            }[];
        };
        get_artists_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                application_date: string | null;
                application_notes: string | null;
                approved: boolean | null;
                artist_name: string;
                avatar: string | null;
                bio: string | null;
                created_at: string;
                genre: string[] | null;
                id: string;
                location: string | null;
                social_links: import('./types').Json | null;
                updated_at: string;
                verified: boolean | null;
                website: string | null;
            }[];
        };
        get_monthly_payment_trends: {
            Args: {
                months_back?: number;
            };
            Returns: {
                month: string;
                total_amount: number;
                payment_count: number;
            }[];
        };
        get_popular_genres: {
            Args: {
                p_start_date: string;
                p_end_date: string;
                p_limit?: number;
            };
            Returns: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            }[];
        };
        get_related_genres: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
            };
            Returns: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            }[];
        };
        get_tracks_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            }[];
        };
        record_play: {
            Args: {
                track_id: string;
                play_duration?: number;
                completed?: boolean;
                source?: string;
                context_id?: string;
            };
            Returns: undefined;
        };
        tip_artist: {
            Args: {
                artist_id: string;
                amount: number;
                transaction_hash: string;
                track_id?: string;
                album_id?: string;
                message?: string;
            };
            Returns: {
                album_id: string | null;
                amount: number;
                created_at: string;
                currency: string;
                id: string;
                message: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id: string | null;
                transaction_hash: string | null;
                updated_at: string;
            };
        };
        update_genre_popularity: {
            Args: Record<PropertyKey, never>;
            Returns: undefined;
        };
    };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}>;
export declare function createClientV2(url: string, key: string): import('@supabase/supabase-js').SupabaseClient<Database, "public", {
    Tables: {
        album_genres: {
            Row: {
                album_id: string;
                genre_id: string;
            };
            Insert: {
                album_id: string;
                genre_id: string;
            };
            Update: {
                album_id?: string;
                genre_id?: string;
            };
            Relationships: [{
                foreignKeyName: "album_genres_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "album_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        album_likes: {
            Row: {
                album_id: string;
                liked_at: string;
                user_id: string;
            };
            Insert: {
                album_id: string;
                liked_at?: string;
                user_id: string;
            };
            Update: {
                album_id?: string;
                liked_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "album_likes_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "album_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        albums: {
            Row: {
                artist_id: string;
                cover_url: string | null;
                created_at: string;
                description: string | null;
                genre: string[] | null;
                id: string;
                release_date: string | null;
                title: string;
                type: string | null;
                updated_at: string;
            };
            Insert: {
                artist_id: string;
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                genre?: string[] | null;
                id?: string;
                release_date?: string | null;
                title: string;
                type?: string | null;
                updated_at?: string;
            };
            Update: {
                artist_id?: string;
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                genre?: string[] | null;
                id?: string;
                release_date?: string | null;
                title?: string;
                type?: string | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "albums_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        artist_followers: {
            Row: {
                artist_id: string;
                followed_at: string;
                user_id: string;
            };
            Insert: {
                artist_id: string;
                followed_at?: string;
                user_id: string;
            };
            Update: {
                artist_id?: string;
                followed_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "artist_followers_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "artist_followers_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        artist_genres: {
            Row: {
                artist_id: string;
                genre_id: string;
            };
            Insert: {
                artist_id: string;
                genre_id: string;
            };
            Update: {
                artist_id?: string;
                genre_id?: string;
            };
            Relationships: [{
                foreignKeyName: "artist_genres_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "artist_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        artists: {
            Row: {
                application_date: string | null;
                application_notes: string | null;
                approved: boolean | null;
                artist_name: string;
                avatar: string | null;
                bio: string | null;
                created_at: string;
                genre: string[] | null;
                id: string;
                location: string | null;
                social_links: import('./types').Json | null;
                updated_at: string;
                verified: boolean | null;
                website: string | null;
            };
            Insert: {
                application_date?: string | null;
                application_notes?: string | null;
                approved?: boolean | null;
                artist_name: string;
                avatar?: string | null;
                bio?: string | null;
                created_at?: string;
                genre?: string[] | null;
                id: string;
                location?: string | null;
                social_links?: import('./types').Json | null;
                updated_at?: string;
                verified?: boolean | null;
                website?: string | null;
            };
            Update: {
                application_date?: string | null;
                application_notes?: string | null;
                approved?: boolean | null;
                artist_name?: string;
                avatar?: string | null;
                bio?: string | null;
                created_at?: string;
                genre?: string[] | null;
                id?: string;
                location?: string | null;
                social_links?: import('./types').Json | null;
                updated_at?: string;
                verified?: boolean | null;
                website?: string | null;
            };
            Relationships: [{
                foreignKeyName: "artists_id_fkey";
                columns: ["id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        genres: {
            Row: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            };
            Insert: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                image_url?: string | null;
                name: string;
                popularity?: number | null;
                slug?: string | null;
                updated_at?: string;
            };
            Update: {
                color?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                image_url?: string | null;
                name?: string;
                popularity?: number | null;
                slug?: string | null;
                updated_at?: string;
            };
            Relationships: [];
        };
        payment_status_history: {
            Row: {
                changed_at: string;
                changed_by: string;
                id: string;
                new_status: string;
                notes: string | null;
                old_status: string | null;
                payment_id: string;
            };
            Insert: {
                changed_at?: string;
                changed_by?: string;
                id?: string;
                new_status: string;
                notes?: string | null;
                old_status?: string | null;
                payment_id: string;
            };
            Update: {
                changed_at?: string;
                changed_by?: string;
                id?: string;
                new_status?: string;
                notes?: string | null;
                old_status?: string | null;
                payment_id?: string;
            };
            Relationships: [{
                foreignKeyName: "payment_status_history_payment_id_fkey";
                columns: ["payment_id"];
                isOneToOne: false;
                referencedRelation: "payments";
                referencedColumns: ["id"];
            }];
        };
        payments: {
            Row: {
                album_id: string | null;
                amount: number;
                created_at: string;
                currency: string;
                id: string;
                message: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id: string | null;
                transaction_hash: string | null;
                updated_at: string;
            };
            Insert: {
                album_id?: string | null;
                amount: number;
                created_at?: string;
                currency?: string;
                id?: string;
                message?: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id?: string | null;
                transaction_hash?: string | null;
                updated_at?: string;
            };
            Update: {
                album_id?: string | null;
                amount?: number;
                created_at?: string;
                currency?: string;
                id?: string;
                message?: string | null;
                payment_type?: string;
                recipient_id?: string;
                sender_id?: string;
                status?: string;
                track_id?: string | null;
                transaction_hash?: string | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "payments_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_recipient_id_fkey";
                columns: ["recipient_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_sender_id_fkey";
                columns: ["sender_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "payments_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        play_history: {
            Row: {
                client_ip: string | null;
                completed: boolean | null;
                context_id: string | null;
                id: string;
                play_duration: number | null;
                played_at: string;
                source: string | null;
                track_id: string;
                user_agent: string | null;
                user_id: string | null;
            };
            Insert: {
                client_ip?: string | null;
                completed?: boolean | null;
                context_id?: string | null;
                id?: string;
                play_duration?: number | null;
                played_at?: string;
                source?: string | null;
                track_id: string;
                user_agent?: string | null;
                user_id?: string | null;
            };
            Update: {
                client_ip?: string | null;
                completed?: boolean | null;
                context_id?: string | null;
                id?: string;
                play_duration?: number | null;
                played_at?: string;
                source?: string | null;
                track_id?: string;
                user_agent?: string | null;
                user_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        playlist_likes: {
            Row: {
                liked_at: string;
                playlist_id: string;
                user_id: string;
            };
            Insert: {
                liked_at?: string;
                playlist_id: string;
                user_id: string;
            };
            Update: {
                liked_at?: string;
                playlist_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlist_likes_playlist_id_fkey";
                columns: ["playlist_id"];
                isOneToOne: false;
                referencedRelation: "playlists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        playlist_tracks: {
            Row: {
                added_at: string;
                added_by: string;
                playlist_id: string;
                position: number;
                track_id: string;
            };
            Insert: {
                added_at?: string;
                added_by: string;
                playlist_id: string;
                position: number;
                track_id: string;
            };
            Update: {
                added_at?: string;
                added_by?: string;
                playlist_id?: string;
                position?: number;
                track_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlist_tracks_added_by_fkey";
                columns: ["added_by"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_playlist_id_fkey";
                columns: ["playlist_id"];
                isOneToOne: false;
                referencedRelation: "playlists";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "playlist_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        playlists: {
            Row: {
                cover_url: string | null;
                created_at: string;
                description: string | null;
                id: string;
                is_public: boolean | null;
                name: string;
                updated_at: string;
                user_id: string;
            };
            Insert: {
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                is_public?: boolean | null;
                name: string;
                updated_at?: string;
                user_id: string;
            };
            Update: {
                cover_url?: string | null;
                created_at?: string;
                description?: string | null;
                id?: string;
                is_public?: boolean | null;
                name?: string;
                updated_at?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "playlists_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        related_genres: {
            Row: {
                genre_id: string;
                related_genre_id: string;
                weight: number | null;
            };
            Insert: {
                genre_id: string;
                related_genre_id: string;
                weight?: number | null;
            };
            Update: {
                genre_id?: string;
                related_genre_id?: string;
                weight?: number | null;
            };
            Relationships: [{
                foreignKeyName: "related_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "related_genres_related_genre_id_fkey";
                columns: ["related_genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }];
        };
        track_genres: {
            Row: {
                genre_id: string;
                track_id: string;
            };
            Insert: {
                genre_id: string;
                track_id: string;
            };
            Update: {
                genre_id?: string;
                track_id?: string;
            };
            Relationships: [{
                foreignKeyName: "track_genres_genre_id_fkey";
                columns: ["genre_id"];
                isOneToOne: false;
                referencedRelation: "genres";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_genres_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_genres_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        track_likes: {
            Row: {
                liked_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                liked_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                liked_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "track_likes_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_likes_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "track_likes_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        tracks: {
            Row: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            };
            Insert: {
                album_id?: string | null;
                artist_id: string;
                audio_url: string;
                cover_url?: string | null;
                created_at?: string;
                duration: number;
                explicit?: boolean | null;
                genre?: string[] | null;
                id?: string;
                isrc?: string | null;
                lyrics?: string | null;
                release_date?: string | null;
                title: string;
                track_number?: number | null;
                updated_at?: string;
            };
            Update: {
                album_id?: string | null;
                artist_id?: string;
                audio_url?: string;
                cover_url?: string | null;
                created_at?: string;
                duration?: number;
                explicit?: boolean | null;
                genre?: string[] | null;
                id?: string;
                isrc?: string | null;
                lyrics?: string | null;
                release_date?: string | null;
                title?: string;
                track_number?: number | null;
                updated_at?: string;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        user_library_albums: {
            Row: {
                added_at: string;
                album_id: string;
                user_id: string;
            };
            Insert: {
                added_at?: string;
                album_id: string;
                user_id: string;
            };
            Update: {
                added_at?: string;
                album_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_library_albums_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_albums_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_library_tracks: {
            Row: {
                added_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                added_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                added_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_library_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_tracks_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_library_tracks_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_recently_played: {
            Row: {
                context_id: string | null;
                context_type: string | null;
                id: string;
                played_at: string;
                track_id: string;
                user_id: string;
            };
            Insert: {
                context_id?: string | null;
                context_type?: string | null;
                id?: string;
                played_at?: string;
                track_id: string;
                user_id: string;
            };
            Update: {
                context_id?: string | null;
                context_type?: string | null;
                id?: string;
                played_at?: string;
                track_id?: string;
                user_id?: string;
            };
            Relationships: [{
                foreignKeyName: "user_recently_played_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_recently_played_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "user_recently_played_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: false;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        user_settings: {
            Row: {
                audio_quality: string | null;
                auto_add_to_library: boolean | null;
                crossfade_duration: number | null;
                enable_autoplay: boolean | null;
                enable_crossfade: boolean | null;
                enable_equalizer: boolean | null;
                enable_explicit_content: boolean | null;
                enable_gapless_playback: boolean | null;
                enable_notifications: boolean | null;
                equalizer_settings: import('./types').Json | null;
                notification_settings: import('./types').Json | null;
                preferred_language: string | null;
                privacy_level: string | null;
                theme: string | null;
                updated_at: string;
                user_id: string;
                volume_level: number | null;
            };
            Insert: {
                audio_quality?: string | null;
                auto_add_to_library?: boolean | null;
                crossfade_duration?: number | null;
                enable_autoplay?: boolean | null;
                enable_crossfade?: boolean | null;
                enable_equalizer?: boolean | null;
                enable_explicit_content?: boolean | null;
                enable_gapless_playback?: boolean | null;
                enable_notifications?: boolean | null;
                equalizer_settings?: import('./types').Json | null;
                notification_settings?: import('./types').Json | null;
                preferred_language?: string | null;
                privacy_level?: string | null;
                theme?: string | null;
                updated_at?: string;
                user_id: string;
                volume_level?: number | null;
            };
            Update: {
                audio_quality?: string | null;
                auto_add_to_library?: boolean | null;
                crossfade_duration?: number | null;
                enable_autoplay?: boolean | null;
                enable_crossfade?: boolean | null;
                enable_equalizer?: boolean | null;
                enable_explicit_content?: boolean | null;
                enable_gapless_playback?: boolean | null;
                enable_notifications?: boolean | null;
                equalizer_settings?: import('./types').Json | null;
                notification_settings?: import('./types').Json | null;
                preferred_language?: string | null;
                privacy_level?: string | null;
                theme?: string | null;
                updated_at?: string;
                user_id?: string;
                volume_level?: number | null;
            };
            Relationships: [{
                foreignKeyName: "user_settings_user_id_fkey";
                columns: ["user_id"];
                isOneToOne: true;
                referencedRelation: "users";
                referencedColumns: ["id"];
            }];
        };
        users: {
            Row: {
                created_at: string;
                display_name: string | null;
                email: string;
                email_verified: boolean | null;
                id: string;
                profile_url: string | null;
                role: string | null;
                updated_at: string;
                username: string;
                wallet_address: string | null;
            };
            Insert: {
                created_at?: string;
                display_name?: string | null;
                email: string;
                email_verified?: boolean | null;
                id: string;
                profile_url?: string | null;
                role?: string | null;
                updated_at?: string;
                username: string;
                wallet_address?: string | null;
            };
            Update: {
                created_at?: string;
                display_name?: string | null;
                email?: string;
                email_verified?: boolean | null;
                id?: string;
                profile_url?: string | null;
                role?: string | null;
                updated_at?: string;
                username?: string;
                wallet_address?: string | null;
            };
            Relationships: [];
        };
    };
    Views: {
        album_play_counts: {
            Row: {
                album_id: string | null;
                last_played_at: string | null;
                play_count: number | null;
                tracks_played: number | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }];
        };
        artist_play_counts: {
            Row: {
                artist_id: string | null;
                last_played_at: string | null;
                play_count: number | null;
                tracks_played: number | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
        track_play_counts: {
            Row: {
                last_played_at: string | null;
                play_count: number | null;
                track_id: string | null;
                unique_listeners: number | null;
            };
            Relationships: [{
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "play_history_track_id_fkey";
                columns: ["track_id"];
                isOneToOne: false;
                referencedRelation: "tracks_with_details";
                referencedColumns: ["id"];
            }];
        };
        tracks_with_details: {
            Row: {
                album_id: string | null;
                album_release_date: string | null;
                album_title: string | null;
                artist_id: string | null;
                artist_name: string | null;
                artist_verified: boolean | null;
                audio_url: string | null;
                cover_url: string | null;
                created_at: string | null;
                duration: number | null;
                explicit: boolean | null;
                genre: string[] | null;
                id: string | null;
                isrc: string | null;
                lyrics: string | null;
                play_count: number | null;
                release_date: string | null;
                title: string | null;
                track_number: number | null;
                unique_listeners: number | null;
                updated_at: string | null;
            };
            Relationships: [{
                foreignKeyName: "tracks_album_id_fkey";
                columns: ["album_id"];
                isOneToOne: false;
                referencedRelation: "albums";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tracks_artist_id_fkey";
                columns: ["artist_id"];
                isOneToOne: false;
                referencedRelation: "artists";
                referencedColumns: ["id"];
            }];
        };
    };
    Functions: {
        add_album_to_library: {
            Args: {
                album_id: string;
            };
            Returns: boolean;
        };
        add_track_to_library: {
            Args: {
                track_id: string;
            };
            Returns: boolean;
        };
        add_track_to_playlist: {
            Args: {
                playlist_id: string;
                track_id: string;
            };
            Returns: undefined;
        };
        apply_for_artist_account: {
            Args: {
                artist_name: string;
                bio?: string;
                avatar?: string;
                genre?: string[];
                location?: string;
                website?: string;
                social_links?: import('./types').Json;
                application_notes?: string;
            };
            Returns: import('./types').Json;
        };
        approve_artist_application: {
            Args: {
                artist_id: string;
                approved: boolean;
                admin_notes?: string;
            };
            Returns: import('./types').Json;
        };
        create_playlist: {
            Args: {
                name: string;
                description?: string;
                is_public?: boolean;
            };
            Returns: {
                cover_url: string | null;
                created_at: string;
                description: string | null;
                id: string;
                is_public: boolean | null;
                name: string;
                updated_at: string;
                user_id: string;
            };
        };
        create_track: {
            Args: {
                title: string;
                duration: number;
                audio_url: string;
                album_id?: string;
                cover_url?: string;
                track_number?: number;
                lyrics?: string;
                genre?: string[];
                explicit?: boolean;
                release_date?: string;
                isrc?: string;
            };
            Returns: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            };
        };
        get_albums_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                artist_id: string;
                cover_url: string | null;
                created_at: string;
                description: string | null;
                genre: string[] | null;
                id: string;
                release_date: string | null;
                title: string;
                type: string | null;
                updated_at: string;
            }[];
        };
        get_artist_payment_stats: {
            Args: {
                time_period?: string;
            };
            Returns: {
                total_payments: number;
                total_amount: number;
                avg_amount: number;
                payment_type: string;
                period: string;
            }[];
        };
        get_artists_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                application_date: string | null;
                application_notes: string | null;
                approved: boolean | null;
                artist_name: string;
                avatar: string | null;
                bio: string | null;
                created_at: string;
                genre: string[] | null;
                id: string;
                location: string | null;
                social_links: import('./types').Json | null;
                updated_at: string;
                verified: boolean | null;
                website: string | null;
            }[];
        };
        get_monthly_payment_trends: {
            Args: {
                months_back?: number;
            };
            Returns: {
                month: string;
                total_amount: number;
                payment_count: number;
            }[];
        };
        get_popular_genres: {
            Args: {
                p_start_date: string;
                p_end_date: string;
                p_limit?: number;
            };
            Returns: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            }[];
        };
        get_related_genres: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
            };
            Returns: {
                color: string | null;
                created_at: string;
                description: string | null;
                id: string;
                image_url: string | null;
                name: string;
                popularity: number | null;
                slug: string | null;
                updated_at: string;
            }[];
        };
        get_tracks_by_genre: {
            Args: {
                p_genre_id: string;
                p_limit?: number;
                p_offset?: number;
            };
            Returns: {
                album_id: string | null;
                artist_id: string;
                audio_url: string;
                cover_url: string | null;
                created_at: string;
                duration: number;
                explicit: boolean | null;
                genre: string[] | null;
                id: string;
                isrc: string | null;
                lyrics: string | null;
                release_date: string | null;
                title: string;
                track_number: number | null;
                updated_at: string;
            }[];
        };
        record_play: {
            Args: {
                track_id: string;
                play_duration?: number;
                completed?: boolean;
                source?: string;
                context_id?: string;
            };
            Returns: undefined;
        };
        tip_artist: {
            Args: {
                artist_id: string;
                amount: number;
                transaction_hash: string;
                track_id?: string;
                album_id?: string;
                message?: string;
            };
            Returns: {
                album_id: string | null;
                amount: number;
                created_at: string;
                currency: string;
                id: string;
                message: string | null;
                payment_type: string;
                recipient_id: string;
                sender_id: string;
                status: string;
                track_id: string | null;
                transaction_hash: string | null;
                updated_at: string;
            };
        };
        update_genre_popularity: {
            Args: Record<PropertyKey, never>;
            Returns: undefined;
        };
    };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}>;
