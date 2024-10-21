import React, { useEffect, useState } from 'react';
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

const HomePage = ({ navigation }) => {
  const [userId, setUserId] = useState(null); // State to store userId
  useEffect(() => {
    const fetchAndSetUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
  
        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }
  
        setUserId(userData.id); // Ensure `setUserId` is called properly
      }
    };
  
    fetchAndSetUserId();
  }, []);

  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarActiveTintColor: 'black', // Set the active tab text/icon color
        tabBarInactiveTintColor: 'gray', // Optional: set the inactive tab color
        tabBarStyle: {
          backgroundColor: 'white', // Set the background color of the tab bar
        },
      }}
      labeled={true} 
      barStyle={{ backgroundColor: 'white' }} 
      activeColor="black"
    >
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
        initialParams={{ userId }} // Pass userId as initial params
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
