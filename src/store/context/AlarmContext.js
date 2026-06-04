import React, { createContext, useState, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Vibration, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AlarmContext = createContext();

export const AlarmProvider = ({ children }) => {
  const [alarmVisible, setAlarmVisible] = useState(false);
  const [alarmData, setAlarmData] = useState(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Pattern for vibration: Wait 0s, vibrate 500ms, wait 500ms, vibrate 500ms...
  const VIBRATION_PATTERN = [0, 500, 500, 500, 500, 500, 500, 500, 500, 500];

  const triggerAlarm = async (medicationDetails) => {
    if (alarmVisible) return; // Prevent multiple overlapping alarms

    setAlarmData(medicationDetails);
    setAlarmVisible(true);

    // 1. Start Vibrate
    Vibration.vibrate(VIBRATION_PATTERN, true); // true = repeat

    // 2. Start Shake Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.delay(1000)
      ])
    ).start();
  };

  const stopAlarm = () => {
    Vibration.cancel();
    shakeAnimation.stopAnimation();
    setAlarmVisible(false);
    setAlarmData(null);
  };

  return (
    <AlarmContext.Provider value={{ triggerAlarm, stopAlarm }}>
      {children}
      
      {/* Global Full-Screen Alarm Modal */}
      <Modal
        visible={alarmVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={stopAlarm}
      >
        <View style={styles.container}>
          
          <View style={styles.topSection}>
            <Animated.View style={[styles.bellContainer, { transform: [{ translateX: shakeAnimation }] }]}>
              <Ionicons name="alarm" size={100} color="#fff" />
            </Animated.View>
            <Text style={styles.alarmText}>TIME TO TAKE</Text>
            <Text style={styles.medName}>{alarmData?.medicineName || 'Your Medicine'}</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={24} color="#180991" />
              <Text style={styles.detailText}>{alarmData?.dosage || 'Prescribed Dose'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="restaurant-outline" size={24} color="#180991" />
              <Text style={styles.detailText}>{alarmData?.instructions || 'As Directed'}</Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Pressable style={styles.dismissButton} onPress={stopAlarm}>
              <Ionicons name="checkmark-done-circle" size={28} color="#180991" />
              <Text style={styles.dismissText}>Dismiss Alarm</Text>
            </Pressable>
          </View>

        </View>
      </Modal>
    </AlarmContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#180991',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  bellContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 30,
    borderRadius: 80,
  },
  alarmText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  medName: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '900',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: 50,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  bottomSection: {
    width: '100%',
  },
  dismissButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 5,
  },
  dismissText: {
    color: '#180991',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
