// src/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../authentication/AuthContext";
import { LoginScreen } from "../authentication/LoginScreen";
import { SignupScreen } from "../authentication/SignupScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import BulletinScreen from "../screens/Bulletin/BulletinScreen";
import ConsultScreen from "../screens/Consult/ConsultScreen";
import ForumScreen from "../screens/Forum/ForumScreen";
import ShopScreen from "../screens/Shop/ShopScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  SelectConcern: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Shop: undefined;
  Consult: undefined;
  Forum: undefined;
  Bulletin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
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
          elevation: 8,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
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

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
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
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A643B" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
