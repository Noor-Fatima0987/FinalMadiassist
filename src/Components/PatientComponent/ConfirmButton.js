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
        backgroundColor: disabled ? "#9e94f0" : pressed ? "#3b29c9" : "#4C39DB",
        opacity: disabled ? 0.7 : 1,
      })}
    >
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        Confirm Appointment
      </Text>
    </Pressable>
  );
};

export default ConfirmButton;
