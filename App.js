import { StatusBar } from 'expo-status-bar';
import Navigation from './src/Screens/Navigation';
import { UserProvider } from './src/store/context/UserContext';
import { AlarmProvider } from './src/store/context/AlarmContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from './src/utils/notificationUtils';
import { ThemeModeProvider, useThemeMode } from './src/theme';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { resolvedMode } = useThemeMode();

  return (
    <>
      <StatusBar style={resolvedMode === 'dark' ? 'light' : 'dark'} />
      <Navigation />
    </>
  );
}

export default function App() {
  useEffect(() => {
    // Register for notifications on startup
    registerForPushNotificationsAsync();

    // Hide the splash screen after a short delay or when app is ready
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to show logo
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <UserProvider>
      <AlarmProvider>
        <ThemeModeProvider>
          <AppContent />
        </ThemeModeProvider>
      </AlarmProvider>
    </UserProvider>
  );
}
