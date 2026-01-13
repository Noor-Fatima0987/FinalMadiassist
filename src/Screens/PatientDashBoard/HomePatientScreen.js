import React, { useContext, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../store/context/UserContext";
import AppointmentCard from "../../Components/PatientComponent/AppointmentCard";
import QuickActionButton from "../../Components/PatientComponent/QuickActionButton";
import MedicationCard from "../../Components/PatientComponent/MedicationCard";

const HomePatientScreen = ({ navigation }) => {
  const { user, appointments, prescriptions } = useContext(UserContext);

  // Extract medications from patient's prescriptions
  const dailyMedications = prescriptions
    .filter(prescription => prescription.patientName === user.fullName)
    .flatMap(prescription => prescription.medications);

  // --- Logic for Upcoming Appointment ---
  const today = new Date().toISOString().split("T")[0];

  // Sort appointments by date
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments]);

  // Find the next upcoming appointment (including today)
  const upcomingAppointment = sortedAppointments.find(
    (app) => app.date >= today && app.status !== "Completed"
  );


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* --- Header --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Day,</Text>
            <Text style={styles.userName}>{user.fullName || "Patient"}</Text>
          </View>
          <View style={styles.profileBadge}>
            <Ionicons name="person" size={24} color="#180991" />
          </View>
        </View>

        {/* --- Search Bar --- */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search doctors, medicines..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>


        {/* --- Next Appointment Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Up Next</Text>
          {/* <Text style={styles.viewAll}>See All</Text> */}
        </View>

        {upcomingAppointment ? (
          <AppointmentCard
            title="Upcoming Appointment"
            doctor={upcomingAppointment.doctorName}
            date={upcomingAppointment.date}
            time={upcomingAppointment.time}
            status={upcomingAppointment.status}
          />
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming appointments.</Text>
            <Pressable onPress={() => navigation.navigate("BookAppointment")}>
              <Text style={styles.bookNowText}>Book Now</Text>
            </Pressable>
          </View>
        )}


        {/* --- Quick Actions --- */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionButton
            icon="calendar"
            text="Book Appointment"
            onPress={() => navigation.navigate("Book Appointment")}
          />
          <QuickActionButton
            icon="document-text"
            text="History"
            onPress={() => navigation.navigate("Appointment Detial")}
          />
          <QuickActionButton
            icon="medkit"
            text="Prescription"
            onPress={() => navigation.navigate("Prescription")}
          />
          <QuickActionButton
            icon="person"
            text="Profile"
            onPress={() => navigation.navigate("Profile")}
          />
        </View>


        {/* --- Today's Medication --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Medications</Text>
        </View>

        {dailyMedications && dailyMedications.length > 0 ? (
          dailyMedications.map((m, index) => (
            <MedicationCard key={index} time={m.times[0]} dose={m.dosage + " - " + m.name} />
          ))
        ) : (
          <Text style={{ color: '#999', fontStyle: 'italic' }}>No medications scheduled for today.</Text>
        )}


      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE", // Light calming background
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#180991",
  },
  profileBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#180991",
    marginBottom: 15,
  },
  viewAll: {
    color: "#180991",
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
    borderStyle: 'dashed'
  },
  emptyText: {
    color: "#999",
    marginBottom: 10,
  },
  bookNowText: {
    color: "#180991",
    fontWeight: "bold",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default HomePatientScreen;
