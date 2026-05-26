import React, { useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { UserContext } from "../../store/context/UserContext";

import EditableField from "../../Components/EditProfileComponent/EidtableField";
import SaveButton from "../../Components/EditProfileComponent/SaveButton";

const BACKEND_URL = "https://mediassist-rho.vercel.app";

export default function EditableProfileScreen({ navigation }) {
  const { user, saveUser } = useContext(UserContext);
  
  // Flatten the user object into a single flat state for easy editing
  const [editedUser, setEditedUser] = useState({
    ...user,
    ...(user.doctorProfile || {}),
    ...(user.patientProfile || {})
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
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

      if (user.role === "DOCTOR") {
        payload.doctorProfile = {
          specialty: editedUser.specialty || editedUser.specialization,
          experience: editedUser.experience,
          bio: editedUser.bio
        };
      } else if (user.role === "PATIENT") {
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
    const baseFields = ["fullName", "email", "contactNumber", "gender", "address", "cnic", "role"];
    const docFields = ["specialty", "experience", "bio"];
    const patFields = ["age", "medicalHistory"];

    let ordered = [...baseFields];
    if (user.role === "DOCTOR") ordered = [...ordered, ...docFields];
    if (user.role === "PATIENT") ordered = [...ordered, ...patFields];

    // Merge any other keys that might exist but aren't in our ordered list (excluding system keys)
    const systemKeys = ["id", "firebaseId", "password", "createdAt", "updatedAt", "doctorProfile", "patientProfile", "userId"];
    
    const remainingKeys = Object.keys(editedUser).filter(
      key => !ordered.includes(key) && !systemKeys.includes(key)
    );

    return [...ordered, ...remainingKeys];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {getOrderedKeys().map((key) => {
        // Readonly fields that shouldn't be edited
        const isReadOnly = ["email", "role"].includes(key);

        // Friendly labels
        let label = key.charAt(0).toUpperCase() + key.slice(1);
        if (key === "contactNumber") label = "Phone Number";
        if (key === "fullName") label = "Full Name";
        if (key === "medicalHistory") label = "Medical History";

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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7ff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#180991ff",
    textAlign: "center",
    marginBottom: 20,
  },
});
