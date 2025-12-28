import React from "react";
import { View, Text, Pressable } from "react-native";

const SelectDate = ({ selectedDate, onSelect }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
        Select Date
      </Text>

      <Pressable
        onPress={() => onSelect("2025-12-27")}
        style={({ pressed }) => ({
          padding: 12,
          borderRadius: 8,
          backgroundColor: pressed ? "#ddd" : "#eee",
        })}
      >
        <Text>{selectedDate || "Choose Date"}</Text>
      </Pressable>
    </View>
  );
};

export default SelectDate;



// import { Calendar } from "react-native-calendars";

// const SelectDate = ({ onSelect }) => {
//   return (
//     <Calendar
//       onDayPress={(day) => onSelect(day.dateString)}
//       markedDates={{
//         [new Date().toISOString().split("T")[0]]: { selected: true },
//       }}
//     />
//   );
// };

