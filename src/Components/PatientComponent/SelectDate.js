import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, Modal, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { getLocalDateString, getMonthMarkedDates } from "../../utils/doctorAvailability";

const SelectDate = ({ selectedDate, onSelect, allowedDays = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const baseDate = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
    return {
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
    };
  });

  const today = getLocalDateString();

  useEffect(() => {
    if (!selectedDate) return;
    const baseDate = new Date(`${selectedDate}T12:00:00`);
    if (Number.isNaN(baseDate.getTime())) return;
    setVisibleMonth({
      year: baseDate.getFullYear(),
      month: baseDate.getMonth() + 1,
    });
  }, [selectedDate]);

  const markedDates = useMemo(
    () => getMonthMarkedDates(visibleMonth.year, visibleMonth.month, allowedDays, selectedDate),
    [visibleMonth, allowedDays, selectedDate]
  );

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
              current={`${visibleMonth.year}-${String(visibleMonth.month).padStart(2, "0")}-01`}
              onMonthChange={(monthInfo) => setVisibleMonth({ year: monthInfo.year, month: monthInfo.month })}
              markedDates={markedDates}
              disableAllTouchEventsForDisabledDays
              onDayPress={(day) => {
                if (allowedDays.length > 0) {
                  const selectedDay = new Date(`${day.dateString}T12:00:00`).getDay();
                  if (!allowedDays.includes(selectedDay)) {
                    Alert.alert(
                      "Unavailable Date",
                      "This doctor is not available on the selected day."
                    );
                    return;
                  }
                }
                onSelect(day.dateString);
                setModalVisible(false);
              }}
              minDate={today}
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
