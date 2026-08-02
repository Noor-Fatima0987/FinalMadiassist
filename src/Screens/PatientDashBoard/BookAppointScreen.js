import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Modal, View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import SelectDoctor from "../../Components/PatientComponent/SelectDoctor";
import DoctorSummaryCard from "../../Components/PatientComponent/DoctorSummaryCard";
import SelectDate from "../../Components/PatientComponent/SelectDate";
import SelectTime from "../../Components/PatientComponent/SelectTime";
import ContactDetails from "../../Components/PatientComponent/ContactDetails";
import ConfirmButton from "../../Components/PatientComponent/ConfirmButton";
import { UserContext } from "../../store/context/UserContext";
import { useTheme } from "@shopify/restyle";
import {
  buildAvailabilityLabel,
  isDateAllowed,
  isTimeAllowed,
  parseLegacyAvailabilityLabel,
  parseWorkingDays,
} from "../../utils/doctorAvailability";

const normalizeDoctorForBooking = (doc) => {
  if (!doc) return null;

  const doctorProfile = doc.doctorProfile || {};
  const legacyAvailability = parseLegacyAvailabilityLabel(
    doc.availableTime || doctorProfile.availableTime || ""
  );

  const workingDays = parseWorkingDays(
    doctorProfile.workingDays?.length ? doctorProfile.workingDays : legacyAvailability.workingDays || doc.workingDays || []
  );
  const workingHoursStart = doctorProfile.workingHoursStart || legacyAvailability.workingHoursStart || doc.workingHoursStart || null;
  const workingHoursEnd = doctorProfile.workingHoursEnd || legacyAvailability.workingHoursEnd || doc.workingHoursEnd || null;

  const availabilityLabel = buildAvailabilityLabel(workingDays, workingHoursStart, workingHoursEnd);

  return {
    ...doc,
    fullName: doc.fullName || doc.name || "Doctor",
    specialization: doc.specialization || doctorProfile.specialty || "General",
    workingDays,
    workingHoursStart,
    workingHoursEnd,
    availabilityLabel,
    availableTime: doc.availableTime || availabilityLabel,
  };
};

const BookAppointmentScreen = ({ navigation }) => {
  const { colors } = useTheme();
  // ---------------- CONTEXT ----------------
  const { user } = useContext(UserContext); // Removed addAppointment and doctors from Context

  // ---------------- STATES ----------------
  const [dbDoctors, setDbDoctors] = useState([]); // Doctors from PostgreSQL
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [contact, setContact] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const BACKEND_URL = "https://mediassist-rho.vercel.app";

  const [isLoading, setIsLoading] = useState(false);

  // ---------------- GET DOCTORS FROM DB ----------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/doctors`);
        const data = await response.json();
        if (response.ok) {
          // Format data to match what the screen expects
          const formattedDoctors = data.map((doc) => normalizeDoctorForBooking(doc));
          setDbDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // ---------------- ROUTE ----------------
  const route = useRoute();

  // ---------------- RESET ON FOCUS & GET SELECTED DOCTOR ----------------
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setDoctor(normalizeDoctorForBooking(route.params?.doctor || null));
      setDate(null);
      setTime(null);
      setContact("");
    });

    return unsubscribe;
  }, [navigation, route.params]);

  // ---------------- CONFIRM LOGIC ----------------
  const handleConfirm = async () => {
    if (isLoading) return; // Prevent double booking
    if (!user?.id) {
      Alert.alert("Error", "Please log in again before booking an appointment.");
      return;
    }

    if (!doctor) {
      Alert.alert("Error", "Please select a doctor.");
      return;
    }

    if (!isDateAllowed(date, doctor.workingDays || [])) {
      Alert.alert("Unavailable Date", "Please pick a date that matches the doctor's working days.");
      return;
    }

    if (!isTimeAllowed(time, doctor.workingHoursStart, doctor.workingHoursEnd)) {
      Alert.alert("Unavailable Time", "Please pick a time within the doctor's working hours.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: user.id,
          doctorId: doctor.id,
          date: date,
          time: time,
          notes: contact
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Appointment Confirmed",
          `Your appointment with ${doctor.fullName} on ${date} at ${time} is confirmed.`,
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to book appointment.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server se connect nahi ho saka.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDateValid = doctor ? isDateAllowed(date, doctor.workingDays || []) : false;
  const isTimeValid = doctor ? isTimeAllowed(time, doctor.workingHoursStart, doctor.workingHoursEnd) : false;
  const isDisabled = !doctor || !date || !time || !contact || !isDateValid || !isTimeValid || isLoading;

  // ---------------- UI ----------------
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.mainBackground }}>

      <View style={[styles.headerPadding, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Book Appointment</Text>
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
            <View style={{ width: "90%", backgroundColor: colors.cardBackground, borderRadius: 12, padding: 16, maxHeight: "70%", borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12, color: colors.mainText }}>Select Doctor</Text>
              <FlatList
                data={dbDoctors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      setDoctor(normalizeDoctorForBooking(item));
                      setDate(null);
                      setTime(null);
                      setModalVisible(false);
                    }}
                    style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }}
                  >
                    <Text style={{ fontWeight: "bold", color: colors.mainText }}>{item.fullName || item.name}</Text>
                    <Text style={{ color: colors.secondaryText }}>{item.specialization}</Text>
                    <Text style={{ color: colors.secondaryText, marginTop: 2 }}>
                      {item.availabilityLabel || item.availableTime || "Availability not set"}
                    </Text>
                  </Pressable>
                )}
              />
              <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 16, alignItems: "center" }}>
                <Text style={{ color: colors.danger }}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Selected Doctor Summary */}
        <DoctorSummaryCard doctor={doctor} />

        {/* Select Date (Calendar) */}
        <SelectDate
          selectedDate={date}
          allowedDays={doctor?.workingDays || []}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            // setTime(null); // Optional: Keep time or reset? Removing reset to allow any order selection.
          }}
        />

        {/* Select Time */}
        <SelectTime
          selectedTime={time}
          workingHoursStart={doctor?.workingHoursStart}
          workingHoursEnd={doctor?.workingHoursEnd}
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
