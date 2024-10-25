import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../supabase';
import { auth } from '../firebase';

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
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

  const handleAddConnection = async () => {
    try {
      const currentUser = await fetchCurrentUserId();
      if (!currentUser || !currentUser.id) {
        throw new Error('Current user ID not found.');
      }
      const result = await addConnection(currentUser.id, userId);
      if (result) {
        Alert.alert('Connection added successfully!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!userData) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>User Profile for ID: {userId}</Text>
      <Text>Name: {userData.username}</Text>
      <Text>Email: {userData.email}</Text>
      <Text>{userData.headline}</Text>
      <TouchableOpacity onPress={handleAddConnection}>
        <Text>Add Connection</Text>
      </TouchableOpacity>
    </View>
  );
};

const fetchUserProfileById = async (userId) => {
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

const fetchCurrentUserId = async () => {
  const current_user = auth.currentUser;
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', current_user.email)
    .single();

  if (error) {
    throw new Error('Error fetching user ID');
  }

  return data;
};

const addConnection = async (userId, connectionId) => {
  if (userId === connectionId) {
    throw new Error("You cannot connect with yourself.");
  }

  try {
    const { data: existingConnection, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('connection_id', connectionId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingConnection) {
      throw new Error("Connection already exists.");
    }

    const { data, error } = await supabase
      .from('connections')
      .insert([{ user_id: userId, connection_id: connectionId }]);

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error adding connection:', err);
    throw new Error("Could not add connection.");
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default UserProfileScreen;
