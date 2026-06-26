import React, { useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { UserContext } from "../../store/context/UserContext";
import { parseTimeToMinutes } from "../../utils/doctorAvailability";

import EditableField from "../../Components/EditProfileComponent/EidtableField";
import SaveButton from "../../Components/EditProfileComponent/SaveButton";

const BACKEND_URL = "https://mediassist-rho.vercel.app";

export default function EditableProfileScreen({ navigation }) {
  const { user, saveUser } = useContext(UserContext);
  const isDoctor = user.role === "DOCTOR" || user.role === "doctor";
  
  // Flatten the user object into a single flat state for easy editing
  const [editedUser, setEditedUser] = useState({
    ...user,
    ...(user.doctorProfile || {}),
    ...(user.patientProfile || {}),
    ...(isDoctor ? {
      workingDays: Array.isArray(user.doctorProfile?.workingDays)
        ? user.doctorProfile.workingDays.join(", ")
        : user.doctorProfile?.workingDays || "",
      workingHoursStart: user.doctorProfile?.workingHoursStart || "",
      workingHoursEnd: user.doctorProfile?.workingHoursEnd || "",
    } : {})
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isDoctor) {
        const startMinutes = parseTimeToMinutes(editedUser.workingHoursStart);
        const endMinutes = parseTimeToMinutes(editedUser.workingHoursEnd);

        if (!editedUser.workingDays?.toString().trim()) {
          Alert.alert("Error", "Working days are required for doctors.");
          setIsSaving(false);
          return;
        }

        if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
          Alert.alert("Error", "Please enter a valid working hours range.");
          setIsSaving(false);
          return;
        }
      }

      // Re-pack nested profile objects before sending to backend
      const payload = {
        fullName: editedUser.fullName,
        email: editedUser.email,
        contactNumber: editedUser.contactNumber,
        cnic: editedUser.cnic,
        gender: editedUser.gender,
        address: editedUser.address,
        role: editedUser.role,
      };

      if (isDoctor) {
        payload.doctorProfile = {
          specialty: editedUser.specialty || editedUser.specialization,
          experience: editedUser.experience,
          licenseNo: editedUser.licenseNo,
          bio: editedUser.bio,
          workingDays: editedUser.workingDays,
          workingHoursStart: editedUser.workingHoursStart,
          workingHoursEnd: editedUser.workingHoursEnd
        };
      } else if (user.role === "PATIENT" || user.role === "patient") {
        payload.patientProfile = {
          age: editedUser.age,
          medicalHistory: editedUser.medicalHistory
        };
      }

      const response = await fetch(`${BACKEND_URL}/api/user/${user.firebaseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const updatedData = await response.json();

      if (response.ok) {
        saveUser(updatedData); // Update context with fresh DB data
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", updatedData.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network request failed.");
    } finally {
      setIsSaving(false);
    }
  };

  // Define the requested order of fields
  const getOrderedKeys = () => {
    const baseFields = ["fullName", "email", "contactNumber", "gender", "cnic", "address", "role"];
    const docFields = ["specialty", "experience", "licenseNo", "workingDays", "workingHoursStart", "workingHoursEnd", "bio"];
    const patFields = ["age", "medicalHistory"];

    let ordered = [...baseFields];
    if (isDoctor) ordered = [...ordered, ...docFields];
    if (user.role === "PATIENT" || user.role === "patient") ordered = [...ordered, ...patFields];

    // Merge any other keys that might exist but aren't in our ordered list (excluding system keys)
    const systemKeys = ["id", "firebaseId", "password", "createdAt", "updatedAt", "doctorProfile", "patientProfile", "userId"];
    
    const remainingKeys = Object.keys(editedUser).filter(
      key => !ordered.includes(key) && !systemKeys.includes(key)
    );

    return [...ordered, ...remainingKeys];
  };

  return (
    <ScrollView 
      style={styles.scrollView} 
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Edit Profile</Text>

      {getOrderedKeys().map((key) => {
        // Readonly fields that shouldn't be edited
        const isReadOnly = ["email", "role"].includes(key);

        // Friendly labels
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === "contactNumber") label = "Phone Number";
        if (key === "fullName") label = "Full Name";
        if (key === "medicalHistory") label = "Medical History";
        if (key === "licenseNo") label = "License Number";
        if (key === "workingDays") label = "Working Days";
        if (key === "workingHoursStart") label = "Working Hours Start";
        if (key === "workingHoursEnd") label = "Working Hours End";

        return (
          <View key={key} pointerEvents={isReadOnly ? "none" : "auto"} style={isReadOnly ? {opacity: 0.6} : {}}>
            <EditableField
              label={label}
              value={editedUser[key]?.toString() || ""}
              onChange={(text) => handleChange(key, text)}
            />
          </View>
        );
      })}

      {isSaving ? (
        <ActivityIndicator size="large" color="#180991ff" style={{ marginVertical: 20 }} />
      ) : (
        <SaveButton onPress={handleSave} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f7f7ff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#180991ff",
    textAlign: "center",
    marginBottom: 20,
  },
});
