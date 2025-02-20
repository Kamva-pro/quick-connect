import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../supabase';
import { auth } from '../firebase'; 
import { useNavigation } from '@react-navigation/native'; 


// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const radius = 6371e3; // Earth's radius in meters

  const lat1 = toRad(coords1.latitude);
  const lat2 = toRad(coords2.latitude);
  const deltaLat = toRad(coords2.latitude - coords1.latitude);
  const deltaLon = toRad(coords2.longitude - coords1.longitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c; // Distance in meters
};

const Nearby = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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
  
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        try {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', currentUser.email) 
            .single();
  
          if (fetchError) {
            throw fetchError;
          }
  
          const currentUserId = userData.id; 
          console.log('Current User ID:', currentUserId); 
  
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
                userId: userLoc.user_id, 
                username: userData.username, 
                distance: Math.round(distance), 
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

  const renderUserCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.userId})} 
    >

<View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.textContainer}>

      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.distance}>{item.distance} meters away</Text>
      </View>

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
          keyExtractor={(item) => item.userId.toString()} 
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
    flexDirection: 'row', 
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#000', 
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  distance: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Nearby;
