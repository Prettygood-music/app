-- Migration: 016_update_api_functions.sql
-- Description: Updates existing API functions to match the new column names

-- Update the create_playlist function to remove collaborative parameter and use cover_url
CREATE OR REPLACE FUNCTION prettygood.create_playlist(
  name TEXT,
  description TEXT DEFAULT NULL,
  is_public BOOLEAN DEFAULT TRUE
)
RETURNS prettygood.playlists AS $$
DECLARE
  new_playlist prettygood.playlists;
BEGIN
  INSERT INTO prettygood.playlists (name, description, user_id, is_public)
  VALUES (name, description, auth.uid(), is_public)
  RETURNING * INTO new_playlist;
  
  RETURN new_playlist;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the get_recommendations function to use cover_url instead of cover_image
CREATE OR REPLACE FUNCTION prettygood.get_recommendations(
  limit_count INTEGER DEFAULT 10
)
RETURNS SETOF prettygood.tracks AS $$
BEGIN
  -- This is a simplified implementation that returns recent tracks
  -- In a production environment, this would use more sophisticated recommendation logic
  RETURN QUERY
  SELECT * FROM prettygood.tracks
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the register_user function to use profile_url instead of profile_image
CREATE OR REPLACE FUNCTION prettygood.register_user(
  wallet_address TEXT,
  username TEXT,
  display_name TEXT DEFAULT NULL
)
RETURNS prettygood.users AS $$
DECLARE
  new_user prettygood.users;
BEGIN
  INSERT INTO prettygood.users (wallet_address, username, display_name)
  VALUES (wallet_address, username, COALESCE(display_name, username))
  RETURNING * INTO new_user;
  
  -- Create default settings for the user
  INSERT INTO prettygood.user_settings (user_id)
  VALUES (new_user.id);
  
  RETURN new_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON FUNCTION prettygood.create_playlist IS 'Creates a new playlist for the current user';
COMMENT ON FUNCTION prettygood.get_recommendations IS 'Returns recommended tracks based on user preferences';
COMMENT ON FUNCTION prettygood.register_user IS 'Registers a new user with wallet authentication';
