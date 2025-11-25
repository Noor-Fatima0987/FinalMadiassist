import React from "react";
import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function RoleSelector({ role, setRole, error }) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Select Role
        <Text style={styles.required}> *</Text>
      </Text>
      <Pressable style={styles.roleBox} onPress={() => setModalVisible(true)}>
        <Text style={styles.roleText}>
          {role ? role.charAt(0).toUpperCase() + role.slice(1) : "Choose Role"}
        </Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={modalVisible} transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Your Role</Text>
            <Pressable style={styles.option} onPress={() => handleSelectRole("doctor")}>
              <Text style={styles.optionText}>Doctor</Text>
            </Pressable>
            <Pressable style={styles.option} onPress={() => handleSelectRole("patient")}>
              <Text style={styles.optionText}>Patient</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: moderateScale(15) },
  label: { fontSize: platformFont(moderateScale(16)), color: "#180991ff", marginBottom: moderateScale(5), fontWeight: "500" },
  required: { color: "red" },
  roleBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(10), padding: moderateScale(12) },
  roleText: { fontSize: platformFont(moderateScale(16)), color: "#001F87" },
  error: { color: "red", fontSize: platformFont(moderateScale(13)), marginTop: moderateScale(4) },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContainer: { width: "80%", backgroundColor: "white", borderRadius: moderateScale(15), padding: moderateScale(20), alignItems: "center", elevation: 5 },
  modalTitle: { fontSize: platformFont(moderateScale(18)), fontWeight: "bold", color: "#001F87", marginBottom: moderateScale(10) },
  option: { paddingVertical: moderateScale(12), width: "100%", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: platformFont(moderateScale(16)), color: "#333" },
  cancelButton: { marginTop: moderateScale(10), paddingVertical: moderateScale(10), alignItems: "center" },
  cancelText: { color: "red", fontWeight: "bold" },
});
