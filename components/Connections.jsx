import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../supabase';
import { useNavigation } from '@react-navigation/native';
import {auth} from '../firebase';

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        // Fetch the current user's ID from Supabase
        const currentUserId = await fetchCurrentUserId();
        
        // Fetch connections
        const { data, error } = await supabase
          .from('connections')
          .select('connection_id, users(username, headline)')
          .eq('user_id', currentUserId.id)
          .leftJoin('users', 'connection_id', 'users.id');

        if (error) {
          console.error("Error fetching connections:", error);
          return;
        }
        
        setConnections(data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, []);

  const renderConnectionCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('UserProfileScreen', { userId: item.connection_id })}
    >
      <Text style={styles.username}>{item.users.username}</Text>
      <Text style={styles.headline}>{item.users.headline}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Connections</Text>
      {connections.length > 0 ? (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.connection_id}
          renderItem={renderConnectionCard}
        />
      ) : (
        <Text>No connections found.</Text>
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
