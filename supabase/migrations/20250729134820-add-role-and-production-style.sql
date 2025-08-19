-- Add role, experience, and production_style columns to waitlist table
ALTER TABLE public.waitlist 
ADD COLUMN role TEXT NOT NULL DEFAULT 'designer' CHECK (role IN ('designer', 'maker')),
ADD COLUMN experience TEXT CHECK (experience IN ('No Experience', 'Basic CAD Knowledge', 'Advanced Designer')),
ADD COLUMN production_style TEXT CHECK (production_style IN ('Digital Production', 'Handcrafted Production', 'Hybrid'));

-- Update the unique constraint to include role (same email can have different roles)
ALTER TABLE public.waitlist DROP CONSTRAINT IF EXISTS waitlist_email_key;
ALTER TABLE public.waitlist ADD CONSTRAINT waitlist_email_role_key UNIQUE (email, role);
