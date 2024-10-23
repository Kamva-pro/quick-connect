import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useIsFocused } from '@react-navigation/native';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true); // Stop scanning once a QR code is detected

    // Example data: quickconnect://profile/12345 (extract the user ID)
    const extractedUserId = data.split('/').pop(); // Extract the user ID from the link
    
    Alert.alert("QR Code Scanned", `User ID: ${extractedUserId}`, [
      {
        text: "Go to Profile",
        onPress: () => {
          // Navigate to the user's profile screen and pass the user ID
          navigation.navigate('Profile', { userId: extractedUserId });
          setScanned(false); // Reset scanning state after navigating
        }
      },
      { text: "Cancel", onPress: () => setScanned(false), style: "cancel" }
    ]);
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View><Text>No access to camera.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {isFocused && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject} // Full-screen scanner
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default ScanScreen;
