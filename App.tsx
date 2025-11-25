import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider } from "./src/context/AppContext";
import { AuthProvider } from "./src/authentication/AuthContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
