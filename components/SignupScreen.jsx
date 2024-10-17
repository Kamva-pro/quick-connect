import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { auth } from '../firebase'; // Import auth from firebase.js
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase function for user registration
import { useNavigation } from '@react-navigation/native'; // Import useNavigation


const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headline, setHeadline] = useState('');
  
  const [message, setMessage] = useState(''); // State to display messages
  const [error, setError] = useState(''); // State to display error messages

  const navigation = useNavigation(); // Initialize navigation

  // Function to handle signup
  const handleSignup = async () => {
    setMessage('');
    setError('');
    
    try {
      // Step 1: Create User in Supabase
      const { data, error: supabaseError } = await supabase
        .from('users')
        .insert([
          { 
            username,
            occupation,
            headline,
            email,
            // Generate QR code link using a placeholder for now, will update later
            qr_code_link: '' 
          }
        ])
        .select(); // Select to get the inserted data back

      if (supabaseError) {
        throw supabaseError; // Trigger catch block for failed Supabase insert
      }

      // Step 2: Generate the QR code link using the user's ID
      const qrCodeLink = `quickconnect://profile/${data[0].id}`;
      
      // Step 3: Update the user's QR code link in Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ qr_code_link: qrCodeLink })
        .eq('id', data[0].id); // Update based on the generated ID

      if (updateError) {
        throw updateError; // Handle update error
      }

      // Step 4: Register User in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Show success message for Firebase
      setMessage('User registered in Firebase successfully!');

      // Show success message for Supabase
      setMessage(prev => prev + ' User created in Supabase successfully!');

      navigation.navigate('EditProfileScreen'); 


    } catch (err) {
      // Show error message if anything fails
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />

      <TouchableOpacity onPress={handleSignup} style={{ backgroundColor: 'blue', padding: 12, borderRadius: 5 }}>
        <Text style={{ textAlign: 'center', color: 'white' }}>
          Signup
        </Text>
      </TouchableOpacity>

      {/* Display message or error */}
      {message ? (
        <Text style={{ marginTop: 20, color: 'green', textAlign: 'center' }}>{message}</Text>
      ) : null}
      {error ? (
        <Text style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : null}
    </View>
  );
};

export default SignupScreen;
