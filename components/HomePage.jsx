import React, { useState } from 'react';
import { View, Text } from 'react-native';
import QRCodeScreen from './QRCodeScreen';
import EditProfileScreen from './EditProfileScreen';
import ProfileScreen from './ProfileScreen'
import HomeScreen from './HomeScreen';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import  MaterialCommunityIcons  from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createMaterialBottomTabNavigator();

const HomePage = () => {

  return (
    <NavigationContainer>
    <Tab.Navigator labeled={false} barStyle={{ backgroundColor: 'black' }} activeColor="white" >
      <Tab.Screen name="Home" component={HomeScreen}            
      options={{
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26}/>
        ),
    }}/>
      <Tab.Screen name="Search" component={QRCodeScreen}        // Search Screen
      options={{
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26}/>
        ),
    }}/>
      <Tab.Screen name="Notification" component={ProfileScreen}      // Notification Screen
      options={{
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={26}/>
        ),
    }}/>
      <Tab.Screen name="Profile" component={EditProfileScreen}            // Profile Screen
      options={{
        tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
        ),
    }}/>
    </Tab.Navigator>
    </NavigationContainer>
  );
};

export default HomePage;
