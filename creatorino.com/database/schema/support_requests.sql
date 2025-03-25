-- Support Requests table
CREATE TABLE support_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  email TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('help', 'bug', 'feature')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  send_updates BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  admin_notes TEXT,
  admin_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view and insert their own requests
CREATE POLICY "Users can view their own requests"
  ON support_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own support requests"
  ON support_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to check if user has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policy for full access
CREATE POLICY "Admins can do anything with support requests"
  ON support_requests
  USING (is_admin());

-- Create index for performance
CREATE INDEX idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX idx_support_requests_status ON support_requests(status);
