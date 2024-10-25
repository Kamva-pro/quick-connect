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
                    const { data: userData, error: fetchError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', current_user.email) 
                    .single();
          
                  if (fetchError) {
                    throw fetchError;
                  }
          
                  const currentUserId = userData.id;

                  const { data: connections, error: connectionsError} = await supabase
                    .from('connections')
                    .select('*')
                    .eq('connectionId', currentUserId)

                    if (connectionsError)
                    {
                        throw new Error("Error fetching connections", connectionsError);
                    }

                }
                catch (err) {
                    Alert.alert('Error', 'Could not fetch nearby users.', err);
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