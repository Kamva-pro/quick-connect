import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { auth } from '../firebase'; // Import auth from firebase.js
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
  const [message, setMessage] = useState(''); // State to display messages
  const [error, setError] = useState(''); // State to display error messages
  const [currentField, setCurrentField] = useState(0); // To track the current input field
  
  const totalFields = 10; // Total number of fields

  // Array to keep track of input fields for navigation between them
  const inputFields = [
    { placeholder: 'Username', value: username, setter: setUsername },
    { placeholder: 'Occupation', value: occupation, setter: setOccupation },
    { placeholder: 'Headline', value: headline, setter: setHeadline },
    { placeholder: 'Number', value: number, setter: setNumber },
    { placeholder: 'Company', value: company, setter: setCompany },
    { placeholder: 'Website', value: website, setter: setWebsite },
    { placeholder: 'Facebook', value: facebook, setter: setFacebook },
    { placeholder: 'Instagram', value: instagram, setter: setInstagram },
    { placeholder: 'LinkedIn', value: linkedin, setter: setLinkedin },
    { placeholder: 'Twitter', value: twitter, setter: setTwitter },
  ];

  // Fetch user data from Supabase when the component mounts
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

        // Populate state with user data
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

  const handleNext = () => {
    if (currentField < totalFields - 1) {
      setCurrentField(currentField + 1);
    } else {
      handleUpdateProfile(); // Submit the form if it's the last field
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {inputFields.map((field, index) => (
        <TextInput
          key={index}
          placeholder={field.placeholder}
          value={field.value}
          onChangeText={field.setter}
          style={{
            marginBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#ccc',
            padding: 8,
          }}
          editable={field.placeholder !== 'Email'} // Make email non-editable if needed
          autoFocus={currentField === index} // Focus the current field
        />
      ))}

      <TouchableOpacity
        onPress={handleNext}
        style={{ backgroundColor: 'blue', padding: 12, borderRadius: 5 }}>
        <Text style={{ textAlign: 'center', color: 'white' }}>
          {currentField === totalFields - 1 ? 'Done' : 'Next'}
        </Text>
      </TouchableOpacity>

      {message ? (
        <Text style={{ marginTop: 20, color: 'green', textAlign: 'center' }}>{message}</Text>
      ) : null}
      {error ? (
        <Text style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>{error}</Text>
      ) : null}
    </ScrollView>
  );
};

export default EditProfileScreen;
