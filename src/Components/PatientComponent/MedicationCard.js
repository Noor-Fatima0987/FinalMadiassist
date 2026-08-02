import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@shopify/restyle";

const MedicationCard = ({ time, dose }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Text style={[styles.time, { color: colors.primary }]}>{time}:</Text>
      <Text style={{ color: colors.mainText, flexShrink: 1 }}>{dose}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  time: {
    fontWeight: "bold",
  },
});

export default MedicationCard;
