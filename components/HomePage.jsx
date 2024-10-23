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
import Nearby from './NearbyConnections';
import Scan from './ScanScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomePage = ({ navigation }) => {
  

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
        name="Connections"
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
          headerTitle: "QRCode"
        }}
      />

      <Tab.Screen
        name="Nearby"
        component={Nearby}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker" color={color} size={26} />,
          headerTitle: "Nearby Connections"

        }}
      />

      <Tab.Screen
        name="Profile"
        component={EditProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" color={color} size={26} />,
          headerTitle: "Edit Profile"

        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
