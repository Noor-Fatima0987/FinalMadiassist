import React from "react";
import { View, Text } from "react-native";

const DoctorSummaryCard = ({ doctor }) => {
  if (!doctor) return null;

  return (
    <View style={{ padding: 12, borderRadius: 8, backgroundColor: "#e0f7fa", marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{doctor.name}</Text>
      <Text>{doctor.specialization}</Text>
      <Text style={{ marginTop: 4, color: "#555" }}>{doctor.availableTime}</Text>
      <Text style={{ color: "#555" }}>{doctor.location}</Text>
    </View>
  );
};

export default DoctorSummaryCard;
