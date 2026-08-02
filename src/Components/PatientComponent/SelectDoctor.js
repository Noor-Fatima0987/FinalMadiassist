import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@shopify/restyle";

const SelectDoctor = ({ onPress, selectedDoctor }) => {
  const { colors, borderRadii } = useTheme();

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8, color: colors.primary }}>
        Select Doctor
      </Text>

      <Pressable
        onPress={onPress}
        style={{
          padding: 12,
          borderRadius: borderRadii.md,
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ color: colors.mainText }}>
          {selectedDoctor ? (selectedDoctor.fullName || selectedDoctor.name) : "Select Doctor"}
        </Text>
      </Pressable>
    </View>
  );
};

export default SelectDoctor;
