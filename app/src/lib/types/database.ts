export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  prettygood: {
    Tables: {
      album_likes: {
        Row: {
          album_id: string
          liked_at: string
          user_id: string
        }
        Insert: {
          album_id: string
          liked_at?: string
          user_id: string
        }
        Update: {
          album_id?: string
          liked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "album_likes_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "album_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      albums: {
        Row: {
          artist_id: string
          cover_image: string | null
          created_at: string
          description: string | null
          genre: string[] | null
          id: string
          release_date: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          artist_id: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          genre?: string[] | null
          id?: string
          release_date?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: string
          cover_image?: string | null
          created_at?: string
          description?: string | null
          genre?: string[] | null
          id?: string
          release_date?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_followers: {
        Row: {
          artist_id: string
          followed_at: string
          user_id: string
        }
        Insert: {
          artist_id: string
          followed_at?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          followed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_followers_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          artist_name: string
          bio: string | null
          created_at: string
          genre: string[] | null
          id: string
          location: string | null
          social_links: Json | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          artist_name: string
          bio?: string | null
          created_at?: string
          genre?: string[] | null
          id: string
          location?: string | null
          social_links?: Json | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          artist_name?: string
          bio?: string | null
          created_at?: string
          genre?: string[] | null
          id?: string
          location?: string | null
          social_links?: Json | null
          updated_at?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          album_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          message: string | null
          payment_type: string
          recipient_id: string
          sender_id: string
          status: string
          track_id: string | null
          transaction_hash: string | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          message?: string | null
          payment_type: string
          recipient_id: string
          sender_id: string
          status: string
          track_id?: string | null
          transaction_hash?: string | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          message?: string | null
          payment_type?: string
          recipient_id?: string
          sender_id?: string
          status?: string
          track_id?: string | null
          transaction_hash?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      play_history: {
        Row: {
          client_ip: string | null
          completed: boolean | null
          id: string
          play_duration: number | null
          played_at: string
          source: string | null
          track_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          client_ip?: string | null
          completed?: boolean | null
          id?: string
          play_duration?: number | null
          played_at?: string
          source?: string | null
          track_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          client_ip?: string | null
          completed?: boolean | null
          id?: string
          play_duration?: number | null
          played_at?: string
          source?: string | null
          track_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "play_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_collaborators: {
        Row: {
          added_at: string
          added_by: string
          playlist_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          playlist_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          playlist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_collaborators_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_collaborators_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_collaborators_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_likes: {
        Row: {
          liked_at: string
          playlist_id: string
          user_id: string
        }
        Insert: {
          liked_at?: string
          playlist_id: string
          user_id: string
        }
        Update: {
          liked_at?: string
          playlist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_likes_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_at: string
          added_by: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          playlist_id: string
          position: number
          track_id: string
        }
        Update: {
          added_at?: string
          added_by?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          collaborative: boolean | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          collaborative?: boolean | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          collaborative?: boolean | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          id: string
          query: string
          searched_at: string
          user_id: string
        }
        Insert: {
          id?: string
          query: string
          searched_at?: string
          user_id: string
        }
        Update: {
          id?: string
          query?: string
          searched_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      track_likes: {
        Row: {
          liked_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          liked_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          liked_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_likes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "track_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          album_id: string | null
          artist_id: string
          audio_url: string
          cover_image: string | null
          created_at: string
          duration: number
          explicit: boolean | null
          genre: string[] | null
          id: string
          isrc: string | null
          lyrics: string | null
          release_date: string | null
          title: string
          track_number: number | null
          updated_at: string
        }
        Insert: {
          album_id?: string | null
          artist_id: string
          audio_url: string
          cover_image?: string | null
          created_at?: string
          duration: number
          explicit?: boolean | null
          genre?: string[] | null
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_date?: string | null
          title: string
          track_number?: number | null
          updated_at?: string
        }
        Update: {
          album_id?: string | null
          artist_id?: string
          audio_url?: string
          cover_image?: string | null
          created_at?: string
          duration?: number
          explicit?: boolean | null
          genre?: string[] | null
          id?: string
          isrc?: string | null
          lyrics?: string | null
          release_date?: string | null
          title?: string
          track_number?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library_albums: {
        Row: {
          added_at: string
          album_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          album_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          album_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_albums_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_albums_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library_artists: {
        Row: {
          added_at: string
          artist_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          artist_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          artist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_artists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_library_tracks: {
        Row: {
          added_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_library_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_library_tracks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recently_played: {
        Row: {
          context_id: string | null
          context_type: string | null
          id: string
          played_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          context_id?: string | null
          context_type?: string | null
          id?: string
          played_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          context_id?: string | null
          context_type?: string | null
          id?: string
          played_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_recently_played_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_recently_played_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          audio_quality: string | null
          auto_add_to_library: boolean | null
          crossfade_duration: number | null
          enable_autoplay: boolean | null
          enable_crossfade: boolean | null
          enable_equalizer: boolean | null
          enable_explicit_content: boolean | null
          enable_gapless_playback: boolean | null
          enable_notifications: boolean | null
          equalizer_settings: Json | null
          notification_settings: Json | null
          preferred_language: string | null
          privacy_level: string | null
          theme: string | null
          updated_at: string
          user_id: string
          volume_level: number | null
        }
        Insert: {
          audio_quality?: string | null
          auto_add_to_library?: boolean | null
          crossfade_duration?: number | null
          enable_autoplay?: boolean | null
          enable_crossfade?: boolean | null
          enable_equalizer?: boolean | null
          enable_explicit_content?: boolean | null
          enable_gapless_playback?: boolean | null
          enable_notifications?: boolean | null
          equalizer_settings?: Json | null
          notification_settings?: Json | null
          preferred_language?: string | null
          privacy_level?: string | null
          theme?: string | null
          updated_at?: string
          user_id: string
          volume_level?: number | null
        }
        Update: {
          audio_quality?: string | null
          auto_add_to_library?: boolean | null
          crossfade_duration?: number | null
          enable_autoplay?: boolean | null
          enable_crossfade?: boolean | null
          enable_equalizer?: boolean | null
          enable_explicit_content?: boolean | null
          enable_gapless_playback?: boolean | null
          enable_notifications?: boolean | null
          equalizer_settings?: Json | null
          notification_settings?: Json | null
          preferred_language?: string | null
          privacy_level?: string | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          volume_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          profile_image: string | null
          updated_at: string
          username: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          profile_image?: string | null
          updated_at?: string
          username: string
          wallet_address: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          profile_image?: string | null
          updated_at?: string
          username?: string
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_album_to_library: {
        Args: {
          album_id: string
        }
        Returns: boolean
      }
      add_artist_to_library: {
        Args: {
          artist_id: string
        }
        Returns: boolean
      }
      add_track_to_library: {
        Args: {
          track_id: string
        }
        Returns: boolean
      }
      add_track_to_playlist: {
        Args: {
          playlist_id: string
          track_id: string
        }
        Returns: undefined
      }
      authenticate_wallet: {
        Args: {
          wallet_address: string
          signature: string
        }
        Returns: string
      }
      create_playlist: {
        Args: {
          name: string
          description?: string
          is_public?: boolean
          collaborative?: boolean
        }
        Returns: {
          collaborative: boolean | null
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
      }
      generate_nonce: {
        Args: {
          wallet_address: string
        }
        Returns: string
      }
      get_artist_payment_stats: {
        Args: {
          artist_id: string
        }
        Returns: {
          total_payments: number
          total_amount: number
          avg_amount: number
          payment_type: string
          month_year: string
        }[]
      }
      get_recommendations: {
        Args: {
          limit_count?: number
        }
        Returns: {
          album_id: string | null
          artist_id: string
          audio_url: string
          cover_image: string | null
          created_at: string
          duration: number
          explicit: boolean | null
          genre: string[] | null
          id: string
          isrc: string | null
          lyrics: string | null
          release_date: string | null
          title: string
          track_number: number | null
          updated_at: string
        }[]
      }
      record_play: {
        Args: {
          track_id: string
          play_duration?: number
          completed?: boolean
          source?: string
          context_id?: string
        }
        Returns: undefined
      }
      record_search: {
        Args: {
          query: string
        }
        Returns: undefined
      }
      refresh_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      register_as_artist: {
        Args: {
          artist_name: string
          bio?: string
          genre?: string[]
          location?: string
          website?: string
          social_links?: Json
        }
        Returns: {
          artist_name: string
          bio: string | null
          created_at: string
          genre: string[] | null
          id: string
          location: string | null
          social_links: Json | null
          updated_at: string
          verified: boolean | null
          website: string | null
        }
      }
      register_user: {
        Args: {
          wallet_address: string
          username: string
          display_name?: string
        }
        Returns: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          profile_image: string | null
          updated_at: string
          username: string
          wallet_address: string
        }
      }
      tip_artist: {
        Args: {
          artist_id: string
          amount: number
          transaction_hash: string
          track_id?: string
          album_id?: string
          message?: string
        }
        Returns: {
          album_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          message: string | null
          payment_type: string
          recipient_id: string
          sender_id: string
          status: string
          track_id: string | null
          transaction_hash: string | null
          updated_at: string
        }
      }
      verify_signature: {
        Args: {
          wallet_address: string
          signature: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

