import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from './components/SignupScreen';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';
import Scan from './components/ScanScreen';
import UserProfileScreen from './components/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from './supabase';
import { auth } from './firebase';

const Stack = createNativeStackNavigator();

const App = () => {
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const fetchConnectionRequests = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('No logged-in user.');
        return;
      }
  
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
  
      if (userError) throw userError;
  
      const userId = userData.id;
  
      const { data: connections, error: connectionError } = await supabase
        .from('connections')
        .select('user_id')
        .eq('connection_id', userId);
  
      if (connectionError) throw connectionError;
  
      console.log('Connections:', connections); 
  
      const senderPromises = connections.map(async (connection) => {
        try {
          const { data: sender, error: senderError } = await supabase
            .from('users')
            .select('id, username, email')
            .eq('id', connection.user_id)
            .single();
  
          if (senderError) throw senderError;
          return sender;
        } catch (error) {
          console.error('Error fetching sender:', error.message);
          return null; 
        }
      });
  
      const senders = (await Promise.all(senderPromises)).filter(Boolean);
      setNotifications(senders);
      console.log('Notifications:', senders); 
    } catch (error) {
      console.error('Error fetching connection requests:', error.message);
    }
  };
  
  useEffect(() => {
    fetchConnectionRequests();
  }, []);

  useEffect(() => {
    console.log('Notifications updated:', notifications);
  }, [notifications]);
  
  const handleViewProfile = (userId) => {
    setModalVisible(false); 
    navigation.navigate('Profile', { userId });
  };
  

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{
            headerTitle: 'Quick Connect',
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name="notifications-outline"
                  size={24}
                  color="#000"
                  style={{ marginRight: 15 }}
                  onPress={() => setModalVisible(true)}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen name="Scan" component={Scan} />
        <Stack.Screen name="Profile" component={UserProfileScreen} />
      </Stack.Navigator>

      {/* Notifications Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Connection Requests</Text>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text style={styles.senderName}>{item.username}</Text>
                <Text style={styles.senderEmail}>{item.email}</Text>
                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => handleViewProfile(item.id)}

                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  senderEmail: {
    fontSize: 14,
    color: '#555',
  },
  viewProfileButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  viewProfileText: {
    color: '#fff',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
