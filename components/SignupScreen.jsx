import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { auth } from '../firebase'; // Import auth from firebase.js (assuming firebase.js is correctly configured)
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase function for user registration

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headline, setHeadline] = useState('');
  
  const [message, setMessage] = useState(''); // State to display messages
  const [error, setError] = useState(''); // State to display error messages

  // Function to handle signup
  const handleSignup = async () => {
    setMessage('');
    setError('');
    
    try {
      // Step 1: Create User in Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          { 
            username: username,
            occupation: occupation,
            headline: headline,
            email: email
            // leaving other fields blank for now
          }
        ]);

      if (error) {
        throw error; // Trigger catch block for failed Supabase insert
      }
      
      // Show success message for Supabase
      setMessage('User created in Supabase successfully!');

      // Step 2: Register User in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      
      // Show success message for Firebase
      setMessage('User registered in Firebase successfully!');

    } catch (error) {
      // Show error message if anything fails
      setError(error.message);
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
