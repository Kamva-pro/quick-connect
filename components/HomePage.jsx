// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// import HomeScreen from './HomeScreen';
// import QRCodeScreen from './QRCodeScreen';
// import ProfileScreen from './ProfileScreen';
// import EditProfileScreen from './EditProfileScreen';
// import { supabase } from '../supabase';
// import { auth } from '../firebase'; 
// import Nearby from './NearbyConnections';
// import Scan from './ScanScreen';
// import Connections from './Connections';

// const Tab = createMaterialBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const HomePage = ({ navigation }) => {
  

//   return (
//     <Tab.Navigator 
//       screenOptions={{
//         tabBarActiveTintColor: 'black', // Set the active tab text/icon color
//         tabBarInactiveTintColor: 'gray', // Optional: set the inactive tab color
//         tabBarStyle: {
//           backgroundColor: 'white', // Set the background color of the tab bar
//         },
//       }}
//       labeled={true} 
//       barStyle={{ backgroundColor: 'white' }} 
//       activeColor="black"
//     >
//       <Tab.Screen
//         name="Connections"
//         component={Connections}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
//         }}
//       />

//       <Tab.Screen
//         name="QRCode"
//         component={QRCodeScreen}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />
//           ), 
//           headerTitle: "QRCode"
//         }}
//       />

//       <Tab.Screen
//         name="Nearby"
//         component={Nearby}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker" color={color} size={26} />,
//           headerTitle: "Nearby Connections"

//         }}
//       />

      
//       <Tab.Screen
//         name="Profile"
//         component={EditProfileScreen}
//         options={{
//           tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" color={color} size={26} />,
//           headerTitle: "Edit Profile"

//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default HomePage;
import React, { useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../firebase'; // Import authentication from Firebase
import { supabase } from '../supabase'; // Import Supabase client
import Connections from './Connections';
import QRCodeScreen from './QRCodeScreen';
import Nearby from './NearbyConnections';
import EditProfileScreen from './EditProfileScreen';

const Tab = createMaterialBottomTabNavigator();

const HomePage = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        await retrieveAndStoreLocation(user.email); // Pass email to retrieve user ID
      } else {
        console.log('No user is signed in.');
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const retrieveAndStoreLocation = async (userEmail) => {
    try {
      // Fetch the user record from Supabase to get the user ID
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail) // Match by email
        .single(); // Ensure we get a single record

      if (fetchError) {
        throw fetchError;
      }

      const userId = userData.id; // Get the user ID

      // Check if the device is a physical device
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('This will not work on an Android Emulator. Try it on your device!');
        return;
      }

      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get the current location
      let loc = await Location.getCurrentPositionAsync({});
      console.log('Current Location:', loc);

      // Save location data
      // await saveLocationData({ userId, location: loc.coords });
    } catch (error) {
      console.error('Error retrieving location:', error);
      Alert.alert('Error', 'Could not retrieve location. Please try again.');
    }
  };

  // const saveLocationData = async (data) => {
  //   try {
  //     const response = await fetch('https://your-backend-endpoint.com/saveLocation', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save location data');
  //     }

  //     const result = await response.json();
  //     console.log('Location saved:', result);
  //   } catch (error) {
  //     console.error('Error saving location:', error);
  //     Alert.alert('Error', 'Could not save location data.');
  //   }
  // };

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
        component={Connections}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="QRCode"
        component={QRCodeScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />,
          headerTitle: "QRCode",
        }}
      />
      <Tab.Screen
        name="Nearby"
        component={Nearby}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map-marker" color={color} size={26} />,
          headerTitle: "Nearby Connections",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={EditProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-circle" color={color} size={26} />,
          headerTitle: "Edit Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePage;
