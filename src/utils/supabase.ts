import { createClient } from "@supabase/supabase-js";

// Try environment variables first
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Environment variables loaded:', {
  url: supabaseUrl ? 'defined' : 'undefined',
  key: supabaseKey ? 'defined' : 'undefined'
});

// Fallback to hardcoded values if environment variables fail
const finalUrl = supabaseUrl || 'https://vbuwmtyjknaxbnxsfisf.supabase.co';
const finalKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZidXdtdHlqa25heGJueHNmaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMTkzNTYsImV4cCI6MjA5Mzg5NTM1Nn0.nQM_tZgjpnBPpv3M4CUV54U-y6uogFSA7Dv30uJxoQM';

console.log('Using Supabase URL:', finalUrl);
console.log('Using Supabase Key length:', finalKey.length);

export const supabase = createClient(finalUrl, finalKey);
