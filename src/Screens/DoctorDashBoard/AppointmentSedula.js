import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

function AppointmentSedula({ navigation }) {
  const { user } = useContext(UserContext); // Removed appointments from context
  const [dbAppointments, setDbAppointments] = useState([]);

  // Fetch appointments for this doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/appointments/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setDbAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };
    
    // Add navigation listener to refresh on focus if navigation prop is available
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () => {
        fetchAppointments();
      });
      return unsubscribe;
    } else {
      fetchAppointments();
    }
  }, [navigation, user.id]);

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split('T')[0];

  // Filter appointments for today (the API already filters by this doctor's ID)
  const todayAppointments = useMemo(() => {
    return dbAppointments.filter(app =>
      app.date === todayDate
    ).sort((a, b) => a.time.localeCompare(b.time));
  }, [dbAppointments, todayDate]);

  // Filter other upcoming appointments
  const upcomingAppointments = useMemo(() => {
    return dbAppointments.filter(app =>
      app.date > todayDate
    ).sort((a, b) => a.date.localeCompare(b.date));
  }, [dbAppointments, todayDate]);

  // Function to mark appointment as done
  const handleMarkDone = async (appointmentId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });
      if (response.ok) {
        // Update local state to reflect change
        setDbAppointments(prev => prev.map(app => 
          app.id === appointmentId ? { ...app, status: "Completed" } : app
        ));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const renderAppointmentCard = ({ item }) => (
    <View style={[styles.card, item.status === "Completed" && styles.completedCard]}>
      <View style={[styles.timeTag, item.status === "Completed" && styles.completedTimeTag]}>
        <Ionicons name="time-outline" size={16} color="#fff" />
        <Text style={styles.timeTagText}>{item.time}</Text>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.patientRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.patient?.fullName?.charAt(0) || 'P'}</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={[styles.patientName, item.status === "Completed" && styles.strikethroughText]}>
              {item.patient?.fullName || "Unknown Patient"}
            </Text>
            <Text style={styles.patientSub}>Status: {item.status}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === "Completed" && { backgroundColor: "#e8f5e9" }]}>
            <Text style={[styles.statusText, item.status === "Completed" && { color: "#2e7d32" }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoPill}>
            <Ionicons name="calendar-outline" size={14} color="#180991" />
            <Text style={styles.pillText}>{item.date}</Text>
          </View>
          {item.status !== "Completed" && (
            <Pressable style={styles.viewBtn} onPress={() => handleMarkDone(item.id)}>
              <Text style={styles.viewBtnText}>Mark as Done</Text>
            </Pressable>
          )}
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
  completedCard: {
    opacity: 0.6,
  },
  completedTimeTag: {
    backgroundColor: '#888',
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default AppointmentSedula;
