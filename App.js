import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/Screens/Navigation';
import { UserProvider } from './src/store/context/UserContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Hide the splash screen after a short delay or when app is ready
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to show logo
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Navigation />
    </UserProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
