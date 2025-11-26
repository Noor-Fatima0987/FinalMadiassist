import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function AboutDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.box}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text style={styles.text}>About Us ⌄</Text>
      </TouchableOpacity>

      {open && (
        <Text style={styles.desc}>
          MediAssist helps you manage appointments, medical records, reminders,
          and connect with doctors easily & securely.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 18,
    backgroundColor: "#f2f1ff",
    borderRadius: 12,
    marginBottom: 15,
  },
  text: {
    fontSize: 18,
    color: "#150A95",
    fontWeight: "600",
  },
  desc: {
    marginTop: 10,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});

