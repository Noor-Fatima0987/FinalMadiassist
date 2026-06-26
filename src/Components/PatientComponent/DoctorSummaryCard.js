import React from "react";
import { View, Text } from "react-native";
import { buildAvailabilityLabel, formatWorkingDays } from "../../utils/doctorAvailability";

const DoctorSummaryCard = ({ doctor }) => {
  if (!doctor) return null;

  const workingDays = doctor.workingDays || [];
  const availabilityLabel =
    doctor.availabilityLabel ||
    (workingDays.length > 0
      ? buildAvailabilityLabel(workingDays, doctor.workingHoursStart, doctor.workingHoursEnd)
      : doctor.availableTime);

  return (
    <View style={{ padding: 12, borderRadius: 8, backgroundColor: "#e0f7fa", marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{doctor.fullName || doctor.name}</Text>
      <Text>{doctor.specialization}</Text>
      <Text style={{ marginTop: 4, color: "#555" }}>
        {availabilityLabel || "Availability not set"}
      </Text>
      {workingDays.length > 0 && (
        <Text style={{ color: "#555" }}>Working days: {formatWorkingDays(workingDays)}</Text>
      )}
      <Text style={{ color: "#555" }}>{doctor.location}</Text>
    </View>
  );
};

export default DoctorSummaryCard;
