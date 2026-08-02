import React, { useMemo, useState } from "react";
import { View, Text, Pressable, Platform, Alert, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { generateTimeSlots, isTimeAllowed } from "../../utils/doctorAvailability";
import { useTheme } from "@shopify/restyle";
import { useThemeMode } from "../../theme";

const SelectTime = ({
  selectedTime,
  onSelect,
  workingHoursStart,
  workingHoursEnd,
  slotInterval = 30,
}) => {
  const { colors } = useTheme();
  const { resolvedMode } = useThemeMode();
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
      <Text style={{ fontWeight: "bold", marginBottom: 8, color: colors.primary }}>Select Time</Text>

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
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  },
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
              backgroundColor: pressed ? colors.surfaceBackground : colors.cardBackground,
              borderWidth: 1,
              borderColor: colors.border,
            })}
          >
            <Text style={{ color: colors.mainText }}>{selectedTime || "Choose Time"}</Text>
          </Pressable>

          {showPicker && (
            <DateTimePicker
              value={tempDate}
              mode="time"
              is24Hour={false}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              themeVariant={Platform.OS === "ios" ? resolvedMode : undefined}
              textColor={Platform.OS === "ios" ? colors.mainText : undefined}
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
    alignItems: "center",
  },
  slotButtonActive: {
  },
  slotButtonPressed: {
    opacity: 0.7,
  },
  slotText: {
    fontWeight: "600",
    fontSize: 13,
  },
  slotTextActive: {},
});
