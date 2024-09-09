import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

//import screens
import {ProfileScreen} from './ProfileScreen';
import {Dashboard} from "./Dashboard";
import {Qr} from "./QrScreen";
import {Nearby} from "./NearbyScreen";
import {Connections} from "./Connections";



const Tab = createBottomTabNavigator();

export default function home()
{
    return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: "red",
            }}>
            <Tab.Screen
              name="Home"
              component={Dashboard}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Entypo name="home" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Nearby Connections"
              component={Nearby}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="navigate" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Connections"
              component={Connections}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
    }
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
        },
      });
