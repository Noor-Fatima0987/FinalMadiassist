import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { moderateScale } from "../../utils/responsive";

export default function EditButton({ onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Edit Profile</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#180991ff",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(12),
    alignItems: "center",
    marginTop: moderateScale(25),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
});
