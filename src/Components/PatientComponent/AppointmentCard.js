import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppointmentCard = ({ title, doctor, date, time, status }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text>{doctor}</Text>
    {time && <Text>{time}</Text>}
    {status && <Text>Status: {status}</Text>}
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#e0f7e9",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default AppointmentCard;
