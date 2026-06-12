import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "../../utils/responsive";

const BACKEND_URL = "https://mediassist-rho.vercel.app";

function OurDoctorScreen() {
  const [dbDoctors, setDbDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/api/doctors`);
        const data = await response.json();
        if (response.ok) {
          const formattedDoctors = data.map(doc => ({
            ...doc,
            specialization: doc.doctorProfile?.specialty || "General"
          }));
          setDbDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#180991ff" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dbDoctors}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatarContainer}>
              <Ionicons name="medical" size={24} color="white" />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.spec}>{item.specialization}</Text>
              {item.doctorProfile?.experience && (
                <Text style={styles.expText}>
                  Experience: {item.doctorProfile.experience} Years
                </Text>
              )}
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color="#ccc" style={{ marginRight: 6 }} />
                <Text style={styles.detail}>{item.email}</Text>
              </View>
              {item.contactNumber && (
                <View style={styles.detailRow}>
                  <Ionicons name="call-outline" size={14} color="#ccc" style={{ marginRight: 6 }} />
                  <Text style={styles.detail}>{item.contactNumber}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No registered doctors found.</Text>
          </View>
        }
      />
    </View>
  );
}

export default OurDoctorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FE",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  listContent: {
    padding: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#180991ff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  spec: {
    fontSize: 15,
    color: "#e0e0ff",
    fontWeight: "600",
    marginBottom: 4,
  },
  expText: {
    fontSize: 13,
    color: "#d0d0ff",
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  detail: {
    fontSize: 13,
    color: "#e0e0ff",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
});

