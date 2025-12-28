// import React from "react";
// import { View, Text, Pressable } from "react-native";

// const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM"];

// const SelectTime = ({ selectedTime, onSelect }) => {
//   return (
//     <View style={{ marginBottom: 16 }}>
//       <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
//         Select Time
//       </Text>

//       {timeSlots.map(time => (
//         <Pressable
//           key={time}
//           onPress={() => onSelect(time)}
//           style={({ pressed }) => ({
//             padding: 10,
//             marginBottom: 6,
//             borderRadius: 6,
//             backgroundColor:
//               selectedTime === time
//                 ? "#c8e6c9"
//                 : pressed
//                 ? "#ddd"
//                 : "#eee",
//           })}
//         >
//           <Text>{time}</Text>
//         </Pressable>
//       ))}
//     </View>
//   );
// };

// export default SelectTime;



const SelectTime = ({ selectedTime, onSelect }) => {
  const times = ["09:00 AM", "10:00 AM", "11:00 AM"];

  if (selectedTime) {
    return (
      <View style={{ padding: 12, backgroundColor: "#c8e6c9" }}>
        <Text>Selected Time: {selectedTime}</Text>
      </View>
    );
  }

  return (
    <>
      {times.map((time) => (
        <Pressable
          key={time}
          onPress={() => onSelect(time)}
          style={{ padding: 10, backgroundColor: "#eee", marginBottom: 6 }}
        >
          <Text>{time}</Text>
        </Pressable>
      ))}
    </>
  );
};
