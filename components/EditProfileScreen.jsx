import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
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
    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={styles.circularDiv}></TouchableOpacity>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        returnKeyType="next"
        onSubmitEditing={() => occupationRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={occupationRef}
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
        returnKeyType="next"
        onSubmitEditing={() => headlineRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={headlineRef}
        placeholder="Headline"
        value={headline}
        onChangeText={setHeadline}
        returnKeyType="next"
        onSubmitEditing={() => numberRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        editable={false}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={numberRef}
        placeholder="Number"
        value={number}
        onChangeText={setNumber}
        returnKeyType="next"
        onSubmitEditing={() => companyRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={companyRef}
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        returnKeyType="next"
        onSubmitEditing={() => websiteRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={websiteRef}
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        returnKeyType="next"
        onSubmitEditing={() => facebookRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={facebookRef}
        placeholder="Facebook"
        value={facebook}
        onChangeText={setFacebook}
        returnKeyType="next"
        onSubmitEditing={() => instagramRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={instagramRef}
        placeholder="Instagram"
        value={instagram}
        onChangeText={setInstagram}
        returnKeyType="next"
        onSubmitEditing={() => linkedinRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={linkedinRef}
        placeholder="LinkedIn"
        value={linkedin}
        onChangeText={setLinkedin}
        returnKeyType="next"
        onSubmitEditing={() => twitterRef.current.focus()}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        ref={twitterRef}
        placeholder="Twitter"
        value={twitter}
        onChangeText={setTwitter}
        returnKeyType="done"
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />

      <TouchableOpacity onPress={handleUpdateProfile} style={{ backgroundColor: 'blue', padding: 12, borderRadius: 5 }}>
        <Text style={{ textAlign: 'center', color: 'white' }}>
          Save Changes
        </Text>
      </TouchableOpacity>

      {message ? <Text style={{ marginTop: 20, color: 'green', textAlign: 'center' }}>{message}</Text> : null}
      {error ? <Text style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>{error}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  
})

export default EditProfileScreen;
