import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseUrl !== 'your-supabase-project-url' && supabaseAnonKey && supabaseAnonKey !== 'your-supabase-anon-key');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info('[Supabase] Missing configuration. App will run in mock/local mode.');
}
