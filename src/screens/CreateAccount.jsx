import React, {useState, useEffect} from "react";
import { Alert, StyleSheet, View, AppState, Text, ScrollView, TextInput } from 'react-native'
import { Button, Input } from '@rneui/themed'
import logoImage from '../assets/logo.png';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebaseAuth"

export default function CreateAccount() 
{

    return(
        <View style={styles.container}>
        <Image 
        source={logoImage} 
        style={styles.topImage}
        onError={(error) => console.log('Image failed to load', error)}
      />

<View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 12,
    },
    topImage: {
  
      width: 250,
      height: 250,
      resizeMode: 'cover',  // Covers the image properly
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  })