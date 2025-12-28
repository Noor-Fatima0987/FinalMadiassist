// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import WelcomeText from '../../Components/home/WelcomeText';

// function HomePatientScreen  ()  {
//   return (
//     <View style={{flex:1}}>
//       <WelcomeText/>
//     </View>
//   )
// }

// export default HomePatientScreen;

// const styles = StyleSheet.create({});



// HomeScreen.js
import React from "react";
import WelcomeText from '../../Components/home/WelcomeText';
import { View, Text, ScrollView } from "react-native";
import { appointments, medications } from "../../Data/AppointmentData";
import Heading from "../../Components/PatientComponent/Herder";
import AppointmentCard from "../../Components/PatientComponent/AppointmentCard";
import MedicationCard from "../../Components/PatientComponent/MedicationCard";
// import QuickActionButton from "./QuickActionButton";

// import { Heading, AppointmentCard, MedicationCard, QuickActionButton } from "./components";

const HomeScreen = () => {
  const today = "2025-12-25";

  const todayAppointment = appointments.find(a => a.date === today);
  const nextAppointment = appointments.find(a => a.date > today);
  const lastAppointment = [...appointments].reverse().find(a => a.date < today);

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f7f7f7" }}>
       <WelcomeText/>
      {/* Heading */}
      <Heading title="Today’s Schedule" />

      {/* Appointment Section */}
      <View style={{ marginBottom: 24 }}>
        {todayAppointment ? (
          <AppointmentCard
            title="Today’s Appointment"
            doctor={todayAppointment.doctor}
            date={todayAppointment.date}
            time={todayAppointment.time}
            status={todayAppointment.status}
          />
        ) : nextAppointment ? (
          <AppointmentCard
            title="Next Appointment"
            doctor={nextAppointment.doctor}
            date={nextAppointment.date}
            time={nextAppointment.time}
          />
        ) : lastAppointment ? (
          <AppointmentCard
            title="Last Appointment"
            doctor={lastAppointment.doctor}
            date={lastAppointment.date}
          />
        ) : (
          <Text>No appointments found</Text>
        )}
      </View>

      {/* Medication Section */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>Medication / Dose</Text>
        {medications.length > 0 ? (
          medications.map((m, index) => (
            <MedicationCard key={index} time={m.time} dose={m.dose} />
          ))
        ) : (
          <Text>No scheduled medication for today</Text>
        )}
      </View>

      {/* Quick Actions */}
      {/* <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>Quick Actions</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <QuickActionButton icon="📅" text="Book Appointment" onPress={() => {}} />
          <QuickActionButton icon="📄" text="View Appointment History" onPress={() => {}} />
          <QuickActionButton icon="🔔" text="View Reminders" onPress={() => {}} />
        </View>
      </View> */}
    </ScrollView>
  );
};

export default HomeScreen;
