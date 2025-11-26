import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { useAuth } from "../authentication/AuthContext";
import { LoginScreen } from "../authentication/LoginScreen";
import { SignupScreen } from "../authentication/SignupScreen";
import { TestSetupScreen } from "../screens/TestSetup/TestSetupScreen";
import CustomerAppNavigator from "./CustomerAppNavigator";
import DoctorAppNavigator from "./DoctorAppNavigator";

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  TestSetup: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen 
        name="TestSetup" 
        component={TestSetupScreen}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3A643B" />
      </View>
    );
  }

  // Render different navigators based on authentication and user role
  if (!isAuthenticated) {
    return (
      <NavigationContainer key="auth">
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // Route based on user role
  if (user?.role === 'doctor') {
    return <DoctorAppNavigator key={`doctor-${user.id}`} />;
  }

  // Default to customer app
  return <CustomerAppNavigator key={`customer-${user?.id || 'guest'}`} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
