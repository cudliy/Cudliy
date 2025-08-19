-- Add role-based fields to waitlist table
ALTER TABLE public.waitlist 
ADD COLUMN path TEXT,
ADD COLUMN role TEXT,
ADD COLUMN experience TEXT,
ADD COLUMN goals TEXT,
ADD COLUMN printer_setup TEXT,
ADD COLUMN business_name TEXT,
ADD COLUMN website TEXT;

-- Add constraint to ensure path is one of the valid options
ALTER TABLE public.waitlist 
ADD CONSTRAINT valid_path CHECK (
  path IN (
    'creator',
    'maker'
  )
);

-- Add constraint to ensure role is one of the valid options
ALTER TABLE public.waitlist 
ADD CONSTRAINT valid_role CHECK (
  role IN (
    'browser',
    'light_customizer', 
    'hobbyist_designer',
    'entrepreneurial_designer',
    'individual_printer',
    'small_business_partner'
  )
);

-- Add indexes for better query performance
CREATE INDEX idx_waitlist_path ON public.waitlist(path);
CREATE INDEX idx_waitlist_role ON public.waitlist(role);
CREATE INDEX idx_waitlist_path_role ON public.waitlist(path, role);
