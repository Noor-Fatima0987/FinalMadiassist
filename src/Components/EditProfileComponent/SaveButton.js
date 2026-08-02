import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@shopify/restyle";

export default function SaveButton({ onPress }) {
  const { colors } = useTheme();

  return (
    <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={onPress}>
      <Text style={styles.text}>Save Changes</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
