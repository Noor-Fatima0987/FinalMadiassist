import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Platform, Alert, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { generateTimeSlots, isTimeAllowed } from "../../utils/doctorAvailability";

const SelectTime = ({
  selectedTime,
  onSelect,
  workingHoursStart,
  workingHoursEnd,
  slotInterval = 30,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const generatedSlots = useMemo(() => {
    return generateTimeSlots(workingHoursStart, workingHoursEnd, slotInterval);
  }, [workingHoursStart, workingHoursEnd, slotInterval]);

  const useSlotList = generatedSlots.length > 0;

  const onTimeChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "set" && selectedDate) {
      setTempDate(selectedDate);

      let hours = selectedDate.getHours();
      let minutes = selectedDate.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const strTime = hours + ":" + minutes + " " + ampm;

      if (!isTimeAllowed(strTime, workingHoursStart, workingHoursEnd)) {
        Alert.alert("Unavailable Time", "This doctor is not available at the selected time.");
        return;
      }

      onSelect(strTime);

      if (Platform.OS === "ios") {
        setShowPicker(false);
      }
    } else {
      setShowPicker(false);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8, color: "#180991" }}>Select Time</Text>

      {useSlotList ? (
        <View style={styles.slotGrid}>
          {generatedSlots.map((slot) => {
            const isSelected = selectedTime === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => onSelect(slot)}
                style={({ pressed }) => [
                  styles.slotButton,
                  isSelected && styles.slotButtonActive,
                  pressed && !isSelected && styles.slotButtonPressed,
                ]}
              >
                <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                  {slot}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <>
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
        </>
      )}
    </View>
  );
};

export default SelectTime;

const styles = StyleSheet.create({
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotButton: {
    minWidth: 88,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9d9ea",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  slotButtonActive: {
    backgroundColor: "#180991",
    borderColor: "#180991",
  },
  slotButtonPressed: {
    opacity: 0.7,
  },
  slotText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  slotTextActive: {
    color: "#fff",
  },
});
