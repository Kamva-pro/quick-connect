import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import QRCodeScreen from './QRCodeScreen';
import EditProfileScreen from './EditProfileScreen';

const HomeRoute = () => <View><Text>Home Content</Text></View>;
const EmptyTab = () => <View><Text>Empty Tab</Text></View>;

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'qr', title: 'QR Code', icon: 'qrcode' },
    { key: 'special', title: 'Action', icon: 'plus-circle' }, // Special Action Button
    { key: 'empty', title: '', icon: 'circle-outline' }, // Empty Tab
    { key: 'profile', title: 'Edit Profile', icon: 'account-edit' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    qr: QRCodeScreen,
    special: () => <View><Text>Special Action</Text></View>, // Handle special tab action here
    empty: EmptyTab,
    profile: EditProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default HomePage;
