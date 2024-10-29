import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../supabase'; 
import { auth } from '../firebase';

import QRCodeScreen from './QRCodeScreen';
import EditProfileScreen from './EditProfileScreen';
import Connections from './Connections';
import Nearby from './NearbyConnections';
import Requests from './Requests';

const Tab = createMaterialBottomTabNavigator();

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on an Android Emulator. Try it on a real device!');
        return;
      }

      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Get current authenticated user from Firebase and store location in Supabase
      const user = auth.currentUser;
      if (user) {
        try {
          // Fetch the user ID from Supabase
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email) // Match by email
            .single();

          if (fetchError) {
            throw fetchError;
          }

          const userId = userData.id;

          // Save or update the user's location in Supabase
          const { data, error } = await supabase
            .from('user_locations')
            .upsert({
              user_id: userId,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            })
            .single(); 

          if (error) {
            console.error('Error saving location:', error);
            Alert.alert('Error', 'Could not save location.');
          } else {
            console.log('Location saved successfully:', data);
          }
        } catch (err) {
          console.error('Error fetching user or saving location:', err);
        }
      }
    })();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black', 
        tabBarInactiveTintColor: 'gray', 
        tabBarStyle: {
          backgroundColor: 'white', 
        },
      }}
      labeled={true}
      barStyle={{ backgroundColor: 'white' }}
      activeColor="black"
    >
      <Tab.Screen
        name="Network"
        component={Connections}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-multiple" color={color} size={26} />
          ),
        }}
      />

<Tab.Screen
        name="Requests"
        component={Requests}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-plus" color={color} size={26} />
          ),
        }}
      />


      <Tab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />
          ),
          headerTitle: 'QRCode',
        }}
      />

      <Tab.Screen
        name="Nearby"
        component={Nearby}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker" color={color} size={26} />
          ),
          headerTitle: 'Nearby Connections',
        }}
      />

      <Tab.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26} />
          ),
          headerTitle: 'Edit Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
