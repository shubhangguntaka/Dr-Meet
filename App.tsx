import React, { useEffect } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider } from "./src/context/AppContext";
import { AuthProvider } from "./src/authentication/AuthContext";
import { initializeSounds } from "./src/services/soundService";

export default function App() {
  useEffect(() => {
    // Initialize sound service on app start
    initializeSounds();
  }, []);

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
