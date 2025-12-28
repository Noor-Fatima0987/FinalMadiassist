// import React, { useState } from "react";
// import { ScrollView, Alert } from "react-native";
// import * as Notifications from "expo-notifications";

// import Header from "../../Components/";
import SelectDoctor from "../../Components/PatientComponent/SelectDoctor";
import DoctorSummaryCard from "../../Components/PatientComponent/DoctorSummaryCard";
import SelectDate from "../../Components/PatientComponent/SelectDate";
import SelectTime from "../../Components/PatientComponent/SelectTime";
import ContactDetails from "../../Components/PatientComponent/ContactDetails";
import ConfirmButton from "../../Components/PatientComponent/ConfirmButton";

// import { doctorData } from "../../Data/DoctorData";

// const BookAppointmentScreen = ({ navigation }) => {
//   const [doctor, setDoctor] = useState(null);
//   const [date, setDate] = useState(null);
//   const [time, setTime] = useState(null);
//   const [contact, setContact] = useState("");

//   const isDisabled = !doctor || !date || !time || !contact;

//   const handleConfirm = () => {
//     Alert.alert("Appointment Confirmed");
//   };

// //   const handleConfirm = async () => {
// //   await Notifications.scheduleNotificationAsync({
// //     content: {
// //       title: "Appointment Confirmed",
// //       body: "Your appointment has been successfully booked.",
// //     },
// //     trigger: null,
// //   });
// // };

//   return (
//     <ScrollView style={{ padding: 16 }}>
//       {/* <Header onBack={() => navigation.goBack()} /> */}

//       <SelectDoctor onPress={() => setDoctor(doctorData[0])} />

//       <DoctorSummaryCard doctor={doctor} />

//       <SelectDate selectedDate={date} onSelect={setDate} />

//       <SelectTime selectedTime={time} onSelect={setTime} />

//       <ContactDetails value={contact} onChange={setContact} />

//       <ConfirmButton disabled={isDisabled} onPress={handleConfirm} />
//     </ScrollView>
//   );
// };

// export default BookAppointmentScreen;




import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
// import * as Notifications from "expo-notifications";

// import Header from "./components/Header";
// import SelectDoctor from "./components/SelectDoctor";
// import DoctorSummaryCard from "./components/DoctorSummaryCard";
// import SelectDate from "./components/SelectDate";
// import SelectTime from "./components/SelectTime";
// import ContactDetails from "./components/ContactDetails";
// import ConfirmButton from "./components/ConfirmButton";

const BookAppointmentScreen = ({ navigation }) => {
  // ---------------- STATES ----------------
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [contact, setContact] = useState("");

  // ---------------- ROUTE ----------------
  const route = useRoute();

  // ---------------- GET SELECTED DOCTOR ----------------
  useEffect(() => {
    if (route.params?.doctor) {
      setDoctor(route.params.doctor);
    }
  }, [route.params]);

  // ---------------- CONFIRM LOGIC ----------------
  // const handleConfirm = async () => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: "Appointment Confirmed",
  //       body: `Your appointment with ${doctor.name} on ${date} at ${time} is confirmed.`,
  //     },
  //     trigger: null,
  //   });

  //   // Optional: navigate back or reset
  //   navigation.goBack();
  // };

    const handleConfirm = () => {
    Alert.alert("Appointment Confirmed");
  };


  const isDisabled = !doctor || !date || !time || !contact;

  // ---------------- UI ----------------
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Header */}
      {/* <Header onBack={() => navigation.goBack()} /> */}

      {/* Select Doctor (HIDE AFTER SELECTION) */}
      {!doctor && (
        <SelectDoctor
          onPress={() => navigation.navigate("DoctorList")}
        />
      )}

      {/* Selected Doctor Summary */}
      <DoctorSummaryCard doctor={doctor} />

      {/* Select Date (Calendar) */}
      {doctor && (
        <SelectDate
          selectedDate={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setTime(null); // reset time if date changes
          }}
        />
      )}

      {/* Select Time (Hide others after select) */}
      {date && (
        <SelectTime
          selectedTime={time}
          onSelect={(selectedTime) => setTime(selectedTime)}
        />
      )}

      {/* Contact Details */}
      {time && (
        <ContactDetails
          value={contact}
          onChange={setContact}
        />
      )}

      {/* Confirm Button */}
      <ConfirmButton
        disabled={isDisabled}
        onPress={handleConfirm}
      />
    </ScrollView>
  );
};

export default BookAppointmentScreen;
