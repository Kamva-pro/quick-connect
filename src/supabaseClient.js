// supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and API key
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseKey = 'your-public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
