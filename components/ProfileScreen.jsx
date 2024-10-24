import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { supabase } from '../supabase'; // Adjust the path to your supabase configuration

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params; // Retrieve the userId passed from the ScanScreen
  const [userData, setUserData] = useState(null);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfileScreen;
