import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  multiline,
  secureTextEntry,
  error,
  keyboardType,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#2c1ca4ff"
        style={[styles.input, multiline && { height: moderateScale(80) }]}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: moderateScale(15) },
  label: {
    fontSize: platformFont(moderateScale(16)),
    color: "#180991ff",
    marginBottom: moderateScale(5),
    fontWeight: "500",
  },
  required: { color: "red" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    fontSize: platformFont(moderateScale(16)),
    color: "#180991ff",
  },
  error: {
    color: "red",
    fontSize: platformFont(moderateScale(13)),
    marginTop: moderateScale(4),
  },
});
