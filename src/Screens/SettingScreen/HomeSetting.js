import React, { useState, useContext, useEffect } from "react";
import { View, ScrollView, StyleSheet, Pressable, Text, Alert, ActivityIndicator } from "react-native";
import ProfileOption from "../../Components/SettingComponent/ProfileOption";
import NotificationToggle from "../../Components/SettingComponent/NotificationToggle";
import AboutDropdown from "../../Components/SettingComponent/AboutDropdown";
import LogoutButton from "../../Components/SettingComponent/LogoutButton";
import { UserContext } from "../../store/context/UserContext";
import {
  ensureNotificationPermissionsAsync,
  getNotificationPermissionStatusAsync,
  registerForPushNotificationsAsync,
  registerAndSyncPushTokenForUser,
  sendTestNotificationAsync,
} from "../../utils/notificationUtils";

export default function HomeSetting({ navigation }) {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null); // null | 'ok' | 'fail'
  const [pushToken, setPushToken] = useState(null);
  const { logout, user } = useContext(UserContext);

  useEffect(() => {
    const syncNotificationState = async () => {
      const status = await getNotificationPermissionStatusAsync();
      setNotificationEnabled(status === "granted");
      const token = await registerForPushNotificationsAsync().catch(() => null);
      setPushToken(token || null);
    };

    syncNotificationState();
  }, []);

  const handleTestNotification = async () => {
    if (isTesting) return;
    setIsTesting(true);
    try {
      const sent = await sendTestNotificationAsync();
      if (sent) {
        Alert.alert(
          "✅ Test Sent!",
          "Notification 1 second mein aayegi. Agar nahi ayi toh notifications OFF hain ya permission nahi hai."
        );
      } else {
        Alert.alert(
          "❌ Failed",
          "Notification permission nahi mili. Phone ki Settings mein jaa kar MediAssist ki notifications ON karein."
        );
      }
    } catch (e) {
      Alert.alert("Error", e.message || "Test notification send nahi ho saka.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleSyncToken = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncResult(null);
    try {
      if (!user?.firebaseId) {
        Alert.alert("Error", "User login info nahi mili. Logout karke dobara login karein.");
        setSyncResult('fail');
        return;
      }
      const token = await registerAndSyncPushTokenForUser(user.firebaseId);
      if (token) {
        setPushToken(token);
        setSyncResult('ok');
        Alert.alert(
          "✅ Token Saved!",
          `Push token backend mein save ho gaya.\n\nToken:\n${token.slice(0, 50)}...\n\nAb appointment book karo — doctor ko notification milni chahiye.`
        );
      } else {
        setSyncResult('fail');
        Alert.alert(
          "❌ Token Save Failed",
          "Push token backend mein save nahi ho saka. Check karein:\n• Internet connection on hai?\n• App ko notification permission hai?"
        );
      }
    } catch (e) {
      setSyncResult('fail');
      Alert.alert("Error", e.message || "Unknown error");
    } finally {
      setIsSyncing(false);
    }
  };

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

      {/* Test Notification Button */}
      <View style={styles.testCard}>
        <Text style={styles.testTitle}>🔔 Notification Test</Text>
        <Text style={styles.testSubtitle}>
          Is button ko press karein — agar is device par notification aaye to notifications working hain.
        </Text>

        {/* Step 1: Test local notification */}
        <Text style={styles.stepLabel}>Step 1 — Local Test</Text>
        <Pressable
          style={[styles.testButton, isTesting && styles.testButtonDisabled]}
          onPress={handleTestNotification}
          disabled={isTesting}
        >
          {isTesting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.testButtonText}>📲 Send Test Notification</Text>
          )}
        </Pressable>

        {/* Step 2: Sync token to backend */}
        <Text style={styles.stepLabel}>Step 2 — Backend Token Sync</Text>
        <Pressable
          style={[
            styles.syncButton,
            isSyncing && styles.testButtonDisabled,
            syncResult === 'ok' && styles.syncButtonOk,
            syncResult === 'fail' && styles.syncButtonFail,
          ]}
          onPress={handleSyncToken}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.testButtonText}>
              {syncResult === 'ok' ? '✅ Token Saved to Backend' : syncResult === 'fail' ? '❌ Sync Failed — Retry' : '☁️ Sync Token to Backend'}
            </Text>
          )}
        </Pressable>

        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Push Token (Debug):</Text>
          <Text style={styles.tokenValue} numberOfLines={3} selectable>
            {pushToken || "❌ Token nahi mila — notifications kaam nahi karengi"}
          </Text>
        </View>
      </View>

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
  testCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0ff",
    elevation: 2,
    shadowColor: "#180991",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#180991",
    marginBottom: 6,
  },
  testSubtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 14,
    lineHeight: 18,
  },
  testButton: {
    backgroundColor: "#180991",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  testButtonDisabled: {
    backgroundColor: "#9fa8da",
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  tokenBox: {
    backgroundColor: "#f4f7fe",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#dde3f5",
  },
  tokenLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tokenValue: {
    fontSize: 11,
    color: "#333",
    fontFamily: "monospace",
    lineHeight: 16,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#180991",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  syncButton: {
    backgroundColor: "#0d47a1",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  syncButtonOk: {
    backgroundColor: "#2e7d32",
  },
  syncButtonFail: {
    backgroundColor: "#c62828",
  },
});
