-- Artists schema for the Pretty Good Music application
CREATE TABLE prettygood.artists (
  id UUID PRIMARY KEY REFERENCES prettygood.users(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  bio TEXT,
  genre TEXT[],
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  application_date TIMESTAMPTZ,
  application_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE prettygood.artists IS 'Artist profiles for the prettygood.music platform';
COMMENT ON COLUMN prettygood.artists.genre IS 'Array of genres associated with the artist';
COMMENT ON COLUMN prettygood.artists.social_links IS 'JSON containing social media links';
COMMENT ON COLUMN prettygood.artists.verified IS 'Whether the artist has been verified by the platform';
COMMENT ON COLUMN prettygood.artists.approved IS 'Whether the artist application has been approved';

-- Enable RLS
ALTER TABLE prettygood.artists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artists are viewable by everyone" ON prettygood.artists
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can update their own profiles" ON prettygood.artists
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can apply to become artists" ON prettygood.artists
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER set_artist_updated_at
BEFORE UPDATE ON prettygood.artists
FOR EACH ROW EXECUTE FUNCTION prettygood.set_updated_at();

-- Create indexes
CREATE INDEX idx_artists_name ON prettygood.artists(artist_name);
CREATE INDEX idx_artists_genre ON prettygood.artists USING GIN(genre);

-- Function to apply for artist account
CREATE OR REPLACE FUNCTION prettygood.apply_for_artist_account(
  artist_name TEXT,
  bio TEXT DEFAULT NULL,
  genre TEXT[] DEFAULT '{}',
  location TEXT DEFAULT NULL,
  website TEXT DEFAULT NULL,
  social_links JSONB DEFAULT NULL,
  application_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for admins to approve artist applications
CREATE OR REPLACE FUNCTION prettygood.approve_artist_application(
  artist_id UUID,
  approved BOOLEAN,
  admin_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create artist_followers table
CREATE TABLE prettygood.artist_followers (
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (artist_id, user_id)
);

COMMENT ON TABLE prettygood.artist_followers IS 'Tracks which users follow which artists';

-- Enable RLS
ALTER TABLE prettygood.artist_followers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Artist followers are viewable by everyone" ON prettygood.artist_followers
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can follow artists" ON prettygood.artist_followers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow artists" ON prettygood.artist_followers
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_artist_followers_user_id ON prettygood.artist_followers(user_id);
