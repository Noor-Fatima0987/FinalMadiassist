import React, { useContext, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Pressable, Modal, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

const PatientsList = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [dbAppointments, setDbAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [isLoadingPrescriptions, setIsLoadingPrescriptions] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/appointments/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          if (Array.isArray(data)) {
            setDbAppointments(data);
          } else {
            setDbAppointments([]);
          }
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAppointments();
    });
    
    fetchAppointments();

    return unsubscribe;
  }, [navigation, user.id]);

  const doctorPatients = useMemo(() => {
    const patientsMap = new Map();

    dbAppointments.forEach(appointment => {
        const patientName = appointment.patient?.fullName || "Unknown Patient";
        const patientId = appointment.patientId;
        const disease = appointment.status === "Pending" ? "Checkup" : "Follow-up"; // Basic mock of disease/problem

        if (!patientsMap.has(patientId)) {
          patientsMap.set(patientId, {
            id: patientId,
            name: patientName,
            age: appointment.patient?.age || "N/A",
            contact: appointment.patient?.contactNumber || "N/A",
            disease: disease,
            lastAppointment: appointment.date,
            appointmentCount: 1
          });
        } else {
          const patient = patientsMap.get(patientId);
          patient.appointmentCount += 1;
          if (new Date(appointment.date) > new Date(patient.lastAppointment)) {
            patient.lastAppointment = appointment.date;
          }
        }
      });

    return Array.from(patientsMap.values());
  }, [dbAppointments]);

  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openPatientDetails = async (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
    setIsLoadingPrescriptions(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/prescriptions/patient/${patient.id}`);
      const data = await response.json();
      if (response.ok) {
        setPatientPrescriptions(data);
      }
    } catch (error) {
      console.error("Error fetching patient prescriptions:", error);
    } finally {
      setIsLoadingPrescriptions(false);
    }
  };

  const deletePrescription = async (prescriptionId) => {
    Alert.alert(
      "Delete Prescription",
      "Are you sure you want to delete this prescription? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/prescriptions/${prescriptionId}`, {
                method: "DELETE"
              });
              if (response.ok) {
                setPatientPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
              }
            } catch (error) {
              console.error("Error deleting prescription:", error);
            }
          }
        }
      ]
    );
  };

  const renderPatientCard = ({ item }) => (
    <Pressable style={styles.patientCard} onPress={() => openPatientDetails(item)}>
      <View style={styles.patientIcon}>
        <Ionicons name="person" size={28} color="#180991" />
      </View>

      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" />
          <Text style={styles.infoText}>Last visit: {item.lastAppointment}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="medkit-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{item.appointmentCount} appointment{item.appointmentCount > 1 ? 's' : ''}</Text>
        </View>
      </View>

      <View style={styles.patientDetails}>
        <Text style={styles.detailLabel}>Age</Text>
        <Text style={styles.detailValue}>{item.age}</Text>
        <Pressable
          style={styles.prescribeIcon}
          onPress={() => navigation.navigate('Main Doctor', { screen: 'Add Prescription', params: { patientName: item.name } })}
        >
          <Ionicons name="add-circle" size={24} color="#180991" />
          <Text style={styles.prescribeText}>Prescribe</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPadding}>
        <Text style={styles.title}>My Patients</Text>
        <Text style={styles.subtitle}>Total: {doctorPatients.length} patients</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search patients..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.name}
        renderItem={renderPatientCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No patients found' : 'No patients yet'}
            </Text>
          </View>
        }
      />

      {/* Patient Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Patient Record</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#666" />
              </Pressable>
            </View>

            {selectedPatient && (
              <View style={styles.patientSummaryCard}>
                <Text style={styles.summaryName}>{selectedPatient.name}</Text>
                <Text style={styles.summaryText}>Age: {selectedPatient.age} | Contact: {selectedPatient.contact}</Text>
                <Text style={styles.summaryText}>Problem: <Text style={{fontWeight: 'bold', color: '#180991'}}>{selectedPatient.disease}</Text></Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Prescriptions History</Text>
            
            {isLoadingPrescriptions ? (
              <ActivityIndicator size="large" color="#180991" style={{marginTop: 20}} />
            ) : (
              <FlatList
                data={patientPrescriptions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{paddingBottom: 20}}
                ListEmptyComponent={<Text style={styles.emptyPrescriptionText}>No prescriptions found for this patient.</Text>}
                renderItem={({ item }) => (
                  <View style={styles.prescriptionBox}>
                    <View style={styles.prescriptionHeader}>
                      <Text style={styles.prescriptionDate}>{item.date}</Text>
                      <Pressable style={styles.deleteBtn} onPress={() => deletePrescription(item.id)}>
                        <Ionicons name="trash-outline" size={16} color="#d32f2f" />
                        <Text style={styles.deleteBtnText}>Delete</Text>
                      </Pressable>
                    </View>
                    {item.medications?.map((med, index) => (
                      <View key={index} style={styles.medRow}>
                        <Text style={styles.medName}>- {med.name}</Text>
                        <Text style={styles.medDosage}>{med.dosage} ({(Array.isArray(med.times) ? med.times.join(', ') : med.times) || 'No times'})</Text>
                      </View>
                    ))}
                  </View>
                )}
              />
            )}
            
            <Pressable 
              style={styles.addPrescriptionModalBtn}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Main Doctor', { screen: 'Add Prescription', params: { patientName: selectedPatient.name } });
              }}
            >
              <Text style={styles.addPrescriptionModalText}>+ Write New Prescription</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  headerPadding: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#180991' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  listContent: { padding: 16, paddingTop: 0, paddingBottom: 30 },
  patientCard: { backgroundColor: '#fff', borderRadius: 15, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3 },
  patientIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center' },
  patientInfo: { flex: 1, marginLeft: 15 },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  infoText: { fontSize: 12, color: '#666', marginLeft: 6 },
  patientDetails: { alignItems: 'center', paddingLeft: 15, borderLeftWidth: 1, borderLeftColor: '#eee' },
  detailLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: '#180991', marginBottom: 10 },
  prescribeIcon: { alignItems: 'center', marginTop: 5 },
  prescribeText: { fontSize: 10, color: '#180991', fontWeight: 'bold' },
  emptyContainer: { marginTop: 100, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 10, fontSize: 16, color: '#999' },
  
  /* Modal Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#180991' },
  patientSummaryCard: { backgroundColor: '#f0f4ff', padding: 15, borderRadius: 12, marginBottom: 20 },
  summaryName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  summaryText: { fontSize: 14, color: '#555', marginBottom: 3 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptyPrescriptionText: { textAlign: 'center', color: '#999', marginTop: 20, fontStyle: 'italic' },
  prescriptionBox: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 1 },
  prescriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 8 },
  prescriptionDate: { fontSize: 14, fontWeight: 'bold', color: '#180991' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffebee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  deleteBtnText: { color: '#d32f2f', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  medRow: { marginBottom: 6 },
  medName: { fontSize: 14, fontWeight: 'bold', color: '#444' },
  medDosage: { fontSize: 12, color: '#666', marginLeft: 10 },
  addPrescriptionModalBtn: { backgroundColor: '#180991', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  addPrescriptionModalText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default PatientsList;
