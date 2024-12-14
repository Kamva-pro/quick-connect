import React, { useState, useEffect, useRef } from "react";
import { View, Text, Alert, SafeAreaView, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

const ScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
  const qrLock = useRef(false); // Prevent scanning multiple times

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Request permission with Camera (not CameraView)
      setHasPermission(status === "granted");
    };

    getPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (scanned || qrLock.current) return; // Prevent scanning multiple times

    qrLock.current = true;

    const extractedUserId = data.split("/").pop(); 
    navigation.navigate("Profile", { userId: extractedUserId });
          setScanned(false); 
          qrLock.current = false; 
 
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {isFocused && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{ barCodeTypes: ["qr"] }} 
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.topDim} />
        <View style={styles.leftDim} />
        <View style={styles.rightDim} />
        <View style={styles.bottomDim} />
        <View style={styles.frame} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: 250,
    height: 150,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  topDim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "35%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  leftDim: {
    position: "absolute",
    top: "35%",
    left: 0,
    width: "20%",
    bottom: "35%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  rightDim: {
    position: "absolute",
    top: "35%",
    right: 0,
    width: "20%",
    bottom: "35%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  bottomDim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "35%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
});

export default ScanScreen;
