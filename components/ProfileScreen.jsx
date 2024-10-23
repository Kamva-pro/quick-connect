import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserProfileScreen = ({ route }) => {
  const { userId } = route.params; // Retrieve the userId passed from the ScanScreen
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the user's profile data using the userId
    const fetchUserProfile = async () => {
      try {
        // Replace this with your logic to fetch the user data
        const response = await fetchUserProfileById(userId);
        setUserData(response);
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
      <Text>Name: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      {/* Display other user profile information */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserProfileScreen;
