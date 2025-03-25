-- Migration: 010_create_rls_policies.sql
-- Description: Creates Row Level Security policies for the prettygood.music application

-- Enable Row Level Security on all tables
ALTER TABLE prettygood.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.playlist_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.track_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.album_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.playlist_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.artist_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.user_library_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.user_library_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.user_library_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.user_recently_played ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE prettygood.play_history ENABLE ROW LEVEL SECURITY;

-- First, let's create a function to get the current user ID from the JWT claims
CREATE OR REPLACE FUNCTION prettygood_private.current_user_id() 
RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', TRUE)::json->>'user_id', '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Create a function to check if the current user is authenticated
CREATE OR REPLACE FUNCTION prettygood_private.is_authenticated() 
RETURNS BOOLEAN AS $$
  SELECT prettygood_private.current_user_id() IS NOT NULL;
$$ LANGUAGE SQL STABLE;

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION prettygood_private.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT (current_setting('request.jwt.claims', TRUE)::json->>'role') = 'admin';
$$ LANGUAGE SQL STABLE;

-- Create a function to check if the current user is an artist
CREATE OR REPLACE FUNCTION prettygood_private.is_artist() 
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM prettygood.artists 
    WHERE id = prettygood_private.current_user_id()
  );
$$ LANGUAGE SQL STABLE;

-- RLS Policies for Users table
CREATE POLICY users_select ON prettygood.users
  FOR SELECT USING (TRUE);  -- All users are visible to everyone

CREATE POLICY users_update ON prettygood.users
  FOR UPDATE USING (
    id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Artists table
CREATE POLICY artists_select ON prettygood.artists
  FOR SELECT USING (TRUE);  -- All artists are visible to everyone

CREATE POLICY artists_update ON prettygood.artists
  FOR UPDATE USING (
    id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Albums table
CREATE POLICY albums_select ON prettygood.albums
  FOR SELECT USING (TRUE);  -- All albums are visible to everyone

CREATE POLICY albums_insert ON prettygood.albums
  FOR INSERT WITH CHECK (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY albums_update ON prettygood.albums
  FOR UPDATE USING (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY albums_delete ON prettygood.albums
  FOR DELETE USING (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Tracks table
CREATE POLICY tracks_select ON prettygood.tracks
  FOR SELECT USING (TRUE);  -- All tracks are visible to everyone

CREATE POLICY tracks_insert ON prettygood.tracks
  FOR INSERT WITH CHECK (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY tracks_update ON prettygood.tracks
  FOR UPDATE USING (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY tracks_delete ON prettygood.tracks
  FOR DELETE USING (
    artist_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Playlists table
CREATE POLICY playlists_select_public ON prettygood.playlists
  FOR SELECT USING (
    is_public = TRUE OR
    user_id = prettygood_private.current_user_id() OR
    EXISTS (
      SELECT 1 FROM prettygood.playlist_collaborators
      WHERE playlist_id = prettygood.playlists.id
      AND user_id = prettygood_private.current_user_id()
    )
  );

CREATE POLICY playlists_insert ON prettygood.playlists
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY playlists_update ON prettygood.playlists
  FOR UPDATE USING (
    user_id = prettygood_private.current_user_id() OR
    EXISTS (
      SELECT 1 FROM prettygood.playlist_collaborators
      WHERE playlist_id = prettygood.playlists.id
      AND user_id = prettygood_private.current_user_id()
    ) OR
    prettygood_private.is_admin()
  );

CREATE POLICY playlists_delete ON prettygood.playlists
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Playlist Tracks table
CREATE POLICY playlist_tracks_select ON prettygood.playlist_tracks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE id = prettygood.playlist_tracks.playlist_id
      AND (
        is_public = TRUE OR
        user_id = prettygood_private.current_user_id() OR
        EXISTS (
          SELECT 1 FROM prettygood.playlist_collaborators
          WHERE playlist_id = prettygood.playlists.id
          AND user_id = prettygood_private.current_user_id()
        )
      )
    )
  );

CREATE POLICY playlist_tracks_insert ON prettygood.playlist_tracks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE id = prettygood.playlist_tracks.playlist_id
      AND (
        user_id = prettygood_private.current_user_id() OR
        EXISTS (
          SELECT 1 FROM prettygood.playlist_collaborators
          WHERE playlist_id = prettygood.playlists.id
          AND user_id = prettygood_private.current_user_id()
        )
      )
    )
  );

CREATE POLICY playlist_tracks_delete ON prettygood.playlist_tracks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE id = prettygood.playlist_tracks.playlist_id
      AND (
        user_id = prettygood_private.current_user_id() OR
        EXISTS (
          SELECT 1 FROM prettygood.playlist_collaborators
          WHERE playlist_id = prettygood.playlists.id
          AND user_id = prettygood_private.current_user_id()
        )
      )
    )
  );

-- RLS Policies for Playlist Collaborators table
CREATE POLICY playlist_collaborators_select ON prettygood.playlist_collaborators
  FOR SELECT USING (TRUE);  -- Collaborator lists are visible to everyone

CREATE POLICY playlist_collaborators_insert ON prettygood.playlist_collaborators
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE id = prettygood.playlist_collaborators.playlist_id
      AND user_id = prettygood_private.current_user_id()
    )
  );

