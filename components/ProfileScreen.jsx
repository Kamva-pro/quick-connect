import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
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
      {/* Background Gradient Simulation */}
      <View style={styles.backgroundCover}>
        <View style={styles.gradientLayer1} />
        <View style={styles.gradientLayer2} />
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />
      </View>

      {/* User Info */}
      <View style={styles.infoContainer}>
        {userData.username && <Text style={styles.username}>{userData.username}</Text>}
        {userData.email && <Text style={styles.email}>{userData.email}</Text>}
        {userData.headline && <Text style={styles.headline}>{userData.headline}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleAddConnection}>
          <Text style={styles.buttonText}>Add Connection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Database and user helper functions
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  backgroundCover: {
    width: '100%',
    height: 200,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientLayer1: {
    flex: 1,
    backgroundColor: '#4a90e2', // Darker blue color
    opacity: 0.7,
  },
  gradientLayer2: {
    flex: 1,
    backgroundColor: '#50e3c2', // Lighter green color
    opacity: 0.6,
  },
  avatarContainer: {
    marginTop: 140, // Adjust as needed
    backgroundColor: '#fff',
    borderRadius: 60,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  headline: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4a90e2',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
