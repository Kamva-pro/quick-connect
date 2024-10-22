import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';


const Scan = () => {
    const [permission, requestPermission] = useCameraPermissions();

    const openCamera = () => {
        if (!permission.granted) {
          // Camera permissions are not granted yet.
          console.log("permissions net yet granted")
          return (
            <View style={styles.container}>
              <Text style={styles.message}>We need your permission to show the camera</Text>
              <Button onPress={requestPermission} title="grant permission" />
            </View>
          );
        }
    
        else {
          return(
            <CameraView barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }} style={styles.camera} >
                </CameraView>
          );
        }
      }
      openCamera(),[]
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      paddingBottom: 10,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });

  export default Scan