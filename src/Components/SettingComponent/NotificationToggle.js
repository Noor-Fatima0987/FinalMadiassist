import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function NotificationToggle({ enabled, onToggle }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Notifications</Text>
      <Switch value={enabled} onValueChange={onToggle} trackColor={{true:'#180991ff'}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 18,
    backgroundColor: "#f2f1ff",
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#150A95",
    fontWeight: "600",
  },
});
