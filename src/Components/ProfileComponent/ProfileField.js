import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { moderateScale } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

export default function ProfileField({ label, value }) {
  const { colors } = useTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.primary }]}>{label}:</Text>
      <Text style={[styles.value, { color: colors.mainText }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: moderateScale(14),
    paddingVertical: moderateScale(8),
    borderBottomWidth: 1,
    borderColor: "#D7DFEA",
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: moderateScale(16),
  },
  value: {
    fontSize: moderateScale(16),
    flexShrink: 1,
  },
});
