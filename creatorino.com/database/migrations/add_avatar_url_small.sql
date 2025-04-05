-- Add avatar_url_small column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url_small TEXT;

-- Add an index to improve query performance
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url_small ON profiles(avatar_url_small);

-- Comment on the column for documentation
COMMENT ON COLUMN profiles.avatar_url_small IS 'Small version of avatar for profile icon (80x80px)';
