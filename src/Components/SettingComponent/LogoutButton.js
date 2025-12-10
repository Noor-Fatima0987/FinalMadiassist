import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function LogoutButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.logout} onPress={onPress}>
      <Text style={styles.logoutText}>Logout</Text>
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
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
