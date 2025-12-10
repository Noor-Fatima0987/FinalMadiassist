import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function EditableField({ label, value, onChange }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "#180991ff",
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff"
  },
});
