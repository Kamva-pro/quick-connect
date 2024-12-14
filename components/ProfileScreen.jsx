import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { supabase } from '../supabase';
import { auth } from '../firebase';

// Import background images
const bgImages = [
  require('../assets/bg-imgs/bg1.jpg'),
  require('../assets/bg-imgs/bg2.jpg'),
  require('../assets/bg-imgs/bg3.jpg'),
];

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);
  const [bgImage, setBgImage] = useState(null);

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
    setBgImage(bgImages[Math.floor(Math.random() * bgImages.length)]);
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

  const renderAvatar = () => {
    if (userData.avatar_url) {
      return <Image source={{ uri: userData.avatar_url }} style={styles.avatar} />;
    }
    const initial = userData.username ? userData.username[0].toUpperCase() : '?';
    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>{initial}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.backgroundCover}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>{renderAvatar()}</View>
      </ImageBackground>

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
  },
  backgroundCover: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'absolute',
    top: 150,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    color: '#555',
  },
  infoContainer: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  headline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UserProfileScreen;
