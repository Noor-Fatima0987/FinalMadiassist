import React, { useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { UserContext } from "../../store/context/UserContext";

import EditableField from "../../Components/EditProfileComponent/EidtableField";
import SaveButton from "../../Components/EditProfileComponent/SaveButton";

export default function EditableProfileScreen({ navigation }) {
  const { user, updateUser } = useContext(UserContext);
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (key, value) => {
    setEditedUser({ ...editedUser, [key]: value });
  };

  const handleSave = () => {
    Object.entries(editedUser).forEach(([key, value]) => {
      updateUser(key, value);
    });

    Alert.alert("Success", "Profile updated successfully!");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {Object.entries(editedUser).map(([key, value]) => {
        if (key === "password") return null;

        return (
          <EditableField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value?.toString() || ""}
            onChange={(text) => handleChange(key, text)}
          />
        );
      })}

      <SaveButton onPress={handleSave} />
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
