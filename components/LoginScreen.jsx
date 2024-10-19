// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = ({ navigation }) => {
  // Check if the user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = auth.currentUser;
      if (user) {
        // Redirect to HomePage if the user is already authenticated
        navigation.navigate('Home');
      }
    };

    checkAuth();
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Firebase authentication login
     await signInWithEmailAndPassword(auth, email, password);

      // Find the user's ID from Supabase
      const { data, error: supabaseError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single(); // Fetch single user based on email

      if (supabaseError) {
        throw supabaseError;
      }

      // Redirect to QR Code Screen with userId
      navigation.navigate('QRCode', { userId: data.id });

    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image>
      </Image> */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Go to Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  signupText:{
    color: "blue",
    marginTop: 12,
    textAlign: 'center'
  }
});

export default LoginScreen;
  