import React, { useContext, useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TextInput } from 'react-native';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const PatientsList = () => {
  const { user, appointments } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique patients for the current doctor
  const doctorPatients = useMemo(() => {
    const patientsMap = new Map();

    appointments
      .filter(appointment => appointment.doctorName === user.fullName)
      .forEach(appointment => {
        if (!patientsMap.has(appointment.patientName)) {
          patientsMap.set(appointment.patientName, {
            name: appointment.patientName,
            age: appointment.patientAge,
            contact: appointment.patientContact,
            lastAppointment: appointment.date,
            appointmentCount: 1
          });
        } else {
          const patient = patientsMap.get(appointment.patientName);
          patient.appointmentCount += 1;
          // Update last appointment if this one is more recent
          if (new Date(appointment.date) > new Date(patient.lastAppointment)) {
            patient.lastAppointment = appointment.date;
          }
        }
      });

    return Array.from(patientsMap.values());
  }, [appointments, user.fullName]);

  // Filter patients based on search query
  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPatientCard = ({ item }) => (
    <View style={styles.patientCard}>
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
      </View>
    </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 30,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  patientIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  patientDetails: {
    alignItems: 'center',
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#180991',
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

export default PatientsList;