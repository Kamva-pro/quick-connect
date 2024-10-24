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
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject} // Full-screen scanner
          />
          
          {/* Overlay with dimmed areas and border frame */}
          <View style={styles.overlay}>
            {/* Semi-transparent dimming outside the frame */}
            <View style={styles.topDim} />
            <View style={styles.leftDim} />
            <View style={styles.rightDim} />
            <View style={styles.bottomDim} />
            
            {/* The frame itself */}
            <View style={styles.frame} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: 250, // Adjust the size of the frame
    height: 150, // Adjust the size of the frame
    // borderWidth: 3, // Thickness of the border
    // borderColor: 'white', // Color of the border
    borderRadius: 10, // Optional: rounded corners for the frame
  },
  topDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
  },
  leftDim: {
    position: 'absolute',
    top: '35%',
    left: 0,
    width: '20%',
    bottom: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
  },
  rightDim: {
    position: 'absolute',
    top: '35%',
    right: 0,
    width: '20%',
    bottom: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
  },
  bottomDim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
  },
});

export default ScanScreen;
