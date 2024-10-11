import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './screens/Auth'
import Account from './screens/Account'
import { View } from 'react-native'
import {LoginScreen} from './screens/LoginScreen'
import { Session } from '@supabase/supabase-js'

export default function App() {
  // const [session, setSession] = useState<Session | null>(null)

  // useEffect(() => {
  //   console.log('useEffect is triggered');  // Check if useEffect runs
  
  //   supabase.auth.getSession().then((response) => {
  //     console.log('Response from getSession:', response);
  //     const sessionData = response?.data?.session || null;
  //     setSession(sessionData);
  //   });
  
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     console.log('Auth state changed:', session);
  //     setSession(session);
  //   });
  // }, []);
  

  return (
    <View>
      <LoginScreen/>
      {/* {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />} */}
    </View>
  )
}