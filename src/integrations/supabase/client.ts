import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sxewgxneoiituwexywwd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4ZXdneG5lb2lpdHV3ZXh5d3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTc0MDIsImV4cCI6MjA2OTM3MzQwMn0.OmufNacRTxDMmzTAmlrp_0ln4ur60x7cFJJ2LWCMU-E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});