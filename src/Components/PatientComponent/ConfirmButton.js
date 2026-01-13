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
        backgroundColor: "#4C39DB",
      })}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        Confirm Appointment
      </Text>
    </Pressable>
  );
};

export default ConfirmButton;
