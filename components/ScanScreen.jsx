import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Camera, CameraView} from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error("Error requesting camera permissions:", error);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    const extractedUserId = data.split('/').pop();

    Alert.alert("QR Code Scanned", `User ID: ${extractedUserId}`, [
      {
        text: "Go to Profile",
        onPress: () => {
          navigation.navigate('Profile', { userId: extractedUserId });
          setTimeout(() => setScanned(false), 500);
        },
      },
      { text: "Cancel", onPress: () => setScanned(false), style: "cancel" },
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
      {isFocused && hasPermission && (
        <CameraView
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          facing='back'
          style={StyleSheet.absoluteFillObject}
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
    width: 250,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  topDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  leftDim: {
    position: 'absolute',
    top: '35%',
    left: 0,
    width: '20%',
    bottom: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  rightDim: {
    position: 'absolute',
    top: '35%',
    right: 0,
    width: '20%',
    bottom: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomDim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '35%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export default ScanScreen;
