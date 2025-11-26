import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "../../utils/responsive";

export default function ProfileField({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    color: "#180991ff",
    fontSize: moderateScale(16),
  },
  value: {
    fontSize: moderateScale(16),
    color: "#333",
    flexShrink: 1,
  },
});
