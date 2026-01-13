import React from "react";
import { Text, StyleSheet } from "react-native";

const Heading = ({ title }) => (
  <Text style={styles.heading}>{title}</Text>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default Heading;
