import React from "react";
import { View, Text, Pressable } from "react-native";

const SelectDoctor = ({ onPress, selectedDoctor }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8, color:"#180991ff" }}>
        Select Doctor
      </Text>

      <Pressable
        onPress={onPress}
        style={{
          padding: 12,
          borderRadius: 8,
          backgroundColor: "#eee",
        }}
      >
        <Text>{selectedDoctor ? selectedDoctor.name : "Select Doctor"}</Text>
      </Pressable>
    </View>
  );
};

export default SelectDoctor;
