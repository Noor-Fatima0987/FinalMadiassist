import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './src/Screens/Navigation';
import { UserProvider } from './src/store/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <Navigation/>
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
