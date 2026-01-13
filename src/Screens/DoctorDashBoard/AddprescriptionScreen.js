import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert
} from 'react-native';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const AddPrescriptionScreen = ({ navigation }) => {
  const { user, appointments, addPrescription } = useContext(UserContext);

  // Get unique patients for this doctor
  const doctorPatients = Array.from(
    new Set(
      appointments
        .filter(app => app.doctorName === user.fullName)
        .map(app => app.patientName)
    )
  );

  const [selectedPatient, setSelectedPatient] = useState('');
  const [medications, setMedications] = useState([
    {
      name: '',
      dosage: '',
      instructions: '',
      duration: '',
      times: '',
    }
  ]);

  const addMedicationField = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        instructions: '',
        duration: '',
        times: '',
      }
    ]);
  };

  const removeMedicationField = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const updateMedication = (index, field, value) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSavePrescription = () => {
    // Validation
    if (!selectedPatient) {
      Alert.alert('Error', 'Please select a patient');
      return;
    }

    const hasEmptyFields = medications.some(
      med => !med.name || !med.dosage || !med.instructions || !med.duration || !med.times
    );

    if (hasEmptyFields) {
      Alert.alert('Error', 'Please fill all medication fields');
      return;
    }

    // Convert times string to array
    const formattedMedications = medications.map(med => ({
      ...med,
      times: med.times.split(',').map(t => t.trim())
    }));

    const prescription = {
      id: `p${Date.now()}`,
      doctorName: user.fullName,
      patientName: selectedPatient,
      date: new Date().toISOString().split('T')[0],
      medications: formattedMedications
    };

    addPrescription(prescription);
    Alert.alert('Success', 'Prescription added successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="medical" size={40} color="#180991" />
          <Text style={styles.title}>New Prescription</Text>
        </View>

        {/* Patient Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Patient *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={setSelectedPatient}
              style={styles.picker}
            >
              <Picker.Item label="Choose a patient..." value="" />
              {doctorPatients.map((patient, index) => (
                <Picker.Item key={index} label={patient} value={patient} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <Pressable onPress={addMedicationField} style={styles.addButton}>
              <Ionicons name="add-circle" size={24} color="#180991" />
              <Text style={styles.addButtonText}>Add Medication</Text>
            </Pressable>
          </View>

          {medications.map((med, index) => (
            <View key={index} style={styles.medicationCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Medication {index + 1}</Text>
                {medications.length > 1 && (
                  <Pressable onPress={() => removeMedicationField(index)}>
                    <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                  </Pressable>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medicine Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Paracetamol"
                  value={med.name}
                  onChangeText={(text) => updateMedication(index, 'name', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Dosage *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 1 Tablet, 500mg"
                  value={med.dosage}
                  onChangeText={(text) => updateMedication(index, 'dosage', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instructions *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., After meal"
                  value={med.instructions}
                  onChangeText={(text) => updateMedication(index, 'instructions', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 7 days, 2 weeks"
                  value={med.duration}
                  onChangeText={(text) => updateMedication(index, 'duration', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Times (24-hour format, comma separated) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 08:00, 14:00, 21:00"
                  value={med.times}
                  onChangeText={(text) => updateMedication(index, 'times', text)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <Pressable style={styles.saveButton} onPress={handleSavePrescription}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Prescription</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#180991',
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#180991',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#180991',
    fontWeight: '600',
    marginLeft: 5,
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#180991',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#180991',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AddPrescriptionScreen;