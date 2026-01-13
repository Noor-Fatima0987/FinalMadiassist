import React, { useContext } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const PrescriptionScreen = () => {
  const { user, prescriptions } = useContext(UserContext);

  // Filter prescriptions for the current patient
  const patientPrescriptions = prescriptions.filter(
    (prescription) => prescription.patientName === user.fullName
  );

  const renderPrescription = ({ item }) => (
    <View style={styles.prescriptionCard}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#180991" />
        <View style={styles.headerInfo}>
          <Text style={styles.doctorName}>Prescribed by {item.doctorName}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Medications</Text>
      {item.medications.map((med, index) => (
        <View key={index} style={styles.medicationItem}>
          <View style={styles.medicationHeader}>
            <Ionicons name="medical" size={18} color="#180991" />
            <Text style={styles.medicationName}>{med.name}</Text>
          </View>
          <View style={styles.medicationDetails}>
            <Text style={styles.detailText}>💊 Dosage: {med.dosage}</Text>
            <Text style={styles.detailText}>📋 Instructions: {med.instructions}</Text>
            <Text style={styles.detailText}>⏱️ Duration: {med.duration}</Text>
            <Text style={styles.detailText}>
              🕐 Times: {med.times.join(', ')}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPadding}>
        <Text style={styles.title}>My Prescriptions</Text>
        <Text style={styles.subtitle}>Prescriptions from your doctors</Text>
      </View>

      <FlatList
        data={patientPrescriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderPrescription}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No prescriptions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
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
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#180991',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#180991',
    marginBottom: 10,
  },
  medicationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  medicationDetails: {
    marginLeft: 26,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});

export default PrescriptionScreen;