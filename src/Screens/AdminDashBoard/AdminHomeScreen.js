import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../store/context/UserContext';
import { moderateScale, platformFont } from '../../utils/responsive';

const BACKEND_URL = "https://mediassist-rho.vercel.app";

export default function AdminHomeScreen() {
  const { logout } = useContext(UserContext);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/pending-doctors`);
      const data = await response.json();
      if (response.ok) {
        setPendingDoctors(data);
      } else {
        console.error("Failed to fetch pending doctors:", data.error);
      }
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (doctorId, doctorName) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/approve-doctor/${doctorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", `Dr. ${doctorName} has been approved successfully!`);
        // Remove from local list
        setPendingDoctors(prev => prev.filter(doc => doc.id !== doctorId));
      } else {
        Alert.alert("Error", data.error || "Failed to approve doctor.");
      }
    } catch (error) {
      console.error("Approval API error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  const handleReject = (doctorId, doctorName) => {
    Alert.alert(
      "Reject Application",
      `Are you sure you want to reject and delete Dr. ${doctorName}'s request? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject & Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${BACKEND_URL}/api/admin/approve-doctor/${doctorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: false })
              });
              const data = await response.json();
              if (response.ok) {
                Alert.alert("Rejected", `Dr. ${doctorName}'s registration request has been deleted.`);
                setPendingDoctors(prev => prev.filter(doc => doc.id !== doctorId));
              } else {
                Alert.alert("Error", data.error || "Failed to reject doctor.");
              }
            } catch (error) {
              console.error("Rejection API error:", error);
              Alert.alert("Error", "Network error.");
            }
          }
        }
      ]
    );
  };

  const renderDoctorCard = ({ item }) => {
    const profile = item.doctorProfile || {};
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Ionicons name="medkit" size={24} color="#180991ff" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.docName}>{item.fullName}</Text>
            <Text style={styles.docSpecialty}>{profile.specialty}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>License: </Text>
            <Text style={styles.detailValue}>{profile.licenseNo || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="briefcase-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Experience: </Text>
            <Text style={styles.detailValue}>{profile.experience !== null ? `${profile.experience} years` : "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Email: </Text>
            <Text style={styles.detailValue}>{item.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Contact: </Text>
            <Text style={styles.detailValue}>{item.contactNumber || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>CNIC: </Text>
            <Text style={styles.detailValue}>{item.cnic || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="pin-outline" size={16} color="#666" style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Address: </Text>
            <Text style={styles.detailValue}>{item.address || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable 
            style={[styles.btn, styles.rejectBtn]} 
            onPress={() => handleReject(item.id, item.fullName)}
          >
            <Ionicons name="close-circle-outline" size={18} color="#d32f2f" style={{ marginRight: 4 }} />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </Pressable>

          <Pressable 
            style={[styles.btn, styles.approveBtn]} 
            onPress={() => handleApprove(item.id, item.fullName)}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.approveBtnText}>Approve</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title}>Admin Panel</Text>
          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#180991ff" />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>Verify and approve new doctor applications</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#180991ff" />
          <Text style={styles.loadingText}>Fetching doctor profiles...</Text>
        </View>
      ) : (
        <FlatList
          data={pendingDoctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorCard}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchPendingDoctors}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-done-circle-outline" size={64} color="green" />
              <Text style={styles.emptyText}>All Caught Up!</Text>
              <Text style={styles.emptySubtext}>There are no pending doctor registration requests.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  header: {
    padding: moderateScale(20),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: platformFont(moderateScale(24)),
    fontWeight: 'bold',
    color: '#180991ff',
  },
  subtitle: {
    fontSize: platformFont(moderateScale(14)),
    color: '#666',
    marginTop: moderateScale(4),
  },
  logoutBtn: {
    padding: moderateScale(8),
    backgroundColor: '#f0f4ff',
    borderRadius: moderateScale(10),
  },
  listContent: {
    padding: moderateScale(16),
    paddingBottom: moderateScale(30),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: moderateScale(12),
    flex: 1,
  },
  docName: {
    fontSize: platformFont(moderateScale(18)),
    fontWeight: 'bold',
    color: '#333',
  },
  docSpecialty: {
    fontSize: platformFont(moderateScale(14)),
    color: '#180991ff',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: moderateScale(12),
  },
  detailsContainer: {
    marginBottom: moderateScale(15),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(6),
  },
  detailIcon: {
    marginRight: moderateScale(8),
  },
  detailLabel: {
    fontSize: platformFont(moderateScale(13)),
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: platformFont(moderateScale(13)),
    color: '#333',
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(10),
    elevation: 1,
  },
  approveBtn: {
    backgroundColor: '#180991ff',
  },
  approveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: platformFont(moderateScale(14)),
  },
  rejectBtn: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  rejectBtnText: {
    color: '#d32f2f',
    fontWeight: 'bold',
    fontSize: platformFont(moderateScale(14)),
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: moderateScale(10),
    color: '#180991ff',
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(20),
  },
  emptyText: {
    fontSize: platformFont(moderateScale(20)),
    fontWeight: 'bold',
    color: '#333',
    marginTop: moderateScale(15),
  },
  emptySubtext: {
    fontSize: platformFont(moderateScale(14)),
    color: '#666',
    textAlign: 'center',
    marginTop: moderateScale(8),
  },
});
