import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const currentUserId = await fetchCurrentUserId();

        const { data, error } = await supabase
          .from('connections')
          .select(`
            connection_id,
            users!connection_id (username, headline) 
          `)
          .eq('user_id', currentUserId.id);

        if (error) {
          console.error("Error fetching connections:", error);
          return;
        }

        // Map data to have user details readily available
        const connectionsWithDetails = data.map((connection) => ({
          connectionId: connection.connection_id,
          username: connection.users.username,
          headline: connection.users.headline,
        }));

        setConnections(connectionsWithDetails);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, []);


  /*TODO: CREATE TWO TABS ON THE TOP OF THE SCREEN.
  FIRST ONE DISPLAYS 10 CIRCULAR CARDS OF NEARBY USERS AT THE TOP IN A HORIZONTAL SCROLLVIEW 
  AT THE END OF THE SCROLLVIEW IS A BUTTON, WHEN CLICKED IT NAVIGATES U TO THE 
  NEARBY CONNECTIONS SCREEN.
  UNDERNEATH IT IS THE LIST OF CURRENT CONNECTIONS OF THE USER IN A VERTICAL SCROLLVIEW

  SECOND TAB: DISPLAYS THE LIST OF RECEIVED CONNECTION REQUESTS IN A VERTICAL SCROLLVIEW
  EACH CARD IS PRESENTED IN A TOUCHABLE OPACITY LINKED TO THE USER'S PROFILE
  */
  const renderConnectionCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Profile', { userId: item.connectionId })}
    >
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.headline}>{item.headline}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {connections.length > 0 ? (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.connectionId}
          renderItem={renderConnectionCard}
        />
      ) : (
        <Text>You don't have any connections.</Text>
      )}
    </View>
  );
};

const fetchCurrentUserId = async () => {
  const current_user = auth.currentUser;
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', current_user.email)
    .single();

  if (error) {
    throw new Error('Error fetching user ID');
  }

  return data;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 14,
    color: '#666',
  },
});

export default Connections;
