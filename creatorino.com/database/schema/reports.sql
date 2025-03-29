-- Reported Users Table: For tracking users who have been reported
CREATE TABLE IF NOT EXISTS public.reported_users (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_reported TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  report_count INTEGER DEFAULT 1 NOT NULL,
  status TEXT DEFAULT 'normal' NOT NULL -- 'normal', 'flagged', 'warned', 'restricted'
);

-- Set up RLS policies
ALTER TABLE public.reported_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view reports
CREATE POLICY "Only admins can view reported users" 
  ON public.reported_users FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = true
  ));

-- Only admins can update reports directly
CREATE POLICY "Only admins can update reported users" 
  ON public.reported_users FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE is_admin = true
  ));

-- Anyone can report a user
CREATE POLICY "Anyone can report users" 
  ON public.reported_users FOR INSERT 
  WITH CHECK (true);

-- Add is_admin column to profiles if not exists
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for report status
CREATE INDEX IF NOT EXISTS idx_reported_users_status ON public.reported_users(status);
