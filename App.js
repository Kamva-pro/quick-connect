import React, { useEffect, useState, useRef } from 'react';
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

const linking = {
  prefixes: ['quickconnect://'],
  config: {
    screens: {
      Signup: 'signup',
      Login: 'login',
      Profile: 'profile/:userId',
      EditProfile: 'edit-profile',
      QRCode: 'qr-code',
      Home: 'home',
      Scan: 'scan',
    },
  },
};

const App = () => {
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const addNotification = (message) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message }]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 5000);
  };

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
          console.error(error.message);
          return;
        }
        setUsername(data.username);
      }
    };
    fetchUserData();

    // Example of adding a notification for testing
    addNotification('Welcome to Quick Connect!');
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen 
          name="Home" 
          component={HomePage} 
          options={{
            headerLeft: null,
            headerTitle: "Quick Connect",
            title: "Quick Connect",
            headerBackVisible: false,
            headerRight: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Temporary Notifications Display */}
                {notifications.length > 0 && (
                  <View style={styles.notificationBubble}>
                    <Text style={styles.notificationText}>
                      {notifications[notifications.length - 1].message}
                    </Text>
                  </View>
                )}
                {/* Notification Icon */}
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
          <Text style={styles.modalTitle}>Notifications</Text>
          <FlatList 
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notificationItem}>
                <Text>{item.message}</Text>
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
  notificationBubble: {
    backgroundColor: '#f8d7da',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
  },
  notificationText: {
    color: '#721c24',
    fontSize: 12,
  },
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
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
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
