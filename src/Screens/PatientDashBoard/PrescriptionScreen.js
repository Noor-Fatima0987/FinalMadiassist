import React, { useContext } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

const PrescriptionScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Removed prescriptions from context
  const [dbPrescriptions, setDbPrescriptions] = React.useState([]);

  React.useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/prescriptions/patient/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setDbPrescriptions(data);
        }
      } catch (error) {
        console.error("Error fetching patient prescriptions:", error);
      }
    };
    
    // Add navigation listener to refresh on focus if navigation prop is available
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        fetchPrescriptions();
      });
      return unsubscribe;
    } else {
      fetchPrescriptions();
    }
  }, [navigation, user.id]);

  const renderPrescription = ({ item }) => (
    <View style={styles.prescriptionCard}>
      <View style={styles.headerRow}>
        <Ionicons name="document-text-outline" size={24} color="#180991" />
        <View style={styles.headerInfo}>
          <Text style={styles.doctorName}>Prescribed by {item.doctor?.fullName || "Doctor"}</Text>
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
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={14} color="#555" />
              <Text style={styles.detailText}>Dosage: {med.dosage}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="information-circle-outline" size={14} color="#555" />
              <Text style={styles.detailText}>Instructions: {med.instructions}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#555" />
              <Text style={styles.detailText}>Duration: {med.duration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#555" />
              <Text style={styles.detailText}>Times: {Array.isArray(med.times) ? med.times.join(', ') : med.times}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.headerPadding}>
        <Text style={styles.title}>My Prescriptions</Text>
        <Text style={styles.subtitle}>Prescriptions from your doctors</Text>
      </View>

      <FlatList
        data={dbPrescriptions}
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
    marginLeft: 6,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
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
