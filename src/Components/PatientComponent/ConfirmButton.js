import React from "react";
import { Pressable, Text } from "react-native";

const ConfirmButton = ({ disabled, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        backgroundColor: disabled
          ? "#ccc"
          : pressed
          ? "#43a047"
          : "#4caf50",
      })}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        Confirm Appointment
      </Text>
    </Pressable>
  );
};

export default ConfirmButton;
