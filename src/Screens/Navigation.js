import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 


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
import HeaderMenu from '../Components/NavigatioComponent/HeaderMuen';
import AboutUsScreen from './SettingScreen/AboutUsScreen';
import EditAbleProfileScreen from './SettingScreen/EditAbleProfileScreen';
import HomeSetting from './SettingScreen/HomeSetting';
import ProfileScreen from './SettingScreen/ProfileScreen';


  const Stack = createNativeStackNavigator(); 
  // const Drawer = createDrawerNavigator(); 
  const Tab = createBottomTabNavigator();

function PatientDrawer(){
    return(
       <Tab.Navigator
         screenOptions={{
        //  headerStyle: { backgroundColor: '#180991ff' },
         headerTintColor: '#180991ff',
         headerTitleStyle: { fontWeight: 'bold' },
         tabBarActiveTintColor: '#090243ff',
         tabBarInactiveTintColor: '#180991ff',
         }}
       >
        <Tab.Screen name='Home' component={HomePatientScreen}
           options={({ navigation }) => ({
              tabBarIcon: ({ focused, color, size }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
               ),
                 headerShown: true,
                 headerRight: () => <HeaderMenu navigation={navigation} />,
                 title: "Home",
             })}
        />
        <Tab.Screen name='Book Appointment' component={BookAppointScreen} 
          options={{
            tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen name='Appointment Detial' component={AppointmentDetialScreen} 
           options={{
             tabBarIcon: ({ focused, color, size }) => (
               <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={color} />
             ),
           }}
        />
        <Tab.Screen name='Remainder' component={RemainderScreen} 
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'alarm' : 'alarm-outline'} size={size} color={color} />
            ),
          }}
        />
       </Tab.Navigator>
    );
}

function Doctordarwer(){
    return(
        <Tab.Navigator
           screenOptions={{
           //  headerStyle: { backgroundColor: '#180991ff' },
           headerTintColor: '#180991ff',
           headerTitleStyle: { fontWeight: 'bold' },
           }}
         >
            <Tab.Screen name='Home' component={HomeDoctorScreen}
              options={({ navigation }) => ({
                 headerShown: true,
                 headerRight: () => <HeaderMenu navigation={navigation} />,
                 title: "Home",
                 tabBarIcon: ({ focused, color, size }) => (
                   <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                 ),
              })}
            />
            <Tab.Screen name='Sedular' component={AppointmentSedula} 
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
                ),
              }}
            />
        </Tab.Navigator>
    )
}

function Navigation () {
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{ headerBackTitle: 'back', headerTintColor: '#180991ff', }}
      >
        <Stack.Screen name='Home' component={HomeScreen} 
          options={{ headerShown: false, }}
        />
        <Stack.Screen name='Sign In' component={SignInScreen} />
        <Stack.Screen name='Sign Up' component={SignUpScreen} />
        <Stack.Screen name='Our Doctor' component={OurDoctorScreen} />
        <Stack.Screen name='Main Doctor' component={Doctordarwer} 
          options={{ headerShown: false, }}
        />
        <Stack.Screen name='Main Patient' component={PatientDrawer} 
          options={{ headerShown: false, }}
        />
        <Stack.Screen name='Setting' component={HomeSetting} />
        <Stack.Screen name='Profile' component={ProfileScreen} />
        <Stack.Screen name='Edit Profile' component={EditAbleProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;

const styles = StyleSheet.create({ 
});