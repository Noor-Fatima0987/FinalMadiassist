import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, StyleSheet, Text, Alert } from "react-native";
import ProfileOption from "../../Components/SettingComponent/ProfileOption";
import NotificationToggle from "../../Components/SettingComponent/NotificationToggle";
import AboutDropdown from "../../Components/SettingComponent/AboutDropdown";
import LogoutButton from "../../Components/SettingComponent/LogoutButton";
import { UserContext } from "../../store/context/UserContext";
import {
  ensureNotificationPermissionsAsync,
  getNotificationPermissionStatusAsync,
  registerForPushNotificationsAsync,
} from "../../utils/notificationUtils";

export default function HomeSetting({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useContext(UserContext);

  useEffect(() => {
    const syncNotificationState = async () => {
      const status = await getNotificationPermissionStatusAsync();
      setNotificationEnabled(status === "granted");
      await registerForPushNotificationsAsync().catch(() => null);
    };

    syncNotificationState();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile */}
      <ProfileOption onPress={() => navigation.navigate("Profile")} />

      {/* Notification Toggle */}
      <NotificationToggle
        enabled={notificationEnabled}
        onToggle={async () => {
          if (!notificationEnabled) {
            const allowed = await ensureNotificationPermissionsAsync();
            setNotificationEnabled(allowed);
            return;
          }

          setNotificationEnabled(false);
          Alert.alert(
            "App Setting Only",
            "Notifications ko is screen se off karna sirf app preference hai. OS-level permission ko app se revoke nahi kiya ja sakta."
          );
        }}
      />

      {/* About Dropdown */}
      <AboutDropdown />

      {/* Logout */}
      <LogoutButton
        isLoading={isLoggingOut}
        onPress={async () => {
          if (isLoggingOut) return;
          setIsLoggingOut(true);
          try {
            await logout();
          } finally {
            setIsLoggingOut(false);
          }
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
