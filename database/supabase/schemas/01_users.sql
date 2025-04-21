-- Users and profiles for the Pretty Good Music application
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  email TEXT UNIQUE NOT NULL,
  wallet_address TEXT UNIQUE,
  profile_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.users IS 'User accounts for the public.music platform';
COMMENT ON COLUMN public.users.wallet_address IS 'Sui blockchain wallet address used for authentication';
COMMENT ON COLUMN public.users.username IS 'Unique username for the user';
COMMENT ON COLUMN public.users.profile_url IS 'URL to the user profile image';
COMMENT ON COLUMN public.users.email_verified IS 'Indicates whether user''s email has been verified';
COMMENT ON COLUMN public.users.role IS 'User role: user, artist, or admin';

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can update their own information" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create updated_at trigger
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_wallet_address ON public.users(wallet_address);
CREATE INDEX idx_users_profile_url ON public.users(profile_url);

-- Create user settings table
CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'auto',
  audio_quality TEXT DEFAULT 'high',
  enable_explicit_content BOOLEAN DEFAULT TRUE,
  enable_autoplay BOOLEAN DEFAULT TRUE,
  enable_crossfade BOOLEAN DEFAULT TRUE,
  crossfade_duration INTEGER DEFAULT 5,
  enable_gapless_playback BOOLEAN DEFAULT TRUE,
  volume_level INTEGER DEFAULT 70,
  enable_equalizer BOOLEAN DEFAULT FALSE,
  equalizer_settings JSONB DEFAULT '{}',
  enable_notifications BOOLEAN DEFAULT TRUE,
  notification_settings JSONB DEFAULT '{}',
  preferred_language TEXT DEFAULT 'en',
  auto_add_to_library BOOLEAN DEFAULT FALSE,
  privacy_level TEXT DEFAULT 'friends',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.user_settings IS 'User preferences and settings';
COMMENT ON COLUMN public.user_settings.theme IS 'User''s preferred theme (light, dark, auto)';
COMMENT ON COLUMN public.user_settings.audio_quality IS 'Preferred audio streaming quality';
COMMENT ON COLUMN public.user_settings.equalizer_settings IS 'JSON with equalizer band settings';
COMMENT ON COLUMN public.user_settings.notification_settings IS 'JSON with notification preferences';
COMMENT ON COLUMN public.user_settings.privacy_level IS 'User''s privacy preference for activity sharing';

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings" ON public.user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER set_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- User registration function that ties into Supabase Auth
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    username,
    email,
    display_name,
    email_verified
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 6)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email_confirmed_at IS NOT NULL
  );
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.handle_new_user();

-- Function to handle email verification
CREATE OR REPLACE FUNCTION auth.handle_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET email_verified = TRUE
  WHERE id = NEW.id AND NEW.email_confirmed_at IS NOT NULL;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for email verification
CREATE TRIGGER on_email_confirmation
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.handle_email_confirmation();
