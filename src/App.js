import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './screens/Auth'
import Account from './screens/Account'
import { View } from 'react-native'
import {LoginScreen} from './screens/LoginScreen'
import { Session } from '@supabase/supabase-js'

export default function App() {
 
  return (
    <View>
      <LoginScreen/>
    </View>
  )
}