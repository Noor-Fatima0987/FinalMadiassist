import React, { useContext, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../store/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { convertTo24Hour, canCancelAppointment, getCancelWindowMinutesLeft } from '../../utils/reminderUtils';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

const AppointmentDetialScreen = () => {
  const { user } = useContext(UserContext); // Removed appointments from context
  const [dbAppointments, setDbAppointments] = useState([]);
  const [timeTick, setTimeTick] = useState(Date.now());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/appointments/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setDbAppointments(data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, [user.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const visibleAppointments = useMemo(() => {
    // Show all appointments including cancelled ones in history
    return [...dbAppointments].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [dbAppointments, timeTick]);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
      if (response.ok) {
        setDbAppointments(prev => prev.map(app => 
          app.id === appointmentId ? { ...app, status: "Cancelled" } : app
        ));
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert(
          "Cannot Cancel",
          errorData?.error || "Appointment can only be cancelled within 15 minutes of booking."
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      Alert.alert("Error", "Failed to cancel appointment. Please try again.");
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const isWithinCancelWindow = canCancelAppointment(item.createdAt, 15);
    const isCancellable =
      (item.status === "Pending" || item.status === "Scheduled") && isWithinCancelWindow;
    const isCancelled = item.status === "Cancelled";
    const minutesLeft = getCancelWindowMinutesLeft(item.createdAt, 15);

    return (
      <View style={[styles.appointmentBox, isCancelled && { borderLeftColor: '#d32f2f', opacity: 0.8 }]}>
        <View style={styles.headerRow}>
          <Ionicons name="calendar-outline" size={20} color={isCancelled ? '#d32f2f' : '#180991'} />
          <Text style={[styles.dateText, isCancelled && { color: '#d32f2f' }]}>{item.date}</Text>
          <View style={[styles.statusBadge, isCancelled && { backgroundColor: '#ffebee' }]}>
            <Text style={[styles.statusText, isCancelled && { color: '#d32f2f' }]}>{item.status || 'Scheduled'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={18} color="#666" />
            <Text style={styles.infoLabel}>Doctor:</Text>
            <Text style={styles.infoValue}>{item.doctor?.fullName || "Unknown"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{item.time}</Text>
          </View>

          {isCancellable && (
            <>
              <Text style={styles.cancelHint}>
                Cancel available for {minutesLeft} min{minutesLeft === 1 ? '' : 's'}
              </Text>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => handleCancelAppointment(item.id)}
              >
                <Ionicons name="close-circle-outline" size={16} color="#d32f2f" />
                <Text style={styles.cancelBtnText}>Cancel Appointment</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <View style={styles.headerPadding}>
        <Text style={styles.title}>Appointment History</Text>
        <Text style={styles.subtitle}>List of all your consultations</Text>
      </View>

      <FlatList
        data={visibleAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointmentItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No appointments found</Text>
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
  appointmentBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
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
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#180991ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 10,
  },
  detailsContainer: {
    marginTop: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
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
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  cancelHint: {
    marginTop: 8,
    marginBottom: 6,
    color: '#8a4b00',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelBtnText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 13,
  },
});

export default AppointmentDetialScreen;
