import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../supabase'; // Adjust the path if needed
import { auth } from '../firebase'; // Adjust the path if needed
import QRCode from 'react-native-qrcode-svg'; // Import the QR code component
import { RNCamera } from 'react-native-camera'; // Import the camera component
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions'; // Import permission handlers

const QRCodeScreen = () => {
  const [qrCodeLink, setQrCodeLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false); // State to control scanner visibility
  const [scannedData, setScannedData] = useState(null); // State to hold scanned QR code data

  useEffect(() => {
    const fetchQrCodeLink = async () => {
      try {
        const user = auth.currentUser; // Get the currently authenticated user

        if (user) {
          // Fetch the user record from Supabase to get the user ID
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id, qr_code_link') // Select both ID and qr_code_link
            .eq('email', user.email) // Match by email
            .single(); // Ensure we get a single record

          if (fetchError) {
            throw fetchError;
          }

          // Set the qr_code_link from the fetched user data
          setQrCodeLink(userData.qr_code_link);
        } else {
          setError('No authenticated Firebase user found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    fetchQrCodeLink();
  }, []);

  const requestCameraPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.CAMERA);
    if (result !== RESULTS.GRANTED) {
      await request(PERMISSIONS.ANDROID.CAMERA);
    }
  };

  useEffect(() => {
    requestCameraPermission(); // Request camera permission on component mount
  }, []);

  const handleQRCodeRead = (e) => {
    setScannedData(e.data); // Store the scanned data
    setScanning(false); // Stop scanning after reading
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {scanning ? (
        <RNCamera
          style={{ flex: 1, width: '100%' }}
          onBarCodeRead={handleQRCodeRead}
          captureAudio={false}
        />
      ) : (
        <>
          <QRCode
            value={qrCodeLink} // Use the fetched qr_code_link
            size={250}
            backgroundColor="white"
            color="black"
          />
          <TouchableOpacity
            onPress={() => setScanning(true)} // Start scanning when button is pressed
            style={{
              marginTop: 20,
              padding: 10,
              backgroundColor: '#007BFF',
              borderRadius: 5,
            }}
          >
            <Text style={{ color: 'white' }}>Open Scanner</Text>
          </TouchableOpacity>
          {scannedData && (
            <View style={{ marginTop: 20 }}>
              <Text>Scanned Data: {scannedData}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default QRCodeScreen;
