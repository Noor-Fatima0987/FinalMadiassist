import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ProfileOption({ onPress }) {
  return (
    <TouchableOpacity style={styles.box} onPress={onPress}>
      <Text style={styles.text}>Profile</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 18,
    backgroundColor: "#f2f1ff",
    borderRadius: 12,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    color: "#150A95",
    fontWeight: "600",
  },
});
