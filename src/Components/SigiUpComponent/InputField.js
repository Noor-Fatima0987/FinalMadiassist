import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  maxLength,
}) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputWrapper, multiline && { height: moderateScale(80) }]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#2c1ca4ff"
          style={[styles.input, multiline && { height: "100%" }]}
          value={value}
          onChangeText={onChange}
          secureTextEntry={isSecure}
          multiline={multiline}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} style={styles.iconContainer}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={moderateScale(20)}
              color="#180991ff"
            />
          </Pressable>
        )}
      </View>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(12),
  },
  input: {
    flex: 1,
    paddingVertical: moderateScale(12),
    fontSize: platformFont(moderateScale(16)),
    color: "#180991ff",
  },
  iconContainer: {
    padding: moderateScale(4),
  },
  error: {
    color: "red",
    fontSize: platformFont(moderateScale(13)),
    marginTop: moderateScale(4),
  },
});
