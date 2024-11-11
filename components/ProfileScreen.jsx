import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Make sure to install this dependency
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

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '';
  };

  return (
    <View style={styles.container}>
      {/* Gradient Cover */}
      <LinearGradient colors={['#4a90e2', '#50e3c2']} style={styles.cover}>
        <View style={styles.avatarContainer}>
          {/* Circular Avatar with Initial */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(userData.username)}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* User Info */}
      <View style={styles.infoContainer}>
        {userData.username && <Text style={styles.name}>{userData.username}</Text>}
        {userData.headline && <Text style={styles.headline}>{userData.headline}</Text>}
        {userData.email && <Text style={styles.email}>{userData.email}</Text>}

        {/* Add Connection Button */}
        <TouchableOpacity style={styles.button} onPress={handleAddConnection}>
          <Text style={styles.buttonText}>Add Connection</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#f0f2f5',
  },
  cover: {
    height: 200,
    width: '100%',
    justifyContent: 'flex-end',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4a90e2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headline: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4a90e2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileScreen;
