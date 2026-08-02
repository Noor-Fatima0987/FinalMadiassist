import React, { useState, useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import * as Notifications from "expo-notifications";
import ProfileOption from "../../Components/SettingComponent/ProfileOption";
import NotificationToggle from "../../Components/SettingComponent/NotificationToggle";
import AboutDropdown from "../../Components/SettingComponent/AboutDropdown";
import LogoutButton from "../../Components/SettingComponent/LogoutButton";
import AppearanceOption from "../../Components/SettingComponent/AppearanceOption";
import { UserContext } from "../../store/context/UserContext";
import { useTheme } from "@shopify/restyle";
import { useThemeMode } from "../../theme";

export default function HomeSetting({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const { logout } = useContext(UserContext);
  const { colors } = useTheme();
  const { mode } = useThemeMode();

  useEffect(() => {
    let mounted = true;

    const loadNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (mounted) {
        setNotificationEnabled(status === "granted");
      }
    };

    loadNotificationPermission();

    return () => {
      mounted = false;
    };
  }, []);

  const handleNotificationToggle = async () => {
    if (notificationEnabled) {
      setNotificationEnabled(false);
      return;
    }

    const current = await Notifications.getPermissionsAsync();
    let status = current.status;

    if (status !== "granted") {
      const requested = await Notifications.requestPermissionsAsync();
      status = requested.status;
    }

    setNotificationEnabled(status === "granted");
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.mainBackground }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.mainText }]}>Settings</Text>

      <ProfileOption onPress={() => navigation.navigate("Profile")} />

      <NotificationToggle
        enabled={notificationEnabled}
        onToggle={handleNotificationToggle}
      />

      <AppearanceOption
        mode={mode}
        onPress={() => navigation.navigate("Appearance")}
      />

      <AboutDropdown />

      <LogoutButton onPress={() => logout()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 18,
  },
});
