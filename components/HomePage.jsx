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

const getCurrentUserEmail = async () => {
  const currentUser = auth().currentUser;
  if (currentUser) {
    return currentUser.email; // Return the Firebase user email
  } else {
    console.log('No user is currently logged in');
    return null;
  }
};
const HomePage = () => {

  const getSupabaseUserIdByEmail = async (email) => {
    const { data, error } = await supabase
      .from('users') // Replace 'users' with your table name if different
      .select('uid') // Select the uid column
      .eq('email', email) // Use the email to filter
      .single(); // Expecting a single result
  
    if (error) {
      console.error('Error fetching user ID from Supabase:', error);
      return null;
    }
  
    return data?.uid;
  };
  return (
    <Tab.Navigator labeled={true} barStyle={{ backgroundColor: 'white' }} activeColor="black">
      <Tab.Screen
        name="Home"
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
    ), // QR code icon
  }}
  listeners={({ navigation }) => ({
    tabPress: async (e) => {
      // Prevent default behavior
      e.preventDefault();

      // Get the current Firebase user email

      if (email) {
        // Fetch the Supabase user ID using the email
        const userId = await getSupabaseUserIdByEmail(email);

        if (userId) {
          // Pass the Supabase uid to QRCodeScreen
          navigation.setParams({ userId });
        } else {
          console.log('No Supabase user ID found for this email');
        }
      } else {
        console.log('No Firebase email found');
      }
    },
  })}
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
