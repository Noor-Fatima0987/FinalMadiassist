import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function SubmitButton({ title, onPress, disabled, isLoading }) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabledButton,
        pressed && !isDisabled && styles.pressedButton,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
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
    marginBottom: moderateScale(30),
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#8c84c9",
    opacity: 0.8,
  },
  pressedButton: {
    backgroundColor: "#0f056b",
  },
  buttonText: { color: "white", fontSize: platformFont(moderateScale(18)), fontWeight: "bold" },
});

