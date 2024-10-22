import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../supabase'; // Adjust the path if needed
import { auth } from '../firebase'; // Adjust the path if needed
import QRCode from 'react-native-qrcode-svg'; // Import the QR code component
import { FloatingAction } from "react-native-floating-action";



const QRCodeScreen = ({navigation}) => {
  const [qrCodeLink, setQrCodeLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  
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
    <View style={styles.container}>
      
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <QRCode
        value={qrCodeLink} // Use the fetched qr_code_link
        size={250}
        backgroundColor="white"
        color="black"
      />
      <TouchableOpacity>
        <Text>Scan</Text>
      </TouchableOpacity>

      <FloatingAction onPressMain={navigation.navigate('Scan')} />

    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

export default QRCodeScreen;
