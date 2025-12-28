import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { doctorData } from '../../Data/DoctorData'

function OurDoctorScreen() {
  return (
    <View style={{padding:15}}>
      <FlatList
        data={doctorData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.spec}>{item.specialization}</Text>
              <Text style={styles.detail}>Experience: {item.experience}</Text>
              <Text style={styles.detail}>Contact: {item.contact}</Text>
              <Text style={styles.detail}>Location: {item.location}</Text>
              <Text style={styles.detail}>Available: {item.availableTime}</Text>
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

