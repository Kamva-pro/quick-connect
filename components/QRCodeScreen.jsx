import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { supabase } from '../supabase';
import { useRoute } from '@react-navigation/native';

const QRCodeScreen = () => {
  const [qrCodeLink, setQRCodeLink] = useState('');
  const route = useRoute();
  const { userId } = route.params; // Assuming userId is passed upon login

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('qr_code_link')
        .eq('id', userId)
        .single(); // Fetch the single user by ID

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setQRCodeLink(data.qr_code_link); // Set the QR code link
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Your QR Code:</Text>
      {qrCodeLink ? (
        <QRCode value={qrCodeLink} size={200} />
      ) : (
        <Text>Loading QR code...</Text>
      )}
    </View>
  );
};

export default QRCodeScreen;
