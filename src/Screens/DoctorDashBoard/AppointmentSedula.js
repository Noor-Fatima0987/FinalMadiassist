import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import React, { useContext, useMemo } from 'react';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

function AppointmentSedula() {
  const { appointments, user } = useContext(UserContext);

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split('T')[0];

  // Filter appointments for this doctor AND for today
  const todayAppointments = useMemo(() => {
    return appointments.filter(app =>
      app.doctorName === user.fullName && app.date === todayDate
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, user.fullName, todayDate]);

  // Filter other upcoming appointments
  const upcomingAppointments = useMemo(() => {
    return appointments.filter(app =>
      app.doctorName === user.fullName && app.date > todayDate
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [appointments, user.fullName, todayDate]);

  const renderAppointmentCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.timeTag}>
        <Ionicons name="time-outline" size={16} color="#fff" />
        <Text style={styles.timeTagText}>{item.time}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.patientName.charAt(0)}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <Text style={styles.patientSub}>Age: {item.patientAge} • {item.patientContact}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoPill}>
            <Ionicons name="calendar-outline" size={14} color="#180991" />
            <Text style={styles.pillText}>{item.date}</Text>
          </View>
          <Pressable style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>Start Checkup</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.welcomeText}>Hello, {user.fullName || 'Doctor'}</Text>
          <Text style={styles.mainTitle}>Today's Schedule</Text>
          <View style={styles.dateBanner}>
            <Ionicons name="today-outline" size={20} color="#180991" />
            <Text style={styles.dateBannerText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>

        {todayAppointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cafe-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No appointments for today. Take a break!</Text>
          </View>
        ) : (
          todayAppointments.map((app) => (
            <View key={app.id}>
              {renderAppointmentCard({ item: app })}
            </View>
          ))
        )}

        {upcomingAppointments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
            {upcomingAppointments.map((app) => (
              <View key={app.id}>
                {renderAppointmentCard({ item: app })}
              </View>
            ))}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  scrollContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#180991ff',
    marginBottom: 10,
  },
  dateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  dateBannerText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#180991',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  timeTag: {
    backgroundColor: '#180991',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 15,
  },
  timeTagText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 12,
  },
  cardContent: {
    padding: 15,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#180991',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#180991',
  },
  patientInfo: {
    flex: 1,
    marginLeft: 15,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  patientSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    color: '#1976d2',
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pillText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#180991',
    fontWeight: '600',
  },
  viewBtn: {
    backgroundColor: '#180991',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default AppointmentSedula;