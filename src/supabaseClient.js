
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhsiqyrooyysetinpvwf.supabase.co'

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoc2lxeXJvb3l5c2V0aW5wdndmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTg3ODI2MCwiZXhwIjoyMDQxNDU0MjYwfQ.dNUSMmm_MJXtV2k-CWUmk1m_E9V8w3F1Guyg3LOTYVc"
export const supabase = createClient(supabaseUrl, supabaseKey)
