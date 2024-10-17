import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { supabase } from '../supabase';  // Supabase config
import { auth } from '../firebase';  // Firebase config

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headline, setHeadline] = useState('');

  const handleSignUp = async () => {
    try {
      // Step 1: Sign up the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Insert user data into Supabase after Firebase registration
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: user.uid,  // Firebase user ID as primary key
            email: user.email,
            username,
            occupation,
            headline,
          },
        ]);

      if (error) {
        console.error('Supabase Error:', error);
        Alert.alert('Error', 'There was an error saving your data.');
      } else {
        Alert.alert('Success', 'Your account has been created successfully.');
      }
    } catch (error) {
      console.error('Firebase Error:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Occupation"
        value={occupation}
        onChangeText={(text) => setOccupation(text)}
      />
      <TextInput
        placeholder="Headline"
        value={headline}
        onChangeText={(text) => setHeadline(text)}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
