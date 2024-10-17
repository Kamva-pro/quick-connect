import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@env'; 

export const supabase = createClient("https://fkcfwgufszcmueltoxao.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrY2Z3Z3Vmc3pjbXVlbHRveGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNDYwMDIsImV4cCI6MjA0NDcyMjAwMn0.DhFuuw8_TF_9tCw_69G0APJI5ZUD8a8kqVby1OD8DJ4");
