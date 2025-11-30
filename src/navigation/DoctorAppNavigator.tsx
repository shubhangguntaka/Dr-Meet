import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CallProvider } from "../context/CallContext";
import MinimizedCallWindow from "../components/MinimizedCallWindow";
import { IncomingCallListener } from "../components/IncomingCallListener";
import HomeScreen from "../screens/DoctorApp/Home/HomeScreen";
import AppointmentScreen from "../screens/DoctorApp/Appointments/AppointmentsScreen";
import ChatScreen from "../screens/DoctorApp/Chat/ChatScreen";
import NotificationsScreen from "../screens/DoctorApp/Notifications/NotificationsScreen";
import SettingsScreen from "../screens/DoctorApp/Settings/SettingsScreen";
import ProfileScreen from "../screens/DoctorApp/Profile/ProfileScreen";
import AppointmentDetailsScreen from "../screens/DoctorApp/Appointments/AppointmentDetailsScreen";
import VideoCallScreen from "../screens/VideoCallScreen";
import CallEndedScreen from "../screens/DoctorApp/CallScreens/CallEndedScreen";
import PatientNotAvailableScreen from "../screens/DoctorApp/CallScreens/PatientNotAvailableScreen";
import PatientDisconnectedScreen from "../screens/DoctorApp/CallScreens/PatientDisconnectedScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  AppointmentDetails: { appointment: any };
  VideoCall: { appointment: any; userRole: 'doctor' | 'customer' };
  CallEndedScreen: { appointment: any; patientName?: string; callDuration: number; userRole: 'doctor' | 'customer' };
  PatientNotAvailable: { appointment: any; patientName: string };
  PatientDisconnectedScreen: { appointment: any; patientName: string; callDuration: number };
};

export type MainTabParamList = {
  Home: undefined;
  Appointment: undefined;
  Chat: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarStyle: {
          backgroundColor: "#2D5F30",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Appointment",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideoCall"
        component={VideoCallScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CallEndedScreen"
        component={CallEndedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientNotAvailable"
        component={PatientNotAvailableScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PatientDisconnectedScreen"
        component={PatientDisconnectedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function DoctorAppNavigator() {
  return (
    <CallProvider>
      <NavigationContainer>
        <IncomingCallListener>
          <MainNavigator />
          <MinimizedCallWindow />
        </IncomingCallListener>
      </NavigationContainer>
    </CallProvider>
  );
}
