import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../supabase'; // Import the Supabase client
import { auth } from '../firebase'; // Import auth from firebase.js
import { useNavigation, useRoute } from '@react-navigation/native';


const EditProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
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

  // Fetch user data from Supabase when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // Get the currently authenticated user

      if (user) {
        // Fetch user data from Supabase using the Supabase user ID
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email) // Use email to find the user
          .single(); // Fetch a single user record

        if (error) {
          setError(error.message);
          return;
        }

        // Populate state with user data
        setUsername(data.username);
        setOccupation(data.occupation);
        setHeadline(data.headline);
        setEmail(data.email); // Email is not editable but can be displayed
        setNumber(data.number || ''); // Set number, handle potential null
        setCompany(data.company || ''); // Set company, handle potential null
        setWebsite(data.website || ''); // Set website, handle potential null
        setFacebook(data.facebook || ''); // Set facebook, handle potential null
        setInstagram(data.instagram || ''); // Set instagram, handle potential null
        setLinkedin(data.linkedin || ''); // Set linkedin, handle potential null
        setTwitter(data.twitter || ''); // Set twitter, handle potential null
      }
    };

    fetchUserData();
  }, []);

  // Function to handle profile update
  const handleUpdateProfile = async () => {
    setMessage('');
    setError('');

    try {
      const user = auth.currentUser; // Get the currently authenticated user

      if (user) {
        // Fetch the user record from Supabase to get the user ID
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('id') // Only select the ID
          .eq('email', user.email)
          .single();

        if (fetchError) throw fetchError; // Handle fetching error

        const userId = userData.id; // Get the Supabase user ID

        // Update user profile information in Supabase
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
            // Do not update uid and qr_code_link
          })
          .eq('id', userId); // Update based on the Supabase user ID

        if (error) {
          throw error; // Trigger catch block for failed update
        }

        // Show success message
        setMessage('Profile updated successfully!');
      }
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
        editable={false} // Email field should not be editable
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Number"
        value={number}
        onChangeText={setNumber}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Website"
        value={website}
        onChangeText={setWebsite}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Facebook"
        value={facebook}
        onChangeText={setFacebook}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Instagram"
        value={instagram}
        onChangeText={setInstagram}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="LinkedIn"
        value={linkedin}
        onChangeText={setLinkedin}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      <TextInput
        placeholder="Twitter"
        value={twitter}
        onChangeText={setTwitter}
        style={{ marginBottom: 10, borderBottomWidth: 1, borderColor: '#ccc', padding: 8 }}
      />
      
      <TouchableOpacity onPress={handleUpdateProfile} style={{ backgroundColor: 'blue', padding: 12, borderRadius: 5 }}>
        <Text style={{ textAlign: 'center', color: 'white' }}>
          Save Changes
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

export default EditProfileScreen;