CREATE POLICY playlist_collaborators_delete ON prettygood.playlist_collaborators
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM prettygood.playlists
      WHERE id = prettygood.playlist_collaborators.playlist_id
      AND user_id = prettygood_private.current_user_id()
    ) OR
    prettygood_private.current_user_id() = user_id  -- Users can remove themselves
  );

-- RLS Policies for Payments table
CREATE POLICY payments_select_admin ON prettygood.payments
  FOR SELECT USING (
    prettygood_private.is_admin()
  );

CREATE POLICY payments_select_own ON prettygood.payments
  FOR SELECT USING (
    sender_id = prettygood_private.current_user_id() OR
    recipient_id = prettygood_private.current_user_id()
  );

CREATE POLICY payments_insert ON prettygood.payments
  FOR INSERT WITH CHECK (
    sender_id = prettygood_private.current_user_id()
  );

-- RLS Policies for User Settings table
CREATE POLICY user_settings_select ON prettygood.user_settings
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY user_settings_insert ON prettygood.user_settings
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_settings_update ON prettygood.user_settings
  FOR UPDATE USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Track Likes table
CREATE POLICY track_likes_select ON prettygood.track_likes
  FOR SELECT USING (TRUE);  -- Everyone can see who liked what

CREATE POLICY track_likes_insert ON prettygood.track_likes
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY track_likes_delete ON prettygood.track_likes
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for Album Likes table
CREATE POLICY album_likes_select ON prettygood.album_likes
  FOR SELECT USING (TRUE);  -- Everyone can see who liked what

CREATE POLICY album_likes_insert ON prettygood.album_likes
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY album_likes_delete ON prettygood.album_likes
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for Playlist Likes table
CREATE POLICY playlist_likes_select ON prettygood.playlist_likes
  FOR SELECT USING (TRUE);  -- Everyone can see who liked what

CREATE POLICY playlist_likes_insert ON prettygood.playlist_likes
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY playlist_likes_delete ON prettygood.playlist_likes
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for Artist Followers table
CREATE POLICY artist_followers_select ON prettygood.artist_followers
  FOR SELECT USING (TRUE);  -- Everyone can see who follows whom

CREATE POLICY artist_followers_insert ON prettygood.artist_followers
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY artist_followers_delete ON prettygood.artist_followers
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for User Library tables
CREATE POLICY user_library_tracks_select ON prettygood.user_library_tracks
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY user_library_tracks_insert ON prettygood.user_library_tracks
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_library_tracks_delete ON prettygood.user_library_tracks
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_library_albums_select ON prettygood.user_library_albums
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY user_library_albums_insert ON prettygood.user_library_albums
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_library_albums_delete ON prettygood.user_library_albums
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_library_artists_select ON prettygood.user_library_artists
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY user_library_artists_insert ON prettygood.user_library_artists
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY user_library_artists_delete ON prettygood.user_library_artists
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for User Recently Played table
CREATE POLICY user_recently_played_select ON prettygood.user_recently_played
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY user_recently_played_insert ON prettygood.user_recently_played
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

-- RLS Policies for Search History table
CREATE POLICY search_history_select ON prettygood.search_history
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

CREATE POLICY search_history_insert ON prettygood.search_history
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY search_history_delete ON prettygood.search_history
  FOR DELETE USING (
    user_id = prettygood_private.current_user_id() OR
    prettygood_private.is_admin()
  );

-- RLS Policies for Play History table
CREATE POLICY play_history_select_admin ON prettygood.play_history
  FOR SELECT USING (
    prettygood_private.is_admin()
  );

CREATE POLICY play_history_select_own ON prettygood.play_history
  FOR SELECT USING (
    user_id = prettygood_private.current_user_id()
  );

CREATE POLICY play_history_select_artist ON prettygood.play_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prettygood.tracks
      WHERE prettygood.tracks.id = prettygood.play_history.track_id
      AND prettygood.tracks.artist_id = prettygood_private.current_user_id()
    )
  );

CREATE POLICY play_history_insert ON prettygood.play_history
  FOR INSERT WITH CHECK (
    user_id = prettygood_private.current_user_id()
  );

-- Add comments
COMMENT ON FUNCTION prettygood_private.current_user_id() IS 'Gets the user ID from the JWT claims';
COMMENT ON FUNCTION prettygood_private.is_authenticated() IS 'Checks if the current request is authenticated';
COMMENT ON FUNCTION prettygood_private.is_admin() IS 'Checks if the current user has the admin role';
COMMENT ON FUNCTION prettygood_private.is_artist() IS 'Checks if the current user is an artist';
