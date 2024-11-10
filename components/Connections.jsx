import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image, Button, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';
import { auth } from '../firebase';
import * as Location from 'expo-location';

const Tab = createMaterialTopTabNavigator();

const Connections = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Nearby Users" component={NearbyUsersTab} />
      <Tab.Screen name="Connection Requests" component={RequestsTab} />
    </Tab.Navigator>
  );
};

// First Tab: Nearby Users and Connections List
const NearbyUsersTab = () => {
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState(null);

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

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', currentUser.email)
            .single();

          if (fetchError) throw fetchError;
          const currentUserId = userData.id;

          const { data: userLocations, error: locationError } = await supabase
            .from('user_locations')
            .select('user_id, latitude, longitude');

          if (locationError) throw locationError;

          const usersWithDistance = await Promise.all(
            userLocations.map(async (userLoc) => {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('username')
                .eq('id', userLoc.user_id)
                .single();

              if (userError) throw userError;

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

          const filteredUsers = usersWithDistance.filter(user => user && user.userId !== currentUserId);
          const sortedUsers = filteredUsers.sort((a, b) => a.distance - b.distance);

          setNearbyUsers(sortedUsers);
        } catch (err) {
          console.error('Error fetching nearby users:', err);
          Alert.alert('Error', 'Could not fetch nearby users.');
        }
      } else {
        setErrorMsg('No current user found');
      }
    };

    const fetchConnections = async () => {
      try {
        const currentUserId = await fetchCurrentUserId();
        const { data, error } = await supabase
          .from('connections')
          .select(`
            connection_id,
            users!connection_id (username, headline)
          `)
          .eq('user_id', currentUserId.id);

        if (error) console.error("Error fetching connections:", error);
        else {
          const connectionsWithDetails = data.map(connection => ({
            connectionId: connection.connection_id,
            username: connection.users.username,
            headline: connection.users.headline,
          }));
          setConnections(connectionsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchNearbyUsers();
    fetchConnections();
  }, []);

  const renderNearbyUser = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.userId })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.distance}>{item.distance} meters away</Text>
    </TouchableOpacity>
  );

  const renderConnection = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.connectionId })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.headline}>{item.headline}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={nearbyUsers}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={renderNearbyUser}
        style={styles.horizontalScroll}
        showsHorizontalScrollIndicator={false}
      />

      <FlatList
        data={connections}
        keyExtractor={(item) => item.connectionId.toString()}
        renderItem={renderConnection}
      />
    </View>
  );
};

// Second Tab: Connection Requests
const RequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRequests = async () => {
      const currentUserId = await fetchCurrentUserId();
      const { data, error } = await supabase
        .from('connection_requests')
        .select('id, username, headline')
        .eq('receiver_id', currentUserId.id);

      if (error) console.error("Error fetching requests:", error);
      else setRequests(data);
    };

    fetchRequests();
  }, []);

  const renderRequest = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.id })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.headline}>{item.headline}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderRequest}
    />
  );
};

const fetchCurrentUserId = async () => {
  const current_user = auth.currentUser;
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', current_user.email)
    .single();

  if (error) throw new Error('Error fetching user ID');
  return data;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  horizontalScroll: { marginBottom: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  username: { fontSize: 16, fontWeight: 'bold' },
  headline: { fontSize: 12, color: '#666' },
  distance: { fontSize: 12, color: 'gray' },
});

export default Connections;
