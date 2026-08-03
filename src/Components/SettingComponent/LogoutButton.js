import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from "react-native";

export default function LogoutButton({ onPress, isLoading }) {
  return (
    <TouchableOpacity
      style={[styles.logout, isLoading && styles.logoutDisabled]}
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.logoutText}>Logging out...</Text>
        </View>
      ) : (
        <Text style={styles.logoutText}>Logout</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logout: {
    padding: 15,
    backgroundColor: '#180991ff',
    borderRadius: 12,
    marginTop: 10,
  },
  logoutDisabled: {
    opacity: 0.75,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
