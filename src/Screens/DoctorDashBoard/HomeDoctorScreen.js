import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const HomeDoctorScreen = ({ navigation }) => {
  const { user, appointments } = useContext(UserContext);

  // Today's Date
  const todayDate = new Date().toISOString().split('T')[0];

  // Stats
  const todayApps = useMemo(() =>
    appointments.filter(app => app.doctorName === user.fullName && app.date === todayDate),
    [appointments, user.fullName, todayDate]
  );

  const pendingApps = useMemo(() =>
    todayApps.filter(app => app.status !== 'Completed'),
    [todayApps]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Day,</Text>
            <Text style={styles.doctorName}>{user.fullName || 'Doctor'}</Text>
          </View>
          <View style={styles.profileBadge}>
            <Ionicons name="medical" size={24} color="#180991" />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: '#180991' }]}>
            <Text style={styles.statNumber}>{todayApps.length}</Text>
            <Text style={styles.statLabel}>Total Today</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#180991' }]}>
            <Text style={styles.statNumber}>{todayApps.length - pendingApps.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#180991' }]}>
            <Text style={styles.statNumber}>{pendingApps.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Next Patient Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Appointment</Text>
          <Pressable onPress={() => navigation.navigate('Sedular')}>
            <Text style={styles.viewAll}>View Schedule</Text>
          </Pressable>
        </View>

        {pendingApps.length > 0 ? (
          <View style={styles.nextPatientCard}>
            <View style={styles.timeTag}>
              <Text style={styles.timeText}>{pendingApps[0].time}</Text>
            </View>
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{pendingApps[0].patientName}</Text>
              <Text style={styles.patientDetail}>Age: {pendingApps[0].patientAge} • Consultation</Text>
            </View>
            <Pressable style={styles.startBtn}>
              <Text style={styles.startBtnText}>Start</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No pending appointments for now.</Text>
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionItem} onPress={() => navigation.navigate('Sedular')}>
            <View style={[styles.actionIcon,]}>
              <Ionicons name="calendar" size={24} color="#180991ff" />
            </View>
            <Text style={styles.actionText}>My Schedule</Text>
          </Pressable>

          <Pressable style={styles.actionItem}>
            <View style={[styles.actionIcon, ]}>
              <Ionicons name="people" size={24} color="#180991ff" />
            </View>
            <Text style={styles.actionText}>Patients</Text>
          </Pressable>

          <Pressable style={styles.actionItem}>
            <View style={[styles.actionIcon,]}>
              <Ionicons name="document-text" size={24} color="#180991ff" />
            </View>
            <Text style={styles.actionText}>Reports</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#180991ff',
  },
  profileBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    width: '31%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    fontWeight: '600',
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
    color: '#180991ff',
    marginBottom: 15,
  },
  viewAll: {
    color: '#180991',
    fontWeight: '600',
    fontSize: 14,
  },
  nextPatientCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  timeTag: {
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    width: 70,
  },
  timeText: {
    color: '#180991',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientDetail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  startBtn: {
    backgroundColor: '#180991',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeDoctorScreen;