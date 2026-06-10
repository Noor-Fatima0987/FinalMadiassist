import React, { useContext } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../store/context/UserContext';
import { moderateScale, platformFont } from '../../utils/responsive';

export default function ApprovalPendingScreen() {
  const { logout } = useContext(UserContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={moderateScale(60)} color="#fff" />
        </View>

        <Text style={styles.title}>Approval Pending</Text>
        
        <Text style={styles.description}>
          Your doctor account has been registered successfully.
        </Text>
        
        <Text style={styles.subDescription}>
          The administrator is currently verifying your profile and license information. Once approved, you will be able to access your dashboard. This usually takes less than 24 hours.
        </Text>

        <Pressable style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={moderateScale(20)} color="#180991ff" style={styles.logoutIcon} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: moderateScale(20),
    padding: moderateScale(30),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconCircle: {
    width: moderateScale(110),
    height: moderateScale(110),
    borderRadius: moderateScale(55),
    backgroundColor: '#180991ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: moderateScale(20),
    elevation: 3,
  },
  title: {
    fontSize: platformFont(moderateScale(24)),
    fontWeight: 'bold',
    color: '#180991ff',
    marginBottom: moderateScale(15),
    textAlign: 'center',
  },
  description: {
    fontSize: platformFont(moderateScale(16)),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: moderateScale(10),
    lineHeight: moderateScale(22),
  },
  subDescription: {
    fontSize: platformFont(moderateScale(14)),
    color: '#666',
    textAlign: 'center',
    marginBottom: moderateScale(30),
    lineHeight: moderateScale(20),
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#180991ff',
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(12),
    width: '100%',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: moderateScale(8),
  },
  logoutBtnText: {
    color: '#180991ff',
    fontWeight: 'bold',
    fontSize: platformFont(moderateScale(16)),
  },
});
