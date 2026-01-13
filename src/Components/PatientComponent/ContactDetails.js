import React from "react";
import { View, Text, TextInput } from "react-native";

const ContactDetails = ({ value, onChange }) => {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Contact Details
      </Text>

      <TextInput
        placeholder="Phone or Email"
        value={value}
        onChangeText={onChange}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
        }}
      />
    </View>
  );
};

export default ContactDetails;
