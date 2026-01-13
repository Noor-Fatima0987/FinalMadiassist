import React, { useState } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Calendar } from "react-native-calendars";

const SelectDate = ({ selectedDate, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 , color:"#180991ff"  }}>
        Select Date
      </Text>

      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => ({
          padding: 12,
          borderRadius: 8,
          backgroundColor: pressed ? "#ddd" : "#eee",
        })}
      >
        <Text>{selectedDate || "Choose Date (from Calendar)"}</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12, textAlign: "center" }}>Select Appointment Date</Text>

            <Calendar
              onDayPress={(day) => {
                onSelect(day.dateString);
                setModalVisible(false);
              }}
              minDate={today}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#4caf50" },
                [today]: { marked: true, dotColor: "#4caf50" }
              }}
              theme={{
                selectedDayBackgroundColor: "#4caf50",
                todayTextColor: "#4caf50",
                arrowColor: "#4caf50",
              }}
            />

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 16, alignItems: "center", padding: 10 }}
            >
              <Text style={{ color: "red", fontWeight: "bold" }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectDate;

