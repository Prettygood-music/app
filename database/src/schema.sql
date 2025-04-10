-- Schema definition for prettygood.music platform
-- This file serves as a reference for the overall database structure
-- and is used for documentation and to generate TypeScript types

-- Users table
CREATE TABLE prettygood.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE,
  profile_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artists table (extends users)
CREATE TABLE prettygood.artists (
  id UUID PRIMARY KEY REFERENCES prettygood.users(id) ON DELETE CASCADE,
  artist_name TEXT NOT NULL,
  bio TEXT,
  genre TEXT[],
  location TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Albums table
CREATE TABLE prettygood.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  release_date DATE,
  cover_url TEXT,
  description TEXT,
  genre TEXT[],
  type TEXT CHECK (type IN ('album', 'ep', 'single', 'compilation')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracks table
CREATE TABLE prettygood.tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES prettygood.albums(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL, -- Duration in seconds
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  track_number INTEGER,
  lyrics TEXT,
  genre TEXT[] NOT NULL DEFAULT '{}',
  explicit BOOLEAN DEFAULT FALSE,
  release_date DATE,
  isrc TEXT, -- International Standard Recording Code
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Playlists table
CREATE TABLE prettygood.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Playlist tracks junction table
CREATE TABLE prettygood.playlist_tracks (
  playlist_id UUID NOT NULL REFERENCES prettygood.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  position INTEGER NOT NULL, -- Position in the playlist (for ordering)
  PRIMARY KEY (playlist_id, track_id)
);

-- Track play history
CREATE TABLE prettygood.play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  play_duration INTEGER, -- Duration of play in seconds
  completed BOOLEAN DEFAULT FALSE, -- Whether the track was played to completion
  source TEXT, -- Where the play originated (playlist, album, search, etc.)
  context_id UUID,  -- ID of the context (playlist, album, etc.)
  context_type TEXT, -- Type of context (playlist, album, etc.)
  client_ip TEXT,
  user_agent TEXT
);

-- Payments table for tipping
CREATE TABLE prettygood.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE SET NULL,
  recipient_id UUID NOT NULL REFERENCES prettygood.artists(id) ON DELETE SET NULL,
  amount NUMERIC(20, 9) NOT NULL, -- Support for small denominations of crypto
  currency TEXT NOT NULL DEFAULT 'SUI',
  transaction_hash TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('tip', 'subscription', 'purchase')),
  track_id UUID REFERENCES prettygood.tracks(id) ON DELETE SET NULL,
  album_id UUID REFERENCES prettygood.albums(id) ON DELETE SET NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Views for play counts
CREATE VIEW prettygood.track_play_counts AS
SELECT 
    track_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
GROUP BY 
    track_id;

CREATE VIEW prettygood.artist_play_counts AS
SELECT 
    tracks.artist_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
JOIN 
    prettygood.tracks ON play_history.track_id = tracks.id
GROUP BY 
    tracks.artist_id;

CREATE VIEW prettygood.album_play_counts AS
SELECT 
    tracks.album_id,
    COUNT(*) as play_count
FROM 
    prettygood.play_history
JOIN 
    prettygood.tracks ON play_history.track_id = tracks.id
WHERE 
    tracks.album_id IS NOT NULL
GROUP BY 
    tracks.album_id;
