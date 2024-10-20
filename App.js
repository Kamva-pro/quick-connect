import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './components/SignupScreen';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';


const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ['quickconnect://'], // Define your app's URL scheme
  config: {
    screens: {
      Signup: 'signup',
      Login: 'login',
      Profile: 'profile/:userId', // Define a dynamic route for the profile
      EditProfile: 'edit-profile',
      QRCode: 'qr-code',
      Home: 'home'
    },
  },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomePage} /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
