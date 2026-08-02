import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { moderateScale } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

export default function EditButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={onPress}>
      <Text style={styles.buttonText}>Edit Profile</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
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
