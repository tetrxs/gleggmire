-- Add notifications_enabled column to users table (default true)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true;
