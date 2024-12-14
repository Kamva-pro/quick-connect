import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationList = ({ notifications }) => {
  return (
    <View style={styles.container}>
      {notifications.map((notif) => (
        <View key={notif.id} style={styles.notification}>
          <Text>{notif.message}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1000,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default NotificationList;
