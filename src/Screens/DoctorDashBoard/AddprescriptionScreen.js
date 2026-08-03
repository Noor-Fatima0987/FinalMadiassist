import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  Alert,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTo12Hour } from '../../utils/reminderUtils';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

const AddPrescriptionScreen = ({ navigation, route }) => {
  const { user } = useContext(UserContext);
  const { patientName } = route.params || {};

  const [doctorPatients, setDoctorPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('__placeholder__');
  const [isLoading, setIsLoading] = useState(false);

  // Global state for native time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerTarget, setPickerTarget] = useState({ medIndex: 0, timeIndex: 0, value: new Date() });

  // Modal for setting reminders
  const [showReminderModal, setShowReminderModal] = useState(false);

  React.useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/appointments/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          const patientsMap = new Map();
          if (Array.isArray(data)) {
            data.forEach(app => {
              if (app.patient && !patientsMap.has(app.patient.id)) {
                patientsMap.set(app.patient.id, app.patient);
              }
            });
          }
          setDoctorPatients(Array.from(patientsMap.values()));
        }
      } catch (error) {
        console.error("Error fetching patients for prescription:", error);
      }
    };
    fetchPatients();
  }, [user.id]);

  React.useEffect(() => {
    if (patientName) {
      const match = doctorPatients.find(p => p.fullName === patientName);
      if (match) setSelectedPatient(String(match.id));
    }
  }, [patientName, doctorPatients]);

  const [medications, setMedications] = useState([
    {
      name: '',
      dosage: '',
      type: '',
      frequency: '',
      instructions: '',
      duration: '',
      times: [],
    }
  ]);

  const addMedicationField = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        type: '',
        frequency: '',
        instructions: '',
        duration: '',
        times: [],
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

    // Auto-calculate times array if frequency changes
    if (field === 'frequency') {
      let suggestedTimes = [];
      if (value === '1x a day') suggestedTimes = ['09:00'];
      else if (value === '2x a day') suggestedTimes = ['09:00', '21:00'];
      else if (value === '3x a day') suggestedTimes = ['08:00', '14:00', '20:00'];
      else if (value === '4x a day') suggestedTimes = ['08:00', '12:00', '16:00', '20:00'];
      
      newMedications[index]['times'] = suggestedTimes;
    }

    setMedications(newMedications);
  };

  const handleOpenPicker = (medIndex, timeIndex, timeStr) => {
    const cleanTime = (timeStr || "00:00").replace(/[^0-9:]/g, "");
    const [hhStr, mmStr] = cleanTime.split(':');
    const hh = parseInt(hhStr || "0", 10);
    const mm = parseInt(mmStr || "0", 10);

    const d = new Date();
    d.setHours(hh);
    d.setMinutes(mm);
    setPickerTarget({ medIndex, timeIndex, value: d });
    setShowTimePicker(true);
  };

  const onTimeChange = (event, selectedDate) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hh = selectedDate.getHours().toString().padStart(2, '0');
      const mm = selectedDate.getMinutes().toString().padStart(2, '0');
      
      const newTimes = [...medications[pickerTarget.medIndex].times];
      newTimes[pickerTarget.timeIndex] = `${hh}:${mm}`;
      updateMedication(pickerTarget.medIndex, 'times', newTimes);
      
      setPickerTarget({ ...pickerTarget, value: selectedDate });
    }
  };

  const openReminderSetup = () => {
    if (!selectedPatient || selectedPatient === '__placeholder__') {
      Alert.alert('Error', 'Please select a patient');
      return;
    }

    const hasEmptyFields = medications.some(
      med => !med.name || !med.dosage || !med.type || !med.frequency || !med.instructions || !med.duration || !med.times || med.times.length === 0
    );

    if (hasEmptyFields) {
      Alert.alert('Error', 'Please fill all fields for each medication, including times.');
      return;
    }

    // Open the confirmation modal instead of saving directly
    setShowReminderModal(true);
  };

  const handleSavePrescription = async () => {
    setShowReminderModal(false);
    setIsLoading(true);

    const formattedMedications = medications.map(med => ({
      name: med.name,
      dosage: `${med.dosage} (${med.type}) - ${med.frequency}`,
      instructions: med.instructions,
      duration: med.duration,
      times: med.times // Already an array of strings!
    }));

    try {
      const response = await fetch(`${BACKEND_URL}/api/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: user.id,
          patientId: selectedPatient,
          date: new Date().toISOString().split('T')[0],
          medications: formattedMedications
        })
      });

      if (response.ok) {
        Alert.alert('Success', 'Prescription added successfully', [
          { text: 'OK', onPress: () => navigation.navigate("Home") }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save prescription.');
      }
    } catch (error) {
      console.error("Prescription API Error:", error);
      Alert.alert('Error', 'Network error while saving prescription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>New Prescription</Text>
          <Text style={styles.subtitle}>Fill in the details carefully</Text>
        </View>

        {/* Patient Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Patient Name <Text style={{color:'red'}}>*</Text></Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPatient}
              onValueChange={(value) => setSelectedPatient(String(value))}
              itemStyle={{ color: '#180991', fontSize: 16 }}
              style={styles.picker}
            >
              <Picker.Item label="Select your patient" value="__placeholder__" />
              {doctorPatients.map((patient, index) => (
                <Picker.Item key={index} label={patient.fullName} value={String(patient.id)} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medications</Text>
            <Pressable onPress={addMedicationField} style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Med</Text>
            </Pressable>
          </View>

          {medications.map((med, index) => (
            <View key={index} style={styles.medicationCard}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.cardTitle}>Medication Details</Text>
                {medications.length > 1 && (
                  <Pressable onPress={() => removeMedicationField(index)} style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                  </Pressable>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Medicine Name <Text style={{color:'red'}}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Panadol, Amoxil"
                  value={med.name}
                  onChangeText={(text) => updateMedication(index, 'name', text)}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Dosage <Text style={{color:'red'}}>*</Text></Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 500mg"
                    value={med.dosage}
                    onChangeText={(text) => updateMedication(index, 'dosage', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Type <Text style={{color:'red'}}>*</Text></Text>
                  <View style={styles.pickerContainerSmall}>
                    <Picker
                      selectedValue={med.type}
                      onValueChange={(val) => updateMedication(index, 'type', val)}
                      style={styles.pickerSmall}
                    >
                      <Picker.Item label="Select..." value="" />
                      <Picker.Item label="Tablet" value="Tablet" />
                      <Picker.Item label="Syrup" value="Syrup" />
                      <Picker.Item label="Injection" value="Injection" />
                      <Picker.Item label="Drops" value="Drops" />
                      <Picker.Item label="Ointment" value="Ointment" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Frequency <Text style={{color:'red'}}>*</Text></Text>
                  <View style={styles.pickerContainerSmall}>
                    <Picker
                      selectedValue={med.frequency}
                      onValueChange={(val) => updateMedication(index, 'frequency', val)}
                      style={styles.pickerSmall}
                    >
                      <Picker.Item label="Select..." value="" />
                      <Picker.Item label="1x a day" value="1x a day" />
                      <Picker.Item label="2x a day" value="2x a day" />
                      <Picker.Item label="3x a day" value="3x a day" />
                      <Picker.Item label="4x a day" value="4x a day" />
                    </Picker>
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Duration <Text style={{color:'red'}}>*</Text></Text>
                  <View style={styles.pickerContainerSmall}>
                    <Picker
                      selectedValue={med.duration}
                      onValueChange={(val) => updateMedication(index, 'duration', val)}
                      style={styles.pickerSmall}
                    >
                      <Picker.Item label="Select..." value="" />
                      <Picker.Item label="3 Days" value="3 Days" />
                      <Picker.Item label="5 Days" value="5 Days" />
                      <Picker.Item label="1 Week" value="1 Week" />
                      <Picker.Item label="2 Weeks" value="2 Weeks" />
                      <Picker.Item label="1 Month" value="1 Month" />
                    </Picker>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instructions <Text style={{color:'red'}}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., After meal, empty stomach"
                  value={med.instructions}
                  onChangeText={(text) => updateMedication(index, 'instructions', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.timeInfoBox}>
                  <Ionicons name="alarm-outline" size={24} color="#0288d1" />
                  <Text style={styles.timeInfoText}>Times are generated based on frequency. Tap on any time to manually adjust it with a clock picker.</Text>
                </View>

                {Array.isArray(med.times) && med.times.length > 0 ? (
                  <View style={styles.timeSlotsWrapper}>
                    {med.times.map((t, tIndex) => (
                      <Pressable 
                        key={tIndex} 
                        style={styles.timeSlotBtn} 
                        onPress={() => handleOpenPicker(index, tIndex, t)}
                      >
                        <View style={styles.timeSlotHeader}>
                          <Text style={styles.timeSlotLabel}>Dose {tIndex + 1}</Text>
                          <Ionicons name="create-outline" size={16} color="#4C39DB" />
                        </View>
                        <Text style={styles.timeSlotValue}>{formatTo12Hour(t)}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyTimesText}>Select frequency to configure times.</Text>
                )}
              </View>

            </View>
          ))}
        </View>

        {/* Set Reminder Button */}
        <Pressable 
          style={styles.saveButton} 
          onPress={openReminderSetup}
        >
          <Ionicons name="notifications-circle" size={26} color="#fff" />
          <Text style={styles.saveButtonText}>Set Reminder</Text>
        </Pressable>
      </ScrollView>

      {/* Global Native Time Picker Modal */}
      {showTimePicker && (
        <DateTimePicker
          value={pickerTarget.value}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

      {/* Reminder Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReminderModal}
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="notifications" size={30} color="#180991" />
              <Text style={styles.modalTitle}>Set Reminders</Text>
              <Pressable onPress={() => setShowReminderModal(false)} style={styles.closeModalBtn}>
                <Ionicons name="close" size={28} color="#666" />
              </Pressable>
            </View>
            
            <Text style={styles.modalSubtitle}>Review alarms that will be set for the patient:</Text>
            
            <ScrollView style={styles.modalList}>
              {medications.map((med, index) => (
                <View key={index} style={styles.modalMedCard}>
                  <Text style={styles.modalMedName}>{med.name} <Text style={{fontSize: 14, fontWeight: 'normal', color: '#666'}}>({med.duration})</Text></Text>
                  <Text style={styles.modalMedInstruction}>{med.instructions}</Text>
                  <View style={styles.modalTimesRow}>
                    {med.times.map((t, idx) => (
                      <View key={idx} style={styles.modalTimeChip}>
                        <Ionicons name="time-outline" size={14} color="#180991" style={{marginRight: 4}} />
                        <Text style={styles.modalTimeText}>{formatTo12Hour(t)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <Pressable 
              style={[styles.saveButton, isLoading && styles.disabledButton, { width: '100%' }]} 
              onPress={handleSavePrescription}
              disabled={isLoading}
            >
              <Ionicons name={isLoading ? "hourglass-outline" : "checkmark-done-circle"} size={24} color="#fff" />
              <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Confirm & Save Prescription"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#180991',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 1,
  },
  picker: {
    height: 55,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#180991',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C39DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 13,
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  badge: {
    width: 26,
    height: 26,
    backgroundColor: '#180991',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteBtn: {
    padding: 5,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerContainerSmall: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    height: 48,
    justifyContent: 'center',
  },
  pickerSmall: {
    height: 48,
  },
  timeInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#e1f5fe',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  timeInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#0277bd',
    marginLeft: 8,
    lineHeight: 16,
  },
  timeSlotsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  timeSlotBtn: {
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    padding: 12,
    minWidth: '45%',
    flex: 1,
    borderWidth: 1,
    borderColor: '#d0d9e4',
  },
  timeSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeSlotLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  timeSlotValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#180991',
  },
  emptyTimesText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 13,
    textAlign: 'center',
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#180991',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    elevation: 4,
    marginTop: 5,
  },
  disabledButton: {
    backgroundColor: '#9fa8da',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#180991',
    marginLeft: 10,
    flex: 1,
  },
  closeModalBtn: {
    padding: 5,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
  modalList: {
    marginBottom: 20,
  },
  modalMedCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  modalMedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalMedInstruction: {
    fontSize: 14,
    color: '#00796B',
    fontWeight: '600',
    marginBottom: 10,
  },
  modalTimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b3e5fc',
  },
  modalTimeText: {
    color: '#180991',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default AddPrescriptionScreen;
