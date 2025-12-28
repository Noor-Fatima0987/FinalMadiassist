// import React from "react";
// import { View, Text } from "react-native";

// const DoctorSummaryCard = ({ doctor }) => {
//   if (!doctor) return null;

//   return (
//     <View style={{ padding: 12, borderRadius: 8, backgroundColor: "#e0f7fa" }}>
//       <Text style={{ fontWeight: "bold" }}>{doctor.name}</Text>
//       <Text>{doctor.specialization}</Text>
//       <Text>{doctor.availableTime}</Text>
//     </View>
//   );
// };

// export default DoctorSummaryCard;


import React from "react";
import { FlatList, Text, Pressable, View } from "react-native";
import { doctorData } from "../../Data/DoctorData";

const DoctorListScreen = ({ navigation }) => {
  return (
    <FlatList
      data={doctorData}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => navigation.navigate("BookAppointment", { doctor: item })}
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
          <Text>{item.specialization}</Text>
        </Pressable>
      )}
    />
  );
};

export default DoctorListScreen;
