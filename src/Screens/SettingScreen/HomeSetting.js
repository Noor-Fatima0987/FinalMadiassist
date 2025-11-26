import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ProfileOption from "../../Components/SettingComponent/ProfileOption";
import NotificationToggle from "../../Components/SettingComponent/NotificationToggle";
import AboutDropdown from "../../Components/SettingComponent/AboutDropdown";
import LogoutButton from "../../Components/SettingComponent/LogoutButton";

export default function HomeSetting({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile */}
      <ProfileOption onPress={() => navigation.navigate("Profile")} />

      {/* Notification Toggle */}
      <NotificationToggle
        enabled={notificationEnabled}
        onToggle={() => setNotificationEnabled(!notificationEnabled)}
      />

      {/* About Dropdown */}
      <AboutDropdown />

      {/* Logout */}
      <LogoutButton onPress={() => navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
       })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
