import React, { useContext } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { UserContext } from '../store/context/UserContext';
import { useTheme } from '@shopify/restyle';
import { useThemeMode } from '../theme';

import HomePatientScreen from './PatientDashBoard/HomePatientScreen';
import AppointmentDetialScreen from './PatientDashBoard/AppointmentDetialScreen';
import BookAppointScreen from './PatientDashBoard/BookAppointScreen';
import RemainderScreen from './PatientDashBoard/RemainderScreen';
import HomeDoctorScreen from './DoctorDashBoard/HomeDoctorScreen';
import AppointmentSedula from './DoctorDashBoard/AppointmentSedula';
import HomeScreen from './MainScreens/HomeScreen';
import OurDoctorScreen from './MainScreens/OurDoctorScreen';
import SignInScreen from './MainScreens/SignInScreen';
import SignUpScreen from './MainScreens/SignUpScreen';
import Prescription from './PatientDashBoard/PrescriptionScreen';
import HeaderMenu from '../Components/NavigatioComponent/HeaderMuen';
import AddPrescription from './DoctorDashBoard/AddprescriptionScreen';
import PatientList from './DoctorDashBoard/PatientsList';
import ApprovalPendingScreen from './DoctorDashBoard/ApprovalPendingScreen';
import AboutUsScreen from './SettingScreen/AboutUsScreen';
import EditAbleProfileScreen from './SettingScreen/EditAbleProfileScreen';
import HomeSetting from './SettingScreen/HomeSetting';
import ProfileScreen from './SettingScreen/ProfileScreen';
import AppearanceScreen from './SettingScreen/AppearanceScreen';
import HeaderLogo from '../Components/NavigatioComponent/HeaderLogo';
import BackButton from '../Components/NavigatioComponent/BackButton';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function createNavigationTheme(colors, resolvedMode) {
  return {
    dark: resolvedMode === 'dark',
    colors: {
      primary: colors.primary,
      background: colors.mainBackground,
      card: colors.cardBackground,
      text: colors.mainText,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: Platform.select({
      ios: {
        regular: {
          fontFamily: 'System',
          fontWeight: '400',
        },
        medium: {
          fontFamily: 'System',
          fontWeight: '500',
        },
        bold: {
          fontFamily: 'System',
          fontWeight: '700',
        },
        heavy: {
          fontFamily: 'System',
          fontWeight: '800',
        },
      },
      android: {
        regular: {
          fontFamily: 'Roboto',
          fontWeight: 'normal',
        },
        medium: {
          fontFamily: 'Roboto',
          fontWeight: '500',
        },
        bold: {
          fontFamily: 'Roboto',
          fontWeight: '700',
        },
        heavy: {
          fontFamily: 'Roboto',
          fontWeight: '800',
        },
      },
      default: {
        regular: {
          fontFamily: 'System',
          fontWeight: '400',
        },
        medium: {
          fontFamily: 'System',
          fontWeight: '500',
        },
        bold: {
          fontFamily: 'System',
          fontWeight: '700',
        },
        heavy: {
          fontFamily: 'System',
          fontWeight: '800',
        },
      },
    }),
  };
}

function PatientDrawer() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold', color: colors.mainText },
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.mainBackground },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePatientScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
          headerShown: true,
          headerTitle: 'MadiAssist',
          headerLeft: () => <HeaderLogo />,
          headerRight: () => <HeaderMenu navigation={navigation} />,
        })}
      />
      <Tab.Screen
        name="Book Appointment"
        component={BookAppointScreen}
        options={{
          headerTitle: 'MadiAssist',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
          headerLeft: () => <BackButton />,
        }}
      />
      <Tab.Screen
        name="Appointment Detial"
        component={AppointmentDetialScreen}
        options={{
          headerTitle: 'MadiAssist',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
          ),
          headerLeft: () => <BackButton />,
        }}
      />
      <Tab.Screen
        name="Remainder"
        component={RemainderScreen}
        options={{
          headerTitle: 'MadiAssist',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'alarm' : 'alarm-outline'} size={size} color={color} />
          ),
          headerLeft: () => <BackButton />,
        }}
      />
    </Tab.Navigator>
  );
}

function Doctordarwer() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: 'bold', color: colors.mainText },
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.mainBackground },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDoctorScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'MadiAssist',
          headerLeft: () => <HeaderLogo />,
          headerRight: () => <HeaderMenu navigation={navigation} />,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Sedular"
        component={AppointmentSedula}
        options={{
          headerTitle: 'MadiAssist',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
          headerLeft: () => <BackButton />,
        }}
      />
      <Tab.Screen
        name="Add Prescription"
        component={AddPrescription}
        options={{
          headerTitle: 'MadiAssist',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'medical' : 'medical-outline'} size={size} color={color} />
          ),
          headerLeft: () => <BackButton />,
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const { user, isAuthLoading } = useContext(UserContext);
  const { colors } = useTheme();
  const { resolvedMode } = useThemeMode();

  const navigationTheme = createNavigationTheme(colors, resolvedMode);

  if (isAuthLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.mainBackground,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 10, color: colors.primary, fontWeight: 'bold' }}>
          Loading MadiAssist...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: 'back',
          headerBackVisible: false,
          headerShadowVisible: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: 'bold', color: colors.mainText },
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: colors.mainBackground },
          headerLeft: () => <BackButton />,
        }}
      >
        {!user?.role ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Our Doctor" component={OurDoctorScreen} />
            <Stack.Screen name="Sign In" component={SignInScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
          </>
        ) : user.role === 'DOCTOR' ? (
          <>
            <Stack.Screen name="Main Doctor" component={Doctordarwer} options={{ headerShown: false }} />
            <Stack.Screen name="Setting" component={HomeSetting} />
            <Stack.Screen name="Appearance" component={AppearanceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Patient List" component={PatientList} />
            <Stack.Screen name="Edit Profile" component={EditAbleProfileScreen} />
            <Stack.Screen name="About Us" component={AboutUsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main Patient" component={PatientDrawer} options={{ headerShown: false }} />
            <Stack.Screen name="Our Doctor" component={OurDoctorScreen} />
            <Stack.Screen name="Setting" component={HomeSetting} />
            <Stack.Screen name="Appearance" component={AppearanceScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Prescription" component={Prescription} />
            <Stack.Screen name="Edit Profile" component={EditAbleProfileScreen} />
            <Stack.Screen name="About Us" component={AboutUsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
