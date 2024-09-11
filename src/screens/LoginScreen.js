import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import app from '../firebaseConfig'
import * as Facebook from 'expo-facebook';
import { supabase } from '../supabaseClient';
import * as AppleAuthentication from 'expo-apple-authentication';
// import QRCode from 'react-native-qrcode-svg'; // Updated QR Code library
// import { uploadImageToSupabase } from './uploadImage'; // Custom utility function for image upload

// Import image from assets
import logoImage from '../assets/logo.png';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      {/* Top Image */}
      <Image 
        source={logoImage} 
        style={styles.topImage}
        onError={(error) => console.log('Image failed to load', error)}
      />

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {/* Google Button */}
        <TouchableOpacity onPress={googleAuth} style={[styles.button, styles.googleButton]}>
          <FontAwesome name="google" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Login with Google</Text>
        </TouchableOpacity>

        {/* Apple Button */}
        <TouchableOpacity onPress={appleAuth} style={[styles.button, styles.appleButton]}>
          <FontAwesome name="apple" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Login with Apple</Text>
        </TouchableOpacity>

        {/* Facebook Button */}
        <TouchableOpacity onPress={facebookAuth} style={[styles.button, styles.facebookButton]}>
          <FontAwesome name="facebook" size={24} color="white" style={styles.icon} />
          <Text style={styles.buttonText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'start',
    height: "100%",
    width: "100%",
  },
  topImage: {
    width: 200,
    resizeMode: 'contain',  // Covers the image properly
  },
  buttonContainer: {
    position: 'absolute', // Overlaps the image
    top: '40%',           // Moves it slightly above the image
    width: '85%',         // Controls the width of the div
    backgroundColor: 'white',
    borderRadius: 20,     // Rounds the top of the div
    padding: 20,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Adds box shadow
    elevation: 5,         // Shadow for Android
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 25,     // Rounded buttons
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center', // Vertically centers content
    marginBottom: 15,     // Adds space between buttons
  },
  icon: {
    marginRight: 10,      // Space between icon and text
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Google Button
  googleButton: {
    backgroundColor: '#DB4437', // Google's red color
  },
  
  // Apple Button
  appleButton: {
    backgroundColor: '#000000', // Apple's black color
  },
  
  // Facebook Button
  facebookButton: {
    backgroundColor: '#3b5998', // Facebook's blue color
  },
});

// QR code generation and image upload
async function generateQRCode(uid) {
  try {
    const qrCodeData = `https://yourapp.com/user/${uid}`;
    // Generate QR code component
    return qrCodeData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

// Authentication functions
async function googleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '454383910396-aerl2qatep2afv4pgqp74m0ne0e94eph.apps.googleusercontent.com',
  });

  if (response?.type === 'success') {
    const { id_token } = response.params;
    const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
    try {
      const result = await firebase.auth().signInWithCredential(credential);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const displayName = user.displayName || 'Anonymous';
        const email = user.email;

        console.log("logged in successfully");
        console.log("Username: ", displayName, "/nUserID:", uid, "/nEmail:", email)

        // // Generate QR code data
        // const qrCodeData = await generateQRCode(uid);

        // // Insert user into Supabase table
        // await insertUserProfile(uid, displayName, email, qrCodeData);
      }
    } catch (error) {
      console.error('Google Authentication Error:', error);
    }
  } else {
    await promptAsync();
  }
}

async function facebookAuth() {
  try {
    await Facebook.initializeAsync({
      appId: '262071873250156',
    });

    const result = await Facebook.logInWithReadPermissionsAsync({
      permissions: ['public_profile', 'email'],
    });

    if (result.type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(result.token);
      const result = await firebase.auth().signInWithCredential(credential);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const displayName = user.displayName || 'Anonymous';
        const email = user.email;

        console.log("logged in successfully");
        console.log("Username: ", displayName, "/nUserID:", uid, "/nEmail:", email)

        // // Generate QR code data
        // const qrCodeData = await generateQRCode(uid);

        // // Insert user into Supabase table
        // await insertUserProfile(uid, displayName, email, qrCodeData);
      }
    } else {
      console.log('Facebook Login Cancelled');
    }
  } catch ({ message }) {
    console.error('Facebook Authentication Error:', message);
  }
}

async function appleAuth() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential) {
      const providerCredential = firebase.auth.AppleAuthProvider.credential(
        credential.identityToken,
        credential.authorizationCode
      );
      const result = await firebase.auth().signInWithCredential(providerCredential);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const displayName = user.displayName || 'Anonymous';
        const email = user.email;

        // // Generate QR code data
        // const qrCodeData = await generateQRCode(uid);

        // // Insert user into Supabase table
        // await insertUserProfile(uid, displayName, email, qrCodeData);
      }
    }
  } catch (error) {
    console.error('Apple Authentication Error:', error);
  }
}


async function insertUserProfile(uid, username, email, qrCodeData) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      { uid, username, email, phone_number: null, occupation: null, linkedin_url: null, instagram_handle: null, github_repo: null, website_link: null, qr_code_image_url: qrCodeData }
    ]);

  if (error) {
    console.error('Error inserting user profile:', error);
  } else {
    console.log('User profile created:', data);
  }
}

export default LoginScreen;
