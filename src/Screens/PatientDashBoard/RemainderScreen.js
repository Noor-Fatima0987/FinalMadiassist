import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { UserContext } from '../../store/context/UserContext';
import {
  getNextReminder,
  getTodaySchedule,
  getMinutesUntil,
  formatTimeRemaining,
  formatTo12Hour,
} from '../../utils/reminderUtils';
import { Ionicons } from '@expo/vector-icons';

const RemainderScreen = () => {
  const { medications } = useContext(UserContext);
  const [nextReminder, setNextReminder] = useState(null);
  const [timeUntil, setTimeUntil] = useState(0);
  const [medModalVisible, setMedModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  // ---------------- AUTO UPDATE LOGIC ----------------
  useEffect(() => {
    const updateReminders = () => {
      const next = getNextReminder(medications);
      setNextReminder(next);
      if (next) {
        setTimeUntil(getMinutesUntil(next.time, next.isTomorrow));
      }
    };

    updateReminders();
    const interval = setInterval(updateReminders, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [medications]);

  // ---------------- RENDER HELPERS ----------------
  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.scheduleTime}>{formatTo12Hour(item.time)}</Text>
      <View style={styles.scheduleDivider} />
      <View>
        <Text style={styles.scheduleMedName}>{item.medicineName}</Text>
        <Text style={styles.scheduleDose}>{item.dosage}</Text>
      </View>
    </View>
  );

  // ---------------- UI ----------------
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* TOP SECTION: HEADER */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Next Reminder</Text>

          {!nextReminder ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No medication scheduled for today</Text>
            </View>
          ) : (
            <View style={styles.nextReminderBox}>
              {/* Scheduled Time Section (Calendar/Clock Style) */}
              <View style={styles.timeInfoRow}>
                <View style={styles.timeLabelContainer}>
                  <Ionicons name="calendar-outline" size={18} color="#fff" />
                  <Text style={styles.timeLabelText}>{nextReminder.isTomorrow ? 'Tomorrow' : 'Today'}</Text>
                </View>
                <View style={styles.timeLabelContainer}>
                  <Ionicons name="alarm-outline" size={18} color="#fff" />
                  <Text style={styles.timeLabelText}>{formatTo12Hour(nextReminder.time)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Countdown and Med Info */}
              <View style={styles.timerContent}>
                <Text style={styles.remainingText}>Remaining: {formatTimeRemaining(timeUntil)}</Text>
                <View style={styles.nextMedRow}>
                  <Ionicons name="medical-outline" size={24} color="#fff" />
                  <Text style={styles.nextMedName}>{nextReminder.medicineName} ({nextReminder.dosage})</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 2. MEDICINE BOX (Clickable) */}
        <Pressable
          style={styles.actionCard}
          onPress={() => setMedModalVisible(true)}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="medkit-outline" size={30} color="#180991" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>My Medications</Text>
            <Text style={styles.cardSubtitle}>
              {medications.length > 0 ? medications.map(m => m.name).join(', ') : 'No medications assigned'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </Pressable>

        {/* 3. SCHEDULE BOX (Clickable) */}
        <Pressable
          style={styles.actionCard}
          onPress={() => setScheduleModalVisible(true)}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="calendar-outline" size={30} color="#180991" />
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Today’s Reminder Schedule</Text>
            <Text style={styles.cardSubtitle}>View all doses for today</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </Pressable>

        {/* TREATMENT COMPLETE CASE */}
        {medications.length === 0 && (
          <View style={styles.completedBox}>
            <Ionicons name="checkmark-circle-outline" size={50} color="#4caf50" />
            <Text style={styles.completedText}>Your medication course is completed</Text>
          </View>
        )}

      </ScrollView>

      {/* MODALS */}

      {/* Medicine Details Modal */}
      <Modal
        visible={medModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medication Details</Text>
              <Pressable onPress={() => setMedModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <ScrollView style={styles.modalScroll}>
              {medications.map((med) => (
                <View key={med.id} style={styles.medDetailCard}>
                  <Text style={styles.medDetailName}>{med.name}</Text>
                  <Text style={styles.medDetailDose}><Text style={styles.bold}>Dosage:</Text> {med.dosage}</Text>
                  <Text style={styles.medDetailInfo}><Text style={styles.bold}>Instructions:</Text> {med.instructions}</Text>
                  <Text style={styles.medDetailInfo}><Text style={styles.bold}>Duration:</Text> {med.duration}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        visible={scheduleModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Today’s Schedule</Text>
              <Pressable onPress={() => setScheduleModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>
            <FlatList
              data={getTodaySchedule(medications)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderScheduleItem}
              ListEmptyComponent={<Text style={styles.emptyText}>No reminders for today</Text>}
              contentContainerStyle={styles.scheduleList}
            />
          </View>
        </View>
      </Modal>

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
  },
  headerSection: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#180991',
    marginBottom: 15,
  },
  nextReminderBox: {
    backgroundColor: '#4C39DB',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  timeInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeLabelText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 10,
  },
  timerContent: {
    alignItems: 'center',
    marginTop: 5,
  },
  remainingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  nextMedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextMedName: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  completedBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#180991',
  },
  modalScroll: {
    marginBottom: 20,
  },
  medDetailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#180991',
  },
  medDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  medDetailDose: {
    fontSize: 15,
    color: '#444',
    marginBottom: 4,
  },
  medDetailInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  // Schedule Items
  scheduleList: {
    paddingBottom: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#180991',
    width: 90,
  },
  scheduleDivider: {
    width: 2,
    height: 30,
    backgroundColor: '#eee',
    marginHorizontal: 15,
  },
  scheduleMedName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scheduleDose: {
    fontSize: 13,
    color: '#666',
  },
});

export default RemainderScreen;