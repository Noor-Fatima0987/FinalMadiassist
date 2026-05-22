import React, { useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const SelectTime = ({ selectedTime, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const onTimeChange = (event, selectedDate) => {
    // Android par onChange fire hone ke baad foran picker hide karna zaroori hai
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setTempDate(selectedDate);

      // Format time to string (e.g., "09:30 AM")
      let hours = selectedDate.getHours();
      let minutes = selectedDate.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;

      onSelect(strTime);
      
      // iOS ke liye hide
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else {
      // User ne cancel kar diya
      setShowPicker(false);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8, color: "#180991" }}>Select Time</Text>

      <Pressable
        onPress={() => setShowPicker(true)}
        style={({ pressed }) => ({
          padding: 12,
          borderRadius: 8,
          backgroundColor: pressed ? "#ddd" : "#eee",
        })}
      >
        <Text>{selectedTime || "Choose Time"}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
};

export default SelectTime;
