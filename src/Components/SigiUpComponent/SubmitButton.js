import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function SubmitButton({ title, onPress }) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#180991ff",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: "center",
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
    elevation: 2,
  },
  buttonText: { color: "white", fontSize: platformFont(moderateScale(18)), fontWeight: "bold" },
});
