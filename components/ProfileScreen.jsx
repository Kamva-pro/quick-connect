import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const UserProfileScreen = () => {
  const route = useRoute();
  const { userId } = route.params; 

  return (
    <View>
      <Text>User Profile: {userId}</Text>
      {/* Fetch and display user details using the userId */}
    </View>
  );
};

export default UserProfileScreen;
