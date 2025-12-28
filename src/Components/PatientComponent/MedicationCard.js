import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MedicationCard = ({ time, dose }) => (
  <View style={styles.card}>
    <Text style={styles.time}>{time}:</Text>
    <Text>{dose}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 4,
    borderRadius: 8,
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
