import React from 'react'
import { View, Text,StyleSheet, FlatList } from 'react-native'
import { supabase } from '../supabase';
import { auth } from '../firebase'; 
import { useNavigation } from '@react-navigation/native';


function Connections() {
    return (
        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
            <Text>Your connections will appear here</Text>
        </View>
    )
}

export default Connections