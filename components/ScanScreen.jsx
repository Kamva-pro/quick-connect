import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);

    const extractedUserId = data.split('/').pop(); // Extract the user ID from the link
    Alert.alert("QR Code Scanned", `User ID: ${extractedUserId}`, [
      {
        text: "Go to Profile",
        onPress: () => {
          navigation.navigate('Profile', { userId: extractedUserId });
          setScanned(false);
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
        <View style={styles.scannerContainer}>
          <CameraView
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {/* Overlay with dimmed areas and border frame */}
          <View style={styles.overlay}>
            <View style={styles.topDim} />
            <View style={styles.leftDim} />
            <View style={styles.rightDim} />
            <View style={styles.bottomDim} />
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
    width: 250,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
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
