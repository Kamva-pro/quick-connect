import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, FlatList } from 'react-native'
import { supabase } from '../supabase';
import { auth } from '../firebase'; 
import { useNavigation } from '@react-navigation/native';


function Connections() {
    useEffect(() => {
        const fetchConnections = async () => {
            const current_user = auth.currentUser;
            
            if (current_user)
            {
                try{

                }
                catch (err) {
                    console.error('Error fetching nearby users:', err);
                    Alert.alert('Error', 'Could not fetch nearby users.');
                  }
            }
            
        }
    })

    return (
        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
            <Text>Your connections will appear here</Text>
        </View>
    )
}

export default Connections