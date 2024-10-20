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

const HomePage = () => {

  const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  }
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
    tabBarIcon: ({ color }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />, // Updated icon
  }}
  listeners={({ navigation, route }) => ({
    tabPress: async (e) => {
      // Prevent default behavior
      e.preventDefault();

      // Fetch the current userId from Supabase using email
      const userId = await getCurrentUserId();

      if (userId) {
        // Update the QRCodeScreen params with the userId
        navigation.setParams({ userId });
      } else {
        console.log('User not logged in or ID not found');
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
