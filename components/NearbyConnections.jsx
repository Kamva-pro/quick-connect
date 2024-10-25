import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../supabase'; // Supabase client setup
import { auth } from '../firebase'; // Firebase auth setup
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const Nearby = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State for current user's Supabase ID

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      // Get the current user's location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
  
      // Get the current user from Firebase
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        try {
          // Fetch the user record from Supabase to get the user ID
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', currentUser.email) // Match by email
            .single(); // Ensure we get a single record
  
          if (fetchError) {
            throw fetchError;
          }
  
          const currentUserId = userData.id; 
          console.log('Current User ID:', currentUserId); // Log to debug
  
          // Fetch all user locations from Supabase
          const { data: userLocations, error: locationError } = await supabase
            .from('user_locations')
            .select('user_id, latitude, longitude');
  
          if (locationError) {
            throw locationError;
          }
  
          // For each user, fetch their username from the 'users' table
          const usersWithDistance = await Promise.all(
            userLocations.map(async (userLoc) => {
              // Fetch the username using the user_id
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('id', userLoc.user_id)
                .single();
  
              if (userError) {
                throw userError;
              }
  
              // Calculate the distance between the current user and each nearby user
              const distance = haversineDistance(
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: userLoc.latitude, longitude: userLoc.longitude }
              );
  
              return {
                userId: userLoc.user_id, // Add user ID here
                username: userData.username, // Username from the 'users' table
                distance: Math.round(distance), // Distance in meters
              };
            })
          );
  
          // Filter out the current user
          const filteredUsers = usersWithDistance.filter(user => user && user.userId !== currentUserId);
  
          // Sort users by distance (nearest first)
          const sortedUsers = filteredUsers.sort((a, b) => a.distance - b.distance);
  
          setNearbyUsers(sortedUsers);
        } catch (err) {
          console.error('Error fetching nearby users:', err);
          Alert.alert('Error', 'Could not fetch nearby users.');
        }
      } else {
        console.error('No current user found'); // Log if no current user
        setErrorMsg('No current user found');
      }
    };
  
    fetchNearbyUsers();
  }, []);
   // Fetch nearby users when currentUserId changes

  // Render the user cards
  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.userId})} // Navigate to UserProfile with userId
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.distance}>{item.distance} meters away</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <FlatList
          data={nearbyUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.userId.toString()} // Ensure the keyExtractor uses userId
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // For Android shadow
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  distance: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Nearby;
