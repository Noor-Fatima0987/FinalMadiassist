import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Modal, View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import SelectDoctor from "../../Components/PatientComponent/SelectDoctor";
import DoctorSummaryCard from "../../Components/PatientComponent/DoctorSummaryCard";
import SelectDate from "../../Components/PatientComponent/SelectDate";
import SelectTime from "../../Components/PatientComponent/SelectTime";
import ContactDetails from "../../Components/PatientComponent/ContactDetails";
import ConfirmButton from "../../Components/PatientComponent/ConfirmButton";
import { doctorData } from "../../Data/DoctorData";
import { UserContext } from "../../store/context/UserContext";

const BookAppointmentScreen = ({ navigation }) => {
  // ---------------- CONTEXT ----------------
  const { user, doctors, addAppointment } = useContext(UserContext);

  // ---------------- STATES ----------------
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [contact, setContact] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // ---------------- ROUTE ----------------
  const route = useRoute();

  // ---------------- GET SELECTED DOCTOR ----------------
  useEffect(() => {
    if (route.params?.doctor) {
      setDoctor(route.params.doctor);
    }
  }, [route.params]);

  // ---------------- CONFIRM LOGIC ----------------
  const handleConfirm = () => {
    const newAppointment = {
      id: Date.now().toString(),
      patientName: user.fullName || "Test Patient",
      patientAge: user.age || "N/A",
      patientContact: contact,
      doctorName: doctor.fullName,
      doctorSpecialization: doctor.specialization,
      date: date,
      time: time,
      status: "Confirmed"
    };

    addAppointment(newAppointment);

    Alert.alert(
      "Appointment Confirmed",
      `Your appointment with ${doctor.fullName} on ${date} at ${time} is confirmed. Details have been sent to the doctor.`
    );

    // Optional: navigation.goBack();
  };

  const isDisabled = !doctor || !date || !time || !contact;

  // ---------------- UI ----------------
  return (
    <ScrollView style={{ flex: 1 }}>

      <View style={styles.headerPadding}>
        <Text style={styles.title}>Book Appointment</Text>
        {/* <Text style={styles.subtitle}>List of all your consultations</Text> */}
      </View>

      <View style={{ padding: 20 }}>

        {/* Select Doctor */}
        <SelectDoctor
          selectedDoctor={doctor}
          onPress={() => setModalVisible(true)}
        />

        {/* Doctor Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 16, maxHeight: "70%" }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>Select Doctor</Text>
              <FlatList
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setDoctor(item);
                      setModalVisible(false);
                    }}
                    style={{ padding: 12, borderBottomWidth: 1, borderColor: "#ddd" }}
                  >
                    <Text style={{ fontWeight: "bold" }}>{item.fullName}</Text>
                    <Text>{item.specialization}</Text>
                  </Pressable>
                )}
              />
              <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 16, alignItems: "center" }}>
                <Text style={{ color: "red" }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Selected Doctor Summary */}
        <DoctorSummaryCard doctor={doctor} />

        {/* Select Date (Calendar) */}
        <SelectDate
          selectedDate={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            // setTime(null); // Optional: Keep time or reset? Removing reset to allow any order selection.
          }}
        />

        {/* Select Time */}
        <SelectTime
          selectedTime={time}
          onSelect={(selectedTime) => setTime(selectedTime)}
        />

        {/* Contact Details */}
        <ContactDetails
          value={contact}
          onChange={setContact}
        />

        {/* Confirm Button */}
        <ConfirmButton
          disabled={isDisabled}
          onPress={handleConfirm}
        />

      </View>
    </ScrollView>
  );
};

export default BookAppointmentScreen;

const styles = StyleSheet.create({
  headerPadding: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#180991',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

})

