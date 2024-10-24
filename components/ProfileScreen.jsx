import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from '../supabase';
import {auth} from '../firebase';

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params; // Retrieve the userId passed from the ScanScreen
  const [userData, setUserData] = useState(null);
  const current_user_id = useState(null);

  useEffect(() => {
    // Fetch the user's profile data using the userId
    const fetchUserProfile = async () => {
      try {
        const user = await fetchUserProfileById(userId);
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    

    fetchUserProfile();
  }, [userId]);

  if (!userData) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>User Profile for ID: {userId}</Text>
      <Text>Name: {userData.username}</Text>
      <Text>Email: {userData.email}</Text>
      <Text> {userData.headline}</Text>
      <Button> Add connection </Button> 
      {/* Display other user profile information */}
    </View>
  );
};

const fetchUserProfileById = async (userId) => {
  // Example with Supabase
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error('Error fetching user profile');
  }

  return data;
};


const addConnection = async (userId, connectionId) => {
  // Check if userId and connectionId are the same
  if (userId === connectionId) {
    throw new Error("You cannot connect with yourself.");
  }

  try {
    // Check if the connection already exists
    const { data: existingConnection, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('connection_id', connectionId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // If a connection already exists, throw an error
    if (existingConnection) {
      throw new Error("Connection already exists.");
    }

    // Add the new connection to the database
    const { data, error } = await supabase
      .from('connections')
      .insert([
        { user_id: userId, connection_id: connectionId }
      ]);

    if (error) {
      throw error; // Handle insertion error
    }

    return data; // Return the created connection data
  } catch (err) {
    console.error('Error adding connection:', err);
    throw new Error("Could not add connection.", err);
  }
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfileScreen;
