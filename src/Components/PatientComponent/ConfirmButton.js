import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@shopify/restyle";

const ConfirmButton = ({ disabled, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: disabled ? colors.mutedIcon : pressed ? colors.primaryTint : colors.primary,
        opacity: disabled ? 0.7 : 1,
      })}
    >
      <Text style={{ color: colors.white, fontWeight: "bold" }}>
        Confirm Appointment
      </Text>
    </Pressable>
  );
};

export default ConfirmButton;
