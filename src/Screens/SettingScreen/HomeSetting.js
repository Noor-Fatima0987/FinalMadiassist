import React, { useState, useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ProfileOption from "../../Components/SettingComponent/ProfileOption";
import NotificationToggle from "../../Components/SettingComponent/NotificationToggle";
import AboutDropdown from "../../Components/SettingComponent/AboutDropdown";
import LogoutButton from "../../Components/SettingComponent/LogoutButton";
import { UserContext } from "../../store/context/UserContext";

export default function HomeSetting({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const { logout } = useContext(UserContext);

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
      <LogoutButton onPress={() => logout()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
