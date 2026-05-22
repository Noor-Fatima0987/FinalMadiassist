import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const BACKEND_URL = "http://192.168.1.6:5000";

function OurDoctorScreen() {
  const [dbDoctors, setDbDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
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
      }
    };
    fetchDoctors();
  }, []);

  return (
    <View style={{padding:15}}>
      <FlatList
        data={dbDoctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.spec}>{item.specialization}</Text>
              <Text style={styles.detail}>Email: {item.email}</Text>
            </View>
          </View>
        )}
      />
      </View>
  );
}

export default OurDoctorScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#180991ff",
    borderRadius: 15,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  info: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  spec: {
    fontSize: 16,
    color: "white",
  },
  detail: {
    fontSize: 14,
    color: "white",
  },
});

