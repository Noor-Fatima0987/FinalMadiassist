import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../../store/context/UserContext';
import {
  getTimelineSchedule,
  getSecondsUntil,
  formatSecondsRemaining,
  formatTo12Hour,
} from '../../utils/reminderUtils';
import { syncNotificationsWithMedications, registerForPushNotificationsAsync } from '../../utils/notificationUtils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RemainderScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext) || {};
  const [medications, setMedications] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [nextReminder, setNextReminder] = useState(null);
  const [timeUntil, setTimeUntil] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = "https://mediassist-rho.vercel.app";

  // 1. Fetch prescriptions from DB
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/prescriptions/patient/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          const meds = [];
          if (Array.isArray(data)) {
              data.forEach(prescription => {
                if (Array.isArray(prescription.medications)) {
                  meds.push(...prescription.medications);
                }
              });
          }
          setMedications(meds);
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPrescriptions();
    });

    fetchPrescriptions();
    return unsubscribe;
  }, [navigation, user.id]);

  // 2. AUTO UPDATE LOGIC
  useEffect(() => {
    const updateReminders = () => {
      const currentSchedule = getTimelineSchedule(medications);
      setSchedule(currentSchedule);
      
      const next = currentSchedule.find(item => item.status === 'next');
      
      // If no next today, maybe it's tomorrow (this is a simplified fallback)
      if (!next && currentSchedule.length > 0) {
          const firstTomorrow = { ...currentSchedule[0], isTomorrow: true, status: 'next' };
          setNextReminder(firstTomorrow);
          setTimeUntil(getSecondsUntil(firstTomorrow.time, true));
      } else if (next) {
          setNextReminder(next);
          const secs = getSecondsUntil(next.time, false);
          setTimeUntil(secs);
      } else {
          setNextReminder(null);
          setTimeUntil(0);
      }
    };

    const setupNotifications = async () => {
      await registerForPushNotificationsAsync();
      if (medications.length > 0) {
          syncNotificationsWithMedications(medications);
      }
    };

    updateReminders();
    setupNotifications();

    const interval = setInterval(updateReminders, 1000);
    return () => clearInterval(interval);
  }, [medications]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const renderTimelineItem = (item, index) => {
    const isPast = item.status === 'past';
    const isNext = item.status === 'next';

    return (
      <View key={index} style={styles.timelineRow}>
        <View style={styles.timelineTimeColumn}>
          <Text style={[styles.timelineTimeText, isPast && styles.textMuted]}>
            {formatTo12Hour(item.time || "00:00")}
          </Text>
        </View>

        <View style={styles.timelineLineColumn}>
          <View style={[
            styles.timelineDot, 
            isPast ? styles.dotPast : (isNext ? styles.dotNext : styles.dotFuture)
          ]}>
            {isPast && <Ionicons name="checkmark" size={12} color="#fff" />}
            {isNext && <View style={styles.dotPulse} />}
          </View>
          {index < schedule.length - 1 && (
            <View style={[styles.timelineLine, isPast && styles.linePast]} />
          )}
        </View>

        <View style={styles.timelineCardColumn}>
          <View style={[
            styles.timelineCard, 
            isNext && styles.timelineCardNext,
            isPast && styles.timelineCardPast
          ]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.medName, isPast && styles.textMuted]} numberOfLines={1}>
                {item.medicineName || 'Unknown Medicine'}
              </Text>
              {isNext && (
                <View style={styles.nextBadge}>
                  <Text style={styles.nextBadgeText}>UPCOMING</Text>
                </View>
              )}
            </View>
            <Text style={[styles.medDosage, isPast && styles.textMuted]}>{item.dosage}</Text>
            
            <View style={styles.medInstructionsRow}>
              <View style={styles.instructionChip}>
                <Ionicons name="restaurant-outline" size={12} color={isPast ? "#999" : "#00796B"} />
                <Text style={[styles.instructionText, isPast && styles.textMuted]}>{item.instructions || 'As Directed'}</Text>
              </View>
              <View style={styles.instructionChip}>
                <Ionicons name="calendar-outline" size={12} color={isPast ? "#999" : "#180991"} />
                <Text style={[styles.instructionText, {color: isPast ? '#999' : '#180991'}]}>{item.duration || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#180991" />
        <Text style={styles.loadingText}>Loading your schedule...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.pageTitle}>Medication Schedule</Text>
          <Text style={styles.dateSubtitle}>{currentDate}</Text>
        </View>
        
        {/* Next Reminder Hero Card */}
        {nextReminder ? (
          <View style={styles.heroCard}>
            <View style={styles.heroBackground}>
              <View style={styles.heroHeader}>
                <View style={styles.heroIconBox}>
                  <Ionicons name="alarm" size={24} color="#fff" />
                </View>
                <View style={styles.heroTimeInfo}>
                  <Text style={styles.heroTimeLabel}>
                    {nextReminder.isTomorrow ? 'Tomorrow' : 'Next Dose In'}
                  </Text>
                  <Text style={styles.heroCountdown}>{formatSecondsRemaining(timeUntil)}</Text>
                </View>
                <View style={styles.heroTimeRight}>
                  <Text style={styles.heroExactTime}>{formatTo12Hour(nextReminder.time)}</Text>
                </View>
              </View>
              
              <View style={styles.heroBody}>
                <Text style={styles.heroMedName} numberOfLines={1}>
                  {nextReminder.medicineName || 'Medicine'}
                </Text>
                <Text style={styles.heroMedDose}>{nextReminder.dosage}</Text>
                
                <View style={styles.heroFooterRow}>
                  <View style={styles.heroFooterChip}>
                    <Ionicons name="restaurant" size={14} color="#180991" />
                    <Text style={styles.heroFooterText}>{nextReminder.instructions}</Text>
                  </View>
                  <View style={styles.heroFooterChip}>
                    <Ionicons name="calendar" size={14} color="#180991" />
                    <Text style={styles.heroFooterText}>{nextReminder.duration}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyHeroCard}>
            <Ionicons name="checkmark-done-circle" size={50} color="#4CAF50" />
            <Text style={styles.emptyHeroText}>You're all caught up!</Text>
            <Text style={styles.emptyHeroSubtext}>No more medications scheduled for today.</Text>
          </View>
        )}

        {/* Timeline View */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Today's Timeline</Text>
          {schedule.length > 0 ? (
            schedule.map((item, index) => renderTimelineItem(item, index))
          ) : (
            <View style={styles.emptyTimeline}>
              <Ionicons name="medkit-outline" size={40} color="#ccc" />
              <Text style={styles.emptyTimelineText}>No prescriptions assigned.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#180991',
  },
  headerTitleContainer: {
    marginBottom: 20,
  },
  dateSubtitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    marginTop: 4,
  },
  heroCard: {
    marginBottom: 30,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#180991',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    backgroundColor: '#fff',
  },
  heroBackground: {
    backgroundColor: '#180991',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 15,
  },
  heroIconBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 16,
    marginRight: 15,
  },
  heroTimeInfo: {
    flex: 1,
  },
  heroTimeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroCountdown: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  heroTimeRight: {
    alignItems: 'flex-end',
  },
  heroExactTime: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  heroBody: {
    marginTop: 5,
  },
  heroMedName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  heroMedDose: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  heroFooterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  heroFooterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  heroFooterText: {
    color: '#180991',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6,
  },
  emptyHeroCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  emptyHeroText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 10,
  },
  emptyHeroSubtext: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 5,
  },
  timelineContainer: {
    marginTop: 10,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyTimeline: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyTimelineText: {
    marginTop: 10,
    color: '#999',
    fontSize: 15,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  timelineTimeColumn: {
    width: 60,
    alignItems: 'flex-end',
    paddingTop: 15,
    paddingRight: 10,
  },
  timelineTimeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineLineColumn: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dotPast: {
    backgroundColor: '#4CAF50',
  },
  dotNext: {
    backgroundColor: '#180991',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  dotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dotFuture: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: -5,
    marginBottom: -15,
    zIndex: 1,
  },
  linePast: {
    backgroundColor: '#4CAF50',
  },
  timelineCardColumn: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#b3e5fc',
    shadowColor: '#180991',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timelineCardNext: {
    borderColor: '#180991',
    borderWidth: 2,
    elevation: 6,
    shadowOpacity: 0.2,
    backgroundColor: '#f5f8ff',
  },
  timelineCardPast: {
    backgroundColor: '#f5f5f5',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  nextBadge: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nextBadgeText: {
    color: '#180991',
    fontSize: 10,
    fontWeight: 'bold',
  },
  medDosage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  medInstructionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 5,
  },
  instructionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 1,
  },
  instructionText: {
    fontSize: 11,
    color: '#00796B',
    marginLeft: 4,
    fontWeight: '600',
    flexShrink: 1,
  },
  textMuted: {
    color: '#999',
  },
});

export default RemainderScreen;
