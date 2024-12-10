import React, { useEffect, useState, useRef } from 'react';
import { TextInput, TouchableOpacity, Text, ScrollView, StyleSheet, View } from 'react-native';
import { supabase } from '../supabase'; 
import { auth } from '../firebase'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [username, setUsername] = useState('');
  const [occupation, setOccupation] = useState('');
  const [headline, setHeadline] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Define refs for each input
  const occupationRef = useRef();
  const headlineRef = useRef();
  const numberRef = useRef();
  const companyRef = useRef();
  const websiteRef = useRef();
  const facebookRef = useRef();
  const instagramRef = useRef();
  const linkedinRef = useRef();
  const twitterRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();
        if (error) {
          setError(error.message);
          return;
        }
        setUsername(data.username);
        setOccupation(data.occupation);
        setHeadline(data.headline);
        setEmail(data.email);
        setNumber(data.number || '');
        setCompany(data.company || '');
        setWebsite(data.website || '');
        setFacebook(data.facebook || '');
        setInstagram(data.instagram || '');
        setLinkedin(data.linkedin || '');
        setTwitter(data.twitter || '');
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    setMessage('');
    setError('');
    try {
      const user = auth.currentUser;
      if (user) {
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        if (fetchError) throw fetchError;
        const userId = userData.id;
        const { error } = await supabase
          .from('users')
          .update({
            username,
            occupation,
            headline,
            number,
            company,
            website,
            facebook,
            instagram,
            linkedin,
            twitter,
          })
          .eq('id', userId);
        if (error) throw error;
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.circularDiv}>
        <Text style={styles.initial}>{username[0]}</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        returnKeyType="next"
        onSubmitEditing={() => occupationRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={occupationRef}
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        returnKeyType="next"
        onSubmitEditing={() => headlineRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={headlineRef}
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
        returnKeyType="next"
        onSubmitEditing={() => numberRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        editable={false}
        style={styles.input}
      />
      <TextInput
        ref={numberRef}
        placeholder="Number"
        value={number}
        onChangeText={setNumber}
        returnKeyType="next"
        onSubmitEditing={() => companyRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={companyRef}
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        returnKeyType="next"
        onSubmitEditing={() => websiteRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={websiteRef}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        returnKeyType="next"
        onSubmitEditing={() => facebookRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={facebookRef}
        placeholder="Facebook"
        value={facebook}
        onChangeText={setFacebook}
        returnKeyType="next"
        onSubmitEditing={() => instagramRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={instagramRef}
        placeholder="Instagram"
        value={instagram}
        onChangeText={setInstagram}
        returnKeyType="next"
        onSubmitEditing={() => linkedinRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={linkedinRef}
        placeholder="LinkedIn"
        value={linkedin}
        onChangeText={setLinkedin}
        returnKeyType="next"
        onSubmitEditing={() => twitterRef.current.focus()}
        style={styles.input}
      />
      <TextInput
        ref={twitterRef}
        placeholder="Twitter"
        value={twitter}
        onChangeText={setTwitter}
        returnKeyType="done"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleUpdateProfile} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.successText}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
  },
  circularDiv: {
    backgroundColor: 'lightgray',
    width: 80,
    height: 80,
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  initial: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
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
  saveButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
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

export default EditProfileScreen;
