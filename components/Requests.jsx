import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { supabase } from '../supabase';
import {auth} from '../firebase';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  const currentUser = auth.currentUser;


  useEffect(() => {

    
    const fetchRequests = async () => {
        const {userData, fetchError} = await supabase
        .from('users')
        .select('id')
        .eq("email", currentUser.email)
        .single();

        if (fetchError){
            throw new Error("Error fetching userID");
        }

       const currentUserId = userData.id
      const { data, error } = await supabase
        .from('connections')
        .select(`
          user_id,
          users:user_id (username, headline)
        `)
        .eq('connection_id', currentUserId)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching connection requests:', error);
        return;
      }

      setRequests(data.map(request => ({
        requesterId: request.user_id,
        username: request.users.username,
        headline: request.users.headline,
      })));
    };

    fetchRequests();
  }, [currentUserId]);

  const handleAccept = async (requesterId) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('user_id', requesterId)
      .eq('connection_id', currentUserId)
      .eq('status', 'pending');

    if (error) console.error('Error accepting request:', error);
    else setRequests(requests.filter(request => request.requesterId !== requesterId));
  };

  const handleReject = async (requesterId) => {
    const { error } = await supabase
      .from('connections')
      .update({ status: 'rejected' })
      .eq('user_id', requesterId)
      .eq('connection_id', currentUserId)
      .eq('status', 'pending');

    if (error) console.error('Error rejecting request:', error);
    else setRequests(requests.filter(request => request.requesterId !== requesterId));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.requesterId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => {/* Navigate to user's profile */}}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.headline}>{item.headline}</Text>
            </TouchableOpacity>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleAccept(item.requesterId)} style={styles.acceptButton}>
                <Text>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReject(item.requesterId)} style={styles.rejectButton}>
                <Text>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold',
  },
  headline: {
    fontSize: 12,
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
  },
});

export default Requests;
