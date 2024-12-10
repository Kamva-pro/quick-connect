import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabase';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headline, setHeadline] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    setMessage('');
    setError('');

    try {
      const { data, error: supabaseError } = await supabase
        .from('users')
        .insert([{ username, occupation, headline, email, qr_code_link: '' }])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      const qrCodeLink = `quickconnect://profile/${data[0].id}`;
      const { error: updateError } = await supabase
        .from('users')
        .update({ qr_code_link: qrCodeLink })
        .eq('id', data[0].id);

      if (updateError) {
        throw updateError;
      }

      await createUserWithEmailAndPassword(auth, email, password);

      setMessage('User registered successfully in Firebase and Supabase!');
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        style={styles.input}
      />
      <TextInput
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Top alignment
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black text
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000', // Black button
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default SignupScreen;
