import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_APP_ANON_KEY);

export const supabaseAdmin = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_APP_SUPABASE_SERVICE_ROL_KEY);