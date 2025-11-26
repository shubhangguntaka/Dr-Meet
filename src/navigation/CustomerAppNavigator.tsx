import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/CustomerApp/Home/HomeScreen";
import BulletinScreen from "../screens/CustomerApp/Bulletin/BulletinScreen";
import ConsultScreen from "../screens/CustomerApp/Consult/ConsultScreen";
import ForumScreen from "../screens/CustomerApp/Forum/ForumScreen";
import ShopScreen from "../screens/CustomerApp/Shop/ShopScreen";
import ProfileScreen from "../screens/CustomerApp/Profile/ProfileScreen";
import DoctorsListScreen from "../screens/CustomerApp/Consult/DoctorsListScreen";
import ScheduleScreen from "../screens/CustomerApp/Consult/ScheduleScreen";
import BookingScreen from "../screens/CustomerApp/Consult/BookingScreen";
import BookedScreen from "../screens/CustomerApp/Consult/BookedScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  SelectConcern: undefined;
  Profile: undefined;
  DoctorsList: { concernName: string };
  Schedule: { doctor: any };
  Booking: { doctor: any; consultationType: string; price: number };
  Booked: { doctor: any; appointmentDate: string; appointmentTime: string; consultationType: string; price: number };
};

export type MainTabParamList = {
  Home: undefined;
  Shop: undefined;
  Consult: undefined;
  Forum: undefined;
  Bulletin: undefined;
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
        name="Shop"
        component={ShopScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Consult"
        component={ConsultScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Consult",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart-pulse" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Forum",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bulletin"
        component={BulletinScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Bulletin",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
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
        name="SelectConcern"
        component={ConsultScreen}
        options={{
          headerTitle: "Select Concern",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
            color: "#1F2937",
          },
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorsList"
        component={DoctorsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Booked"
        component={BookedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function CustomerAppNavigator() {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
