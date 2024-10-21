import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './HomeScreen';
import QRCodeScreen from './QRCodeScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import { supabase } from '../supabase';
import { auth } from '../firebase'; 


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const userId = null

  const user = auth.currentUser; // Get the currently authenticated user

  if (user) {
    // Fetch the user record from Supabase to get the user ID
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('id') 
      .eq('email', user.email)
      .single();

    if (fetchError) throw fetchError; // Handle fetching error

    userId = userData.id;
  }
  else{
    navigation.navigate('Login');
  }


const HomePage = () => {

  return (
    <Tab.Navigator labeled={true} barStyle={{ backgroundColor: 'white' }} activeColor="black">
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />

     <Tab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />
          ), 
        }}
        initialParams={userId}
      />

      <Tab.Screen
        name="Notification"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="heart" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={EditProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
