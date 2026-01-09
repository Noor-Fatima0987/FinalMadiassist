import React, { useState } from "react";
import { View, Text, Pressable, Platform, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const SelectTime = ({ selectedTime, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const onTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      // On Android, the picker closes itself or has its own confirm.
      // On iOS, we usually want a manual confirm button in a modal.
    }
  };

  const handleConfirm = () => {
    // Format time to string (e.g., "09:30 AM")
    let hours = tempDate.getHours();
    let minutes = tempDate.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;

    onSelect(strTime);
    setModalVisible(false);
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8  , color:"#180991ff" }}>Select Time</Text>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => ({
          padding: 12,
          borderRadius: 8,
          backgroundColor: pressed ? "#ddd" : "#eee",
        })}
      >
        <Text>{selectedTime || "Choose Time (from Picker)"}</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center" }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Select Appointment Time</Text>

            <DateTimePicker
              value={tempDate}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onTimeChange}
              style={{ width: "100%" }}
            />

            <View style={{ flexDirection: "row", marginTop: 16, width: "100%", justifyContent: "space-around" }}>
              <Pressable onPress={() => setModalVisible(false)} style={{ padding: 10 }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>Cancel</Text>
              </Pressable>

              <Pressable onPress={handleConfirm} style={{ padding: 10, backgroundColor: "#4caf50", borderRadius: 8, minWidth: 100, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirm</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectTime;
