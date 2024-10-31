import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../supabase';
import { auth } from '../firebase';

import QRCodeScreen from './QRCodeScreen';
import EditProfileScreen from './EditProfileScreen';
import Connections from './Connections';
import Nearby from './NearbyConnections';

const Tab = createMaterialBottomTabNavigator();

const HomePage = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user connection requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      const { data: currentUserIdData } = await supabase
        .from('users')
        .select('id')
        .eq('email', currentUser.email)
        .single();

      const { data: requestsData } = await supabase
        .from('connections')
        .select('user_id')
        .eq('connection_id', currentUserIdData.id)
        .eq('status', 'pending');

      const detailedRequests = await Promise.all(
        requestsData.map(async (request) => {
          const { data: userData } = await supabase
            .from('users')
            .select('username, headline')
            .eq('id', request.user_id)
            .single();
          return { ...userData, userId: request.user_id };
        })
      );

      setRequests(detailedRequests);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('user_id', userId)
      .eq('connection_id', auth.currentUser.uid);

    setRequests((prevRequests) => prevRequests.filter((request) => request.userId !== userId));
  };

  const handleReject = async (userId) => {
    await supabase
      .from('connections')
      .delete()
      .eq('user_id', userId)
      .eq('connection_id', auth.currentUser.uid);

    setRequests((prevRequests) => prevRequests.filter((request) => request.userId !== userId));
  };

  useEffect(() => {
    if (modalVisible) {
      fetchRequests();
    }
  }, [modalVisible]);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, this will not work on an Android Emulator. Try it on a real device!');
        return;
      }

      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Get current authenticated user from Firebase and store location in Supabase
      const user = auth.currentUser;
      if (user) {
        try {
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (fetchError) throw fetchError;

          const userId = userData.id;

          const { data, error } = await supabase
            .from('user_locations')
            .upsert({
              user_id: userId,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            })
            .single();

          if (error) {
            console.error('Error saving location:', error);
            Alert.alert('Error', 'Could not save location.');
          } else {
            console.log('Location saved successfully:', data);
          }
        } catch (err) {
          console.error('Error fetching user or saving location:', err);
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Bell Icon to Open Requests Modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.bellIcon}>
        <MaterialCommunityIcons name="bell-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Requests Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Connection Requests</Text>
            {loading ? (
              <Text>Loading...</Text>
            ) : requests.length === 0 ? (
              <Text>No new connection requests</Text>
            ) : (
              <FlatList
                data={requests}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                  <View style={styles.requestCard}>
                    <TouchableOpacity>
                      <Text style={styles.requestName}>{item.username}</Text>
                      <Text style={styles.requestHeadline}>{item.headline}</Text>
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAccept(item.userId)}
                      >
                        <Text style={styles.buttonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(item.userId)}
                      >
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'white',
          },
        }}
        labeled={true}
        barStyle={{ backgroundColor: 'white' }}
        activeColor="black"
      >
        <Tab.Screen
          name="Network"
          component={Connections}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-multiple" color={color} size={26} />
            ),
          }}
        />

        <Tab.Screen
          name="QRCode"
          component={QRCodeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="qrcode-scan" color={color} size={26} />
            ),
            headerTitle: 'QRCode',
          }}
        />

        <Tab.Screen
          name="Nearby"
          component={Nearby}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="map-marker" color={color} size={26} />
            ),
            headerTitle: 'Nearby Connections',
          }}
        />

        <Tab.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-circle" color={color} size={26} />
            ),
            headerTitle: 'Edit Profile',
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bellIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestHeadline: {
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: '#4caf50',
    borderRadius: 5,
    padding: 8,
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
  },
});

export default HomePage;
