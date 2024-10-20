import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeScreen from './HomeScreen';
import QRCodeScreen from './QRCodeScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomePage = () => {
  return (
    <Tab.Navigator labeled={true} barStyle={{ backgroundColor: 'black' }} activeColor="white">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify" color={color} size={26} />,
        }}
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
