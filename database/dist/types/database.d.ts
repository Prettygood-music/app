export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export type Database = {
    prettygood: {
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
                Relationships: [
                    {
                        foreignKeyName: "album_genres_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "album_genres_genre_id_fkey";
                        columns: ["genre_id"];
                        isOneToOne: false;
                        referencedRelation: "genres";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "album_likes_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "album_likes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "albums_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "artist_followers_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "artist_followers_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "artist_genres_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "artist_genres_genre_id_fkey";
                        columns: ["genre_id"];
                        isOneToOne: false;
                        referencedRelation: "genres";
                        referencedColumns: ["id"];
                    }
                ];
            };
            artists: {
                Row: {
                    artist_name: string;
                    bio: string | null;
                    created_at: string;
                    genre: string[] | null;
                    id: string;
                    location: string | null;
                    social_links: Json | null;
                    updated_at: string;
                    verified: boolean | null;
                    website: string | null;
                };
                Insert: {
                    artist_name: string;
                    bio?: string | null;
                    created_at?: string;
                    genre?: string[] | null;
                    id: string;
                    location?: string | null;
                    social_links?: Json | null;
                    updated_at?: string;
                    verified?: boolean | null;
                    website?: string | null;
                };
                Update: {
                    artist_name?: string;
                    bio?: string | null;
                    created_at?: string;
                    genre?: string[] | null;
                    id?: string;
                    location?: string | null;
                    social_links?: Json | null;
                    updated_at?: string;
                    verified?: boolean | null;
                    website?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "artists_id_fkey";
                        columns: ["id"];
                        isOneToOne: true;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "payments_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "payments_recipient_id_fkey";
                        columns: ["recipient_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "payments_sender_id_fkey";
                        columns: ["sender_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "payments_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    }
                ];
            };
            play_history: {
                Row: {
                    client_ip: string | null;
                    completed: boolean | null;
                    id: string;
                    play_duration: number | null;
                    played_at: string;
                    source: string | null;
                    track_id: string;
                    user_agent: string | null;
                    user_id: string;
                };
                Insert: {
                    client_ip?: string | null;
                    completed?: boolean | null;
                    id?: string;
                    play_duration?: number | null;
                    played_at?: string;
                    source?: string | null;
                    track_id: string;
                    user_agent?: string | null;
                    user_id: string;
                };
                Update: {
                    client_ip?: string | null;
                    completed?: boolean | null;
                    id?: string;
                    play_duration?: number | null;
                    played_at?: string;
                    source?: string | null;
                    track_id?: string;
                    user_agent?: string | null;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "play_history_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "play_history_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            playlist_collaborators: {
                Row: {
                    added_at: string;
                    added_by: string;
                    playlist_id: string;
                    user_id: string;
                };
                Insert: {
                    added_at?: string;
                    added_by: string;
                    playlist_id: string;
                    user_id: string;
                };
                Update: {
                    added_at?: string;
                    added_by?: string;
                    playlist_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "playlist_collaborators_added_by_fkey";
                        columns: ["added_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "playlist_collaborators_playlist_id_fkey";
                        columns: ["playlist_id"];
                        isOneToOne: false;
                        referencedRelation: "playlists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "playlist_collaborators_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "playlist_likes_playlist_id_fkey";
                        columns: ["playlist_id"];
                        isOneToOne: false;
                        referencedRelation: "playlists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "playlist_likes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "playlist_tracks_added_by_fkey";
                        columns: ["added_by"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "playlist_tracks_playlist_id_fkey";
                        columns: ["playlist_id"];
                        isOneToOne: false;
                        referencedRelation: "playlists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "playlist_tracks_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "playlists_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            search_history: {
                Row: {
                    id: string;
                    query: string;
                    searched_at: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    query: string;
                    searched_at?: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    query?: string;
                    searched_at?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "search_history_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "track_genres_genre_id_fkey";
                        columns: ["genre_id"];
                        isOneToOne: false;
                        referencedRelation: "genres";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "track_genres_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "track_likes_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "track_likes_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                    genre: string[];
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
                    genre?: string[];
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
                    genre?: string[];
                    id?: string;
                    isrc?: string | null;
                    lyrics?: string | null;
                    release_date?: string | null;
                    title?: string;
                    track_number?: number | null;
                    updated_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "tracks_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "tracks_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "user_library_albums_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_library_albums_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_library_artists: {
                Row: {
                    added_at: string;
                    artist_id: string;
                    user_id: string;
                };
                Insert: {
                    added_at?: string;
                    artist_id: string;
                    user_id: string;
                };
                Update: {
                    added_at?: string;
                    artist_id?: string;
                    user_id?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_library_artists_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_library_artists_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "user_library_tracks_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_library_tracks_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                Relationships: [
                    {
                        foreignKeyName: "user_recently_played_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "user_recently_played_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
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
                    equalizer_settings: Json | null;
                    notification_settings: Json | null;
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
                    equalizer_settings?: Json | null;
                    notification_settings?: Json | null;
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
                    equalizer_settings?: Json | null;
                    notification_settings?: Json | null;
                    preferred_language?: string | null;
                    privacy_level?: string | null;
                    theme?: string | null;
                    updated_at?: string;
                    user_id?: string;
                    volume_level?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "user_settings_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: true;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            users: {
                Row: {
                    created_at: string;
                    display_name: string | null;
                    email: string;
                    email_verified: boolean | null;
                    id: string;
                    profile_url: string | null;
                    updated_at: string;
                    username: string;
                    wallet_address: string | null;
                };
                Insert: {
                    created_at?: string;
                    display_name?: string | null;
                    email: string;
                    email_verified?: boolean | null;
                    id?: string;
                    profile_url?: string | null;
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
                    play_count: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tracks_album_id_fkey";
                        columns: ["album_id"];
                        isOneToOne: false;
                        referencedRelation: "albums";
                        referencedColumns: ["id"];
                    }
                ];
            };
            artist_play_counts: {
                Row: {
                    artist_id: string | null;
                    play_count: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "tracks_artist_id_fkey";
                        columns: ["artist_id"];
                        isOneToOne: false;
                        referencedRelation: "artists";
                        referencedColumns: ["id"];
                    }
                ];
            };
            track_play_counts: {
                Row: {
                    play_count: number | null;
                    track_id: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "play_history_track_id_fkey";
                        columns: ["track_id"];
                        isOneToOne: false;
                        referencedRelation: "tracks";
                        referencedColumns: ["id"];
                    }
                ];
            };
            user_play_counts: {
                Row: {
                    play_count: number | null;
                    user_id: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "play_history_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Functions: {
            add_album_to_library: {
                Args: {
                    album_id: string;
                };
                Returns: boolean;
            };
            add_artist_to_library: {
                Args: {
                    artist_id: string;
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
            armor: {
                Args: {
                    "": string;
                };
                Returns: string;
            };
            authenticate_user: {
                Args: {
                    _email_or_username: string;
                    _password: string;
                };
                Returns: string;
            };
            authenticate_wallet: {
                Args: {
                    wallet_address: string;
                    signature: string;
                };
                Returns: string;
            };
            create_email_verification_token: {
                Args: {
                    _user_id: string;
                };
                Returns: string;
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
            dearmor: {
                Args: {
                    "": string;
                };
                Returns: string;
            };
            gen_random_bytes: {
                Args: {
                    "": number;
                };
                Returns: string;
            };
            gen_random_uuid: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            gen_salt: {
                Args: {
                    "": string;
                };
                Returns: string;
            };
            generate_nonce: {
                Args: {
                    wallet_address: string;
                };
                Returns: string;
            };
            get_album_play_count: {
                Args: {
                    album_id: string;
                };
                Returns: number;
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
            get_artist_followers_count: {
                Args: {
                    artist_id: string;
                };
                Returns: number;
            };
            get_artist_payment_stats: {
                Args: {
                    artist_id: string;
                };
                Returns: {
                    total_payments: number;
                    total_amount: number;
                    avg_amount: number;
                    payment_type: string;
                    month_year: string;
                }[];
            };
            get_artist_play_count: {
                Args: {
                    artist_id: string;
                };
                Returns: number;
            };
            get_artist_total_earnings: {
                Args: {
                    artist_id: string;
                };
                Returns: number;
            };
            get_artists_by_genre: {
                Args: {
                    p_genre_id: string;
                    p_limit?: number;
                    p_offset?: number;
                };
                Returns: {
                    artist_name: string;
                    bio: string | null;
                    created_at: string;
                    genre: string[] | null;
                    id: string;
                    location: string | null;
                    social_links: Json | null;
                    updated_at: string;
                    verified: boolean | null;
                    website: string | null;
                }[];
            };
            get_earnings_by_payment_type: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    payment_type: string;
                    amount: number;
                }[];
            };
            get_earnings_by_period: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                    time_format: string;
                };
                Returns: {
                    period: string;
                    amount: number;
                }[];
            };
            get_earnings_for_period: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
            };
            get_followers_by_period: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                    time_format: string;
                };
                Returns: {
                    period: string;
                    count: number;
                }[];
            };
            get_followers_count_for_period: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
            };
            get_play_duration_stats: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    avg_duration: number;
                    completed_count: number;
                    total_count: number;
                }[];
            };
            get_plays_by_country: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    country_code: string;
                    play_count: number;
                }[];
            };
            get_plays_by_period: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                    time_format: string;
                };
                Returns: {
                    period: string;
                    count: number;
                }[];
            };
            get_plays_by_source: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    source: string;
                    count: number;
                }[];
            };
            get_plays_for_period: {
                Args: {
                    artist_id: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
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
            get_recent_followers: {
                Args: {
                    artist_id: string;
                    start_date?: string;
                    limit_count?: number;
                };
                Returns: {
                    added_at: string;
                    user_id: string;
                    username: string;
                }[];
            };
            get_recent_plays: {
                Args: {
                    track_ids: string[];
                    start_date?: string;
                    limit_count?: number;
                };
                Returns: {
                    played_at: string;
                    track_id: string;
                    track_title: string;
                    username: string;
                }[];
            };
            get_recent_tips: {
                Args: {
                    artist_id: string;
                    start_date?: string;
                    limit_count?: number;
                };
                Returns: {
                    created_at: string;
                    amount: number;
                    username: string;
                }[];
            };
            get_recent_transactions: {
                Args: {
                    artist_id: string;
                    limit_count?: number;
                };
                Returns: {
                    id: string;
                    created_at: string;
                    amount: number;
                    payment_type: string;
                    sender_id: string;
                    username: string;
                }[];
            };
            get_recommendations: {
                Args: {
                    limit_count?: number;
                };
                Returns: {
                    album_id: string | null;
                    artist_id: string;
                    audio_url: string;
                    cover_url: string | null;
                    created_at: string;
                    duration: number;
                    explicit: boolean | null;
                    genre: string[];
                    id: string;
                    isrc: string | null;
                    lyrics: string | null;
                    release_date: string | null;
                    title: string;
                    track_number: number | null;
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
            get_track_play_count: {
                Args: {
                    track_id: string;
                };
                Returns: number;
            };
            get_track_play_count_by_period: {
                Args: {
                    track_id: string;
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
            };
            get_track_play_counts: {
                Args: {
                    track_ids: string[];
                    start_date?: string;
                    end_date?: string;
                };
                Returns: {
                    track_id: string;
                    count: number;
                }[];
            };
            get_track_playlists_count: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
            };
            get_track_plays_for_period: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: {
                    track_id: string;
                    count: number;
                }[];
            };
            get_track_saves_count: {
                Args: {
                    track_ids: string[];
                    start_date: string;
                    end_date: string;
                };
                Returns: number;
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
                    genre: string[];
                    id: string;
                    isrc: string | null;
                    lyrics: string | null;
                    release_date: string | null;
                    title: string;
                    track_number: number | null;
                    updated_at: string;
                }[];
            };
            get_tracks_play_count: {
                Args: {
                    track_ids: string[];
                    start_date?: string;
                    end_date?: string;
                };
                Returns: number;
            };
            pgp_armor_headers: {
                Args: {
                    "": string;
                };
                Returns: Record<string, unknown>[];
            };
            pgp_key_id: {
                Args: {
                    "": string;
                };
                Returns: string;
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
            record_search: {
                Args: {
                    query: string;
                };
                Returns: undefined;
            };
            refresh_token: {
                Args: Record<PropertyKey, never>;
                Returns: string;
            };
            register_as_artist: {
                Args: {
                    artist_name: string;
                    bio?: string;
                    genre?: string[];
                    location?: string;
                    website?: string;
                    social_links?: Json;
                };
                Returns: {
                    artist_name: string;
                    bio: string | null;
                    created_at: string;
                    genre: string[] | null;
                    id: string;
                    location: string | null;
                    social_links: Json | null;
                    updated_at: string;
                    verified: boolean | null;
                    website: string | null;
                };
            };
            register_user: {
                Args: {
                    _username: string;
                    _email: string;
                    _password: string;
                    _display_name?: string;
                    _wallet_address?: string;
                };
                Returns: Json;
            };
            request_password_reset: {
                Args: {
                    _email: string;
                };
                Returns: string;
            };
            reset_password: {
                Args: {
                    _reset_token: string;
                    _new_password: string;
                };
                Returns: boolean;
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
            verify_email: {
                Args: {
                    _verification_token: string;
                };
                Returns: boolean;
            };
            verify_signature: {
                Args: {
                    wallet_address: string;
                    signature: string;
                };
                Returns: string;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};
type DefaultSchema = Database[Extract<keyof Database, "public">];
export type Tables<DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]) : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] & Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
    Row: infer R;
} ? R : never : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
    Row: infer R;
} ? R : never : never;
export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
} ? I : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I;
} ? I : never : never;
export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | {
    schema: keyof Database;
}, TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] : never = never> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
} ? U : never : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U;
} ? U : never : never;
export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | {
    schema: keyof Database;
}, EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"] : never = never> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
} ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName] : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions] : never;
export type CompositeTypes<PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | {
    schema: keyof Database;
}, CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"] : never = never> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
} ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName] : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions] : never;
export declare const Constants: {
    readonly prettygood: {
        readonly Enums: {};
    };
};
export {};
