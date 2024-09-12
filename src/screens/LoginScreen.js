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


export default LoginScreen;
