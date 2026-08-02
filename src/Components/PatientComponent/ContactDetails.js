import React from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme } from "@shopify/restyle";

const ContactDetails = ({ value, onChange }) => {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8, color: colors.mainText }}>
        Contact Details
      </Text>

      <TextInput
        placeholder="Phone or Email"
        placeholderTextColor={colors.mutedIcon}
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          padding: 10,
          borderRadius: 6,
          color: colors.mainText,
          backgroundColor: colors.cardBackground,
        }}
      />
    </View>
  );
};

export default ContactDetails;
