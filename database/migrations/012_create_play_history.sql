-- Migration: 012_create_play_history.sql
-- Description: Creates play history table for tracking user listening activity

-- Play history table
CREATE TABLE IF NOT EXISTS prettygood.play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID NOT NULL REFERENCES prettygood.tracks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  play_duration INTEGER, -- in seconds
  completed BOOLEAN DEFAULT FALSE,
  source TEXT, -- where the play came from (search, playlist, album, etc.)
  context_id UUID, -- ID of the source context (playlist ID, album ID, etc.)
  context_type TEXT, -- type of context (playlist, album, artist, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_play_history_track_id ON prettygood.play_history(track_id);
CREATE INDEX IF NOT EXISTS idx_play_history_user_id ON prettygood.play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_played_at ON prettygood.play_history(played_at);

-- Check if context_id and context_type columns exist before creating indexes
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'context_id'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_play_history_context_id ON prettygood.play_history(context_id)';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'context_type'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS idx_play_history_context_type ON prettygood.play_history(context_type)';
    END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE prettygood.play_history IS 'Records each time a user plays a track';
COMMENT ON COLUMN prettygood.play_history.track_id IS 'Reference to the track that was played';
COMMENT ON COLUMN prettygood.play_history.user_id IS 'Reference to the user who played the track';
COMMENT ON COLUMN prettygood.play_history.played_at IS 'When the track was played';
COMMENT ON COLUMN prettygood.play_history.play_duration IS 'How long the track was played in seconds';
COMMENT ON COLUMN prettygood.play_history.completed IS 'Whether the track was played to completion';
COMMENT ON COLUMN prettygood.play_history.source IS 'Where the play came from (search, playlist, album, etc.)';

-- Add comments for context_id and context_type only if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'context_id'
    ) THEN
        EXECUTE 'COMMENT ON COLUMN prettygood.play_history.context_id IS ''ID of the source context (playlist ID, album ID, etc.)''';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'prettygood' 
        AND table_name = 'play_history' 
        AND column_name = 'context_type'
    ) THEN
        EXECUTE 'COMMENT ON COLUMN prettygood.play_history.context_type IS ''Type of context (playlist, album, artist, etc.)''';
    END IF;
END $$;
