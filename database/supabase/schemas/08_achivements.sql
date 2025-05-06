-- Achievement definitions table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('Common', 'Rare', 'Legendary')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.achievements IS 'Achievement definitions for the Pretty Good Music platform';
COMMENT ON COLUMN public.achievements.id IS 'Unique identifier for the achievement';
COMMENT ON COLUMN public.achievements.title IS 'Title of the achievement';
COMMENT ON COLUMN public.achievements.description IS 'Description of the achievement';
COMMENT ON COLUMN public.achievements.image IS 'URL to the achievement image';
COMMENT ON COLUMN public.achievements.category IS 'Category of the achievement';
COMMENT ON COLUMN public.achievements.rarity IS 'Rarity level: Common, Rare, or Legendary';

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can manage achievements" ON public.achievements
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Create trigger for updated_at
CREATE TRIGGER set_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create indexes
CREATE INDEX idx_achievements_rarity ON public.achievements(rarity);
CREATE INDEX idx_achievements_category ON public.achievements(category);

-- User achievements join table
CREATE TABLE public.user_achievements (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  obtained_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blockchain_address TEXT NOT NULL CHECK (blockchain_address ~ '^0x[a-fA-F0-9]{64}$'),
  PRIMARY KEY (user_id, achievement_id)
);

-- Add comments
COMMENT ON TABLE public.user_achievements IS 'Links users to the achievements they have earned';
COMMENT ON COLUMN public.user_achievements.user_id IS 'Reference to the user ID';
COMMENT ON COLUMN public.user_achievements.achievement_id IS 'Reference to the achievement ID';
COMMENT ON COLUMN public.user_achievements.obtained_at IS 'Timestamp when the user obtained the achievement';
COMMENT ON COLUMN public.user_achievements.blockchain_address IS 'SUI blockchain object address for the achievement';

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "User achievements are viewable by everyone" ON public.user_achievements
  FOR SELECT USING (TRUE);

CREATE POLICY "Only admins can award achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can modify user achievements" ON public.user_achievements
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can delete user achievements" ON public.user_achievements
  FOR DELETE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Create indexes
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Function to award an achievement to a user
CREATE OR REPLACE FUNCTION public.award_achievement(
  user_id UUID,
  achievement_id UUID,
  blockchain_address TEXT
)
RETURNS JSONB AS $$
DECLARE
  current_user_id UUID := auth.uid();
  current_user_role TEXT;
  result JSONB;
BEGIN
  -- Check administrator privileges
  SELECT role INTO current_user_role FROM public.users WHERE id = current_user_id;
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Administrator privileges required';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = user_id) THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Check if achievement exists
  IF NOT EXISTS (SELECT 1 FROM public.achievements WHERE id = achievement_id) THEN
    RAISE EXCEPTION 'Achievement not found';
  END IF;
  
  -- Check if the address format is valid
  IF blockchain_address !~ '^0x[a-fA-F0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid SUI blockchain address format';
  END IF;
  
  -- Check if user already has this achievement
  IF EXISTS (SELECT 1 FROM public.user_achievements WHERE user_id = award_achievement.user_id AND achievement_id = award_achievement.achievement_id) THEN
    RAISE EXCEPTION 'User already has this achievement';
  END IF;
  
  -- Award the achievement
  INSERT INTO public.user_achievements (
    user_id,
    achievement_id,
    obtained_at,
    blockchain_address
  )
  VALUES (
    user_id,
    achievement_id,
    NOW(),
    blockchain_address
  );
  
  -- Return result
  SELECT 
    json_build_object(
      'user_id', user_id,
      'achievement_id', achievement_id,
      'title', a.title,
      'rarity', a.rarity,
      'awarded_at', NOW()
    ) INTO result
  FROM public.achievements a
  WHERE a.id = achievement_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for getting all user achievements with details
CREATE OR REPLACE VIEW public.user_achievement_details AS
SELECT
  ua.user_id,
  ua.achievement_id,
  a.title,
  a.description,
  a.image,
  a.category,
  a.rarity,
  ua.obtained_at,
  ua.blockchain_address
FROM
  public.user_achievements ua
JOIN
  public.achievements a ON ua.achievement_id = a.id;

COMMENT ON VIEW public.user_achievement_details IS 'Detailed view of user achievements with all achievement information';