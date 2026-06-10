import React, { useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { UserContext } from "../../store/context/UserContext";
import ProfileField from "../../Components/ProfileComponent/ProfileField";
import EditButton from "../../Components/ProfileComponent/EditButton";
import { moderateScale } from "../../utils/responsive";

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  const isDoctor = user.role === "DOCTOR" || user.role === "doctor";
  const isPatient = user.role === "PATIENT" || user.role === "patient";

  return (
    <ScrollView style={styles.container}>
      <ProfileField label="Full Name" value={user.fullName || "N/A"} />
      <ProfileField label="Email" value={user.email || "N/A"} />
      <ProfileField label="Contact Number" value={user.contactNumber || "N/A"} />
      <ProfileField label="Gender" value={user.gender || "N/A"} />
      <ProfileField label="CNIC" value={user.cnic || "N/A"} />
      <ProfileField label="Address" value={user.address || "N/A"} />

      {isDoctor && (
        <>
          <ProfileField
            label="Specialization"
            value={user.doctorProfile?.specialty || "N/A"}
          />
          <ProfileField
            label="Experience"
            value={
              user.doctorProfile?.experience !== undefined && user.doctorProfile?.experience !== null
                ? `${user.doctorProfile.experience} Years`
                : "N/A"
            }
          />
          <ProfileField
            label="License Number"
            value={user.doctorProfile?.licenseNo || "N/A"}
          />
        </>
      )}

      {isPatient && (
        <>
          <ProfileField
            label="Age"
            value={
              user.patientProfile?.age !== undefined && user.patientProfile?.age !== null
                ? user.patientProfile.age.toString()
                : "N/A"
            }
          />
          <ProfileField
            label="Medical History"
            value={user.patientProfile?.medicalHistory || "N/A"}
          />
        </>
      )}

      <EditButton onPress={() => navigation.navigate("Edit Profile")} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    backgroundColor: "#fff",
  },
});
