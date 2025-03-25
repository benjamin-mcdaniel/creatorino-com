-- User Roles table for access control
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Only admins can manage roles
CREATE POLICY "Admins can select roles"
  ON user_roles
  FOR SELECT
  USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
  ON user_roles
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update roles"
  ON user_roles
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Only admins can delete roles"
  ON user_roles
  FOR DELETE
  USING (is_admin());

-- Create index
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
