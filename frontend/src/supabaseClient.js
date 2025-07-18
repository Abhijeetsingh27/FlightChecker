import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables', { supabaseUrl, supabaseAnonKey });
  // Consider throwing an error or showing a user-friendly message
  // depending on how you want to handle missing keys in production.
  // For development, throwing is fine.
  throw new Error('Supabase credentials not set in frontend environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 