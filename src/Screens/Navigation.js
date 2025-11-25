import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {createDrawerNavigator} from '@react-navigation/drawer';


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
import AboutUsScreen from './SettingScreen/AboutUsScreen';
import EditAbleProfileScreen from './SettingScreen/EditAbleProfileScreen';
import HomeSetting from './SettingScreen/HomeSetting';
import ProfileScreen from './SettingScreen/ProfileScreen';


  const Stack = createNativeStackNavigator(); 
  // const Drawer = createDrawerNavigator(); 
  const Tab = createBottomTabNavigator();

function PatientDrawer(){
    return(
       <Tab.Navigator>
        <Tab.Screen name='Home' component={HomePatientScreen}/>
        <Tab.Screen name='Book Appointment' component={BookAppointScreen} />
        <Tab.Screen name='Appointment Detial' component={AppointmentDetialScreen} />
        <Tab.Screen name='Remainder' component={RemainderScreen} />
       </Tab.Navigator>
    );
}

function Doctordarwer(){
    return(
        <Tab.Navigator>
            <Tab.Screen name='Home' component={HomeDoctorScreen} />
            <Tab.Screen name='Sedular' component={AppointmentSedula} />
        </Tab.Navigator>
    )
}

function Navigation () {
  return (
    <NavigationContainer>
      <Stack.Navigator
       screenOptions={{ headerBackTitle: '', headerTintColor: '#180991ff', }}
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigation;

const styles = StyleSheet.create({ 
});