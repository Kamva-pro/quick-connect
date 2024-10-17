
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fkcfwgufszcmueltoxao.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase