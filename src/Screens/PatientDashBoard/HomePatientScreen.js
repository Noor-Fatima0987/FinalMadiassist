import React, { useContext, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../store/context/UserContext";
import AppointmentCard from "../../Components/PatientComponent/AppointmentCard";
import QuickActionButton from "../../Components/PatientComponent/QuickActionButton";
import MedicationCard from "../../Components/PatientComponent/MedicationCard";

const HomePatientScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [dbAppointments, setDbAppointments] = useState([]);
  const [dbPrescriptions, setDbPrescriptions] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const BACKEND_URL = "https://mediassist-rho.vercel.app";

  // Fetch appointments, prescriptions, and doctors from database
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const appRes = await fetch(`${BACKEND_URL}/api/appointments/${user.id}`);
        if (appRes.ok) setDbAppointments(await appRes.json());

        const presRes = await fetch(`${BACKEND_URL}/api/prescriptions/patient/${user.id}`);
        if (presRes.ok) setDbPrescriptions(await presRes.json());

        const docRes = await fetch(`${BACKEND_URL}/api/doctors`);
        if (docRes.ok) setAllDoctors(await docRes.json());
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    
    // Fetch when screen comes into focus using navigation listener
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    fetchData();
    return unsubscribe;
  }, [navigation, user.id]);

  // Extract medications from patient's prescriptions
  const dailyMedications = useMemo(() => {
    return dbPrescriptions.flatMap(prescription => prescription.medications || []);
  }, [dbPrescriptions]);

  // Sort appointments by date
  const sortedAppointments = useMemo(() => {
    return [...dbAppointments].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [dbAppointments]);

  // Find the next upcoming appointment (including today)
  const today = new Date().toISOString().split("T")[0];
  const upcomingAppointment = sortedAppointments.find(
    (app) => app.date >= today && app.status !== "Completed" && app.status !== "Cancelled"
  );

  // Search filter logic
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allDoctors.filter(doc => 
      doc.fullName?.toLowerCase().includes(q) || 
      (doc.doctorProfile?.specialty || "").toLowerCase().includes(q)
    );
  }, [searchQuery, allDoctors]);

  const filteredMedications = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return dailyMedications.filter(med => 
      med.name?.toLowerCase().includes(q)
    );
  }, [searchQuery, dailyMedications]);

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
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.trim().length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </Pressable>
          )}
        </View>

        {/* --- Search Results or Normal Content --- */}
        {searchQuery.trim() !== "" ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            
            {/* Doctors Section */}
            {filteredDoctors.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.searchSubTitle}>Doctors</Text>
                {filteredDoctors.map((doc) => (
                  <View key={doc.id} style={styles.searchCard}>
                    <View style={styles.avatarMini}>
                      <Ionicons name="medical" size={20} color="#180991" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.searchDocName}>{doc.fullName}</Text>
                      <Text style={styles.searchDocSpec}>{doc.doctorProfile?.specialty || "General"}</Text>
                      {doc.doctorProfile?.experience && (
                        <Text style={styles.searchDocExp}>{doc.doctorProfile.experience} Years Exp</Text>
                      )}
                    </View>
                    <Pressable 
                      style={styles.bookActionBtn}
                      onPress={() => {
                        setSearchQuery("");
                        navigation.navigate("Book Appointment", { 
                          doctor: { 
                            ...doc, 
                            specialization: doc.doctorProfile?.specialty || "General" 
                          } 
                        });
                      }}
                    >
                      <Text style={styles.bookActionBtnText}>Book</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            {/* Medicines Section */}
            {filteredMedications.length > 0 && (
              <View style={{ marginBottom: 20 }}>
                <Text style={styles.searchSubTitle}>Daily Medicines</Text>
                {filteredMedications.map((med, index) => (
                  <View key={index} style={styles.searchCard}>
                    <View style={styles.avatarMiniMedicine}>
                      <Ionicons name="medkit" size={20} color="#00796B" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.searchDocName}>{med.name}</Text>
                      <Text style={styles.searchDocSpec}>{med.dosage}</Text>
                      <Text style={styles.searchDocExp}>{med.instructions}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {filteredDoctors.length === 0 && filteredMedications.length === 0 && (
              <View style={styles.searchEmptyCard}>
                <Ionicons name="search-outline" size={40} color="#999" />
                <Text style={styles.searchEmptyText}>No matches found for "{searchQuery}"</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* --- Next Appointment Section --- */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Up Next</Text>
            </View>

            {upcomingAppointment ? (
              <AppointmentCard
                title="Upcoming Appointment"
                doctor={upcomingAppointment.doctor?.fullName || "Unknown"}
                date={upcomingAppointment.date}
                time={upcomingAppointment.time}
                status={upcomingAppointment.status}
              />
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No upcoming appointments.</Text>
                <Pressable onPress={() => navigation.navigate("Book Appointment")}>
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
              <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 4 }}>
                No medications scheduled for today.
              </Text>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePatientScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
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
  // Search Result Custom Styles
  searchResultsContainer: {
    marginTop: 5,
  },
  searchSubTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(24, 9, 145, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarMiniMedicine: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 121, 107, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchDocName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  searchDocSpec: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  searchDocExp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  bookActionBtn: {
    backgroundColor: "#180991",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  bookActionBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  searchEmptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchEmptyText: {
    color: "#999",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
  },
});
