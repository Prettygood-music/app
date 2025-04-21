-- Albums schema for the Pretty Good Music application
CREATE TABLE public.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  release_date DATE,
  cover_url TEXT,
  description TEXT,
  genre TEXT[],
  type TEXT CHECK (type IN ('album', 'ep', 'single', 'compilation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.albums IS 'Music albums on the public.music platform';
COMMENT ON COLUMN public.albums.cover_url IS 'URL to the album cover image';
COMMENT ON COLUMN public.albums.genre IS 'Array of genres associated with the album';
COMMENT ON COLUMN public.albums.type IS 'Type of album release (album, ep, single, compilation)';

-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Albums are viewable by everyone" ON public.albums
  FOR SELECT USING (TRUE);

CREATE POLICY "Artists can create their own albums" ON public.albums
  FOR INSERT WITH CHECK (
    auth.uid() = artist_id AND
    EXISTS (SELECT 1 FROM public.artists WHERE id = auth.uid() AND approved = TRUE)
  );

CREATE POLICY "Artists can update their own albums" ON public.albums
  FOR UPDATE USING (auth.uid() = artist_id);

CREATE POLICY "Artists can delete their own albums" ON public.albums
  FOR DELETE USING (auth.uid() = artist_id);

-- Create trigger for updated_at
CREATE TRIGGER set_album_updated_at
BEFORE UPDATE ON public.albums
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX idx_albums_artist_id ON public.albums(artist_id);
CREATE INDEX idx_albums_title ON public.albums(title);
CREATE INDEX idx_albums_release_date ON public.albums(release_date);
CREATE INDEX idx_albums_cover_url ON public.albums(cover_url);
CREATE INDEX idx_albums_genre ON public.albums USING GIN(genre);

-- Create album_likes table
CREATE TABLE public.album_likes (
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (album_id, user_id)
);

COMMENT ON TABLE public.album_likes IS 'Tracks which users have liked which albums';

-- Enable RLS
ALTER TABLE public.album_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Album likes are viewable by everyone" ON public.album_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can like albums" ON public.album_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike albums" ON public.album_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_album_likes_user_id ON public.album_likes(user_id);

-- Create user_library_albums table
CREATE TABLE public.user_library_albums (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, album_id)
);

COMMENT ON TABLE public.user_library_albums IS 'Albums saved to a user''s library';

-- Enable RLS
ALTER TABLE public.user_library_albums ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own album library" ON public.user_library_albums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add albums to their library" ON public.user_library_albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove albums from their library" ON public.user_library_albums
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_library_albums_album_id ON public.user_library_albums(album_id);

-- Function to add album to library
CREATE OR REPLACE FUNCTION public.add_album_to_library(album_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
