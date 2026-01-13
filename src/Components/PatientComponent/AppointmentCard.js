import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AppointmentCard = ({ title, doctor, date, time, status }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.doctorName}>{doctor}</Text>
        <Text style={styles.detailText}>{status || "General Consultation"}</Text>
      </View>
      <View style={styles.iconCircle}>
        <Ionicons name="medical" size={24} color="#fff" />
      </View>
    </View>

    <View style={styles.divider} />

    <View style={styles.footer}>
      <View style={styles.timeContainer}>
        <Ionicons name="time" size={18} color="rgba(255,255,255,0.8)" />
        <Text style={styles.timeText}>
          {date} • {time}
        </Text>
      </View>
      {status && (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#180991",
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#180991",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  detailText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  statusText: {
    color: "#180991",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default AppointmentCard;
