import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://fhsiqyrooyysetinpvwf.supabase.co/"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoc2lxeXJvb3l5c2V0aW5wdndmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzgyNjAsImV4cCI6MjA0MTQ1NDI2MH0.DFgLCEv23lZ32eF-Z0vYJ0Xo8nd0AmMHj08ShkXDd-M"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

