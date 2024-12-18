import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../supabase';
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
        } else {
          const connectionsWithDetails = data.map((connection) => ({
            connectionId: connection.connection_id,
            username: connection.users.username,
            headline: connection.users.headline,
          }));
          setConnections(connectionsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, []);

  const fetchCurrentUserId = async () => {
    const current_user = auth.currentUser;
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', current_user.email)
      .single();

    if (error) throw new Error('Error fetching user ID');
    return data;
  };

  const renderConnection = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Profile', { userId: item.connectionId })}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.headline}>{item.headline}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {connections.length > 0 ? (
        <FlatList
          data={connections}
          keyExtractor={(item) => item.connectionId.toString()}
          renderItem={renderConnection}
        />
      ) : (
        <Text>No connections found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
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
