import React, { useContext } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { UserContext } from "../../store/context/UserContext";
import ProfileField from "../../Components/ProfileComponent/ProfileField";
import EditButton from "../../Components/ProfileComponent/EditButton";
import { moderateScale } from "../../utils/responsive";

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext);

  return (
    <ScrollView style={styles.container}>
      
      {Object.entries(user).map(([key, value]) => {
        if (!value) return null;
        if (key === "password") return null;

        return (
          <ProfileField
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={value}
          />
        );
      })}

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
