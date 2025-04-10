-- Migration: 009_create_settings.sql
-- Description: Creates user settings and preferences tables for the prettygood.music application

-- User settings
CREATE TABLE IF NOT EXISTS prettygood.user_settings (
  user_id UUID PRIMARY KEY REFERENCES prettygood.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'auto', -- 'light', 'dark', 'auto'
  audio_quality TEXT DEFAULT 'high', -- 'low', 'medium', 'high', 'auto'
  enable_explicit_content BOOLEAN DEFAULT TRUE,
  enable_autoplay BOOLEAN DEFAULT TRUE,
  enable_crossfade BOOLEAN DEFAULT TRUE,
  crossfade_duration INTEGER DEFAULT 5, -- Seconds
  enable_gapless_playback BOOLEAN DEFAULT TRUE,
  volume_level INTEGER DEFAULT 70, -- 0-100
  enable_equalizer BOOLEAN DEFAULT FALSE,
  equalizer_settings JSONB DEFAULT '{}',
  enable_notifications BOOLEAN DEFAULT TRUE,
  notification_settings JSONB DEFAULT '{}',
  preferred_language TEXT DEFAULT 'en',
  auto_add_to_library BOOLEAN DEFAULT FALSE,
  privacy_level TEXT DEFAULT 'friends', -- 'private', 'friends', 'public'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Search history
CREATE TABLE IF NOT EXISTS prettygood.search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES prettygood.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER set_user_settings_updated_at
BEFORE UPDATE ON prettygood.user_settings
FOR EACH ROW
EXECUTE FUNCTION prettygood_private.set_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON prettygood.search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON prettygood.search_history(searched_at);

-- Comments for documentation
COMMENT ON TABLE prettygood.user_settings IS 'User preferences and settings';
COMMENT ON TABLE prettygood.search_history IS 'History of user search queries';
COMMENT ON COLUMN prettygood.user_settings.theme IS 'User''s preferred theme (light, dark, auto)';
COMMENT ON COLUMN prettygood.user_settings.audio_quality IS 'Preferred audio streaming quality';
COMMENT ON COLUMN prettygood.user_settings.equalizer_settings IS 'JSON with equalizer band settings';
COMMENT ON COLUMN prettygood.user_settings.notification_settings IS 'JSON with notification preferences';
COMMENT ON COLUMN prettygood.user_settings.privacy_level IS 'User''s privacy preference for activity sharing';
