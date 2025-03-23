// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Add this enhanced logging helper
export const logSupabaseError = (context, error, additionalInfo = {}) => {
  console.error(`[Supabase Error] ${context}:`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    ...additionalInfo
  });
  
  // You could also send severe errors to a monitoring service here
};
