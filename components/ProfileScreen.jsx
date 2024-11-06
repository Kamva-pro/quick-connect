import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
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
      <View style={styles.profileBackground}></View>
      <Image style={styles.profileImage} source={'../assets/logo.png'}></Image>
      <Text>{userData.username}</Text>
      <Text>{userData.email}</Text>
      <Text>{userData.phone}</Text>      

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
    throw new Error("Could not add connection.");
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profileBackground: {
    height: '400',
    width: "100%",
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, 
  },
  profileImage: {
    height: "300px",
    width: "300px",
    borderRadius: "100px",
    borderColor: "transparent",
    borderWidth: "1px",
    borderStyle: "solid",
    marginTop: "-60px"
  }
});

export default UserProfileScreen;
