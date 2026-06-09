import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform, TextInput, Pressable, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InputField from "../../Components/SigiUpComponent/InputField";
import RoleSelector from "../../Components/SigiUpComponent/RoleSelector";
import GenderSelector from "../../Components/SigiUpComponent/GenderSelector";
import SubmitButton from "../../Components/SigiUpComponent/SubmitButton";
import SignInLink from "../../Components/SigiUpComponent/SignInLink";
import CountryCodePicker from "../../Components/SigiUpComponent/CountryCodePicker";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { UserContext } from "../../store/context/UserContext";
import { moderateScale, platformFont } from "../../utils/responsive";

const BACKEND_URL = "https://mediassist-rho.vercel.app";

export default function SignUpScreen({ navigation }) {
  const { saveUser } = useContext(UserContext);

  // General fields
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  // Phone selector state
  const [countryCode, setCountryCode] = useState("+92");
  const [contactNumber, setContactNumber] = useState("");

  // OTP Verification Modal State
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Role-specific fields
  const [specialization, setSpecialization] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [experience, setExperience] = useState("");
  const [age, setAge] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  // Step 1: Send OTP upon clicking "Create Account"
  const handleSendOtp = async () => {
    setOtpError("");
    setIsSendingOtp(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();
      if (response.ok) {
        setOtpModalVisible(true);
        alert("Verification code has been sent to your email!");
      } else {
        alert(result.error || "Failed to send verification code. Please check your email.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error sending OTP. Make sure your server is running.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP and then create both accounts (Firebase + DB)
  const handleVerifyOtpAndCreateAccount = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code");
      return;
    }

    setOtpError("");
    setIsVerifyingOtp(true);

    try {
      // 1. Verify OTP with Backend
      const verifyResponse = await fetch(`${BACKEND_URL}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: otp.trim() }),
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResponse.ok) {
        setOtpError(verifyResult.error || "Verification failed. Invalid code.");
        setIsVerifyingOtp(false);
        return;
      }

      // OTP is verified! Now create accounts
      let firebaseUser = null;
      try {
        // 2. Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;

        // 3. Create PostgreSQL User via Backend
        const cleanedPhone = contactNumber.replace(/^0/, "").trim();
        const response = await fetch(`${BACKEND_URL}/api/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firebaseId: firebaseUser.uid,
            email,
            fullName,
            role,
            specialization,
            experience,
            licenseNo,
            age,
            medicalHistory,
            gender,
            contactNumber: countryCode + cleanedPhone,
            cnic,
            address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setOtpModalVisible(false);
          alert("Account Created Successfully!");
          saveUser(result);
        } else {
          // Database error rollback
          if (firebaseUser) {
            await deleteUser(firebaseUser);
          }
          alert("Database registration error: " + result.error);
        }
      } catch (error) {
        console.error("Account Creation Fail:", error);
        // Rollback Firebase user if database registration failed
        if (firebaseUser) {
          try {
            await deleteUser(firebaseUser);
          } catch (delErr) {
            console.error("Rollback deleteUser error:", delErr);
          }
        }
        alert("Registration failed: " + error.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setOtpError("Network error. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleCreateAccountPress = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    // Email Validation
    if (!email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    }

    // Phone Validation with Country Code
    const cleanedPhone = contactNumber.replace(/^0/, "").trim();
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d+$/.test(cleanedPhone)) {
      newErrors.contactNumber = "Contact number must contain only digits";
    } else {
      if (countryCode === "+92") {
        if (cleanedPhone.length !== 10) {
          newErrors.contactNumber = "Number must be 10 digits after code (e.g. 3001234567)";
        }
      } else {
        if (cleanedPhone.length < 9 || cleanedPhone.length > 11) {
          newErrors.contactNumber = "Invalid phone number length";
        }
      }
    }

    if (!cnic.trim()) newErrors.cnic = "CNIC is required";
    else if (cnic.length !== 13) newErrors.cnic = "CNIC must be 13 digits";

    if (!role.trim()) newErrors.role = "Please select your role";
    if (!gender.trim()) newErrors.gender = "Please select your gender";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    if (!address.trim()) newErrors.address = "Address is required";

    // Role-specific validations
    if (role === "doctor") {
      if (!specialization.trim()) newErrors.specialization = "Specialization is required";
      
      if (!experience.trim()) {
        newErrors.experience = "Experience is required";
      } else if (isNaN(parseInt(experience)) || parseInt(experience) < 0) {
        newErrors.experience = "Experience must be a positive number";
      }

      if (!licenseNo.trim()) {
        newErrors.licenseNo = "License number is required";
      } else {
        const licenseRegex = /^\d{5}-?\d{2}$/;
        if (!licenseRegex.test(licenseNo.trim())) {
          newErrors.licenseNo = "License must be 7 digits (e.g., 12345-67 or 1234567)";
        }
      }
    } else if (role === "patient") {
      if (!age.trim()) {
        newErrors.age = "Age is required";
      } else if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
        newErrors.age = "Age must be a positive number";
      }
      if (!medicalHistory.trim()) newErrors.medicalHistory = "Medical history is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Form is valid! Now trigger the verification code
      handleSendOtp();
    }
  };

  const SignInHandler = () => {
    navigation.navigate("Sign In");
  };

  // Build form fields dynamically
  let formFields = [
    { id: "fullName", label: "Full Name", value: fullName, onChange: setFullName, placeholder: "Enter your full name", required: true },
    { id: "userName", label: "Username", value: userName, onChange: setUserName, placeholder: "Enter your username" },
    { id: "email", label: "Email", value: email, onChange: setEmail, placeholder: "Enter your email", required: true, keyboardType: "email-address" },
    { id: "contactNumber", label: "Contact Number", value: contactNumber, onChange: setContactNumber, required: true },
    { id: "gender", label: "Gender", value: gender, onChange: setGender, required: true, type: "gender" },
    { id: "role", label: "Select Role", value: role, onChange: setRole, required: true, type: "role" },
    { id: "cnic", label: "CNIC", value: cnic, onChange: setCnic, placeholder: "Enter your CNIC (without dashes)", required: true, keyboardType: "numeric", maxLength: 13 },
    { id: "address", label: "Address", value: address, onChange: setAddress, placeholder: "Enter your address", required: true, multiline: true },
    { id: "password", label: "Password", value: password, onChange: setPassword, placeholder: "Enter your password", required: true, secureTextEntry: true },
    { id: "confirmPassword", label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, placeholder: "Re-enter your password", required: true, secureTextEntry: true },
  ];

  // Role-specific fields insertion
  if (role === "doctor") {
    const doctorFields = [
      { id: "specialization", label: "Specialization", value: specialization, onChange: setSpecialization, placeholder: "Enter your specialization", required: true },
      { id: "experience", label: "Experience (Years)", value: experience, onChange: setExperience, placeholder: "e.g., 5", required: true, keyboardType: "numeric" },
      { id: "licenseNo", label: "License Number", value: licenseNo, onChange: setLicenseNo, placeholder: "License (e.g. 12345-67)", required: true, maxLength: 15 },
    ];
    formFields.splice(6, 0, ...doctorFields);
  } else if (role === "patient") {
    const patientFields = [
      { id: "age", label: "Age", value: age, onChange: setAge, placeholder: "Enter your age", required: true, keyboardType: "numeric" },
      { id: "medicalHistory", label: "Medical History", value: medicalHistory, onChange: setMedicalHistory, placeholder: "Enter your medical history", required: true, multiline: true },
    ];
    formFields.splice(6, 0, ...patientFields);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f4f7fe" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(50) : moderateScale(50)}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        {/* Loading Indicator when sending OTP initially */}
        {isSendingOtp && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#180991ff" />
            <Text style={styles.loadingText}>Sending OTP code...</Text>
          </View>
        )}

        <FlatList
          data={formFields}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "role") return <RoleSelector role={role} setRole={setRole} error={errors.role} />;
            if (item.type === "gender") return <GenderSelector gender={gender} setGender={setGender} error={errors.gender} />;

            // Custom phone number input field with country code picker
            if (item.id === "contactNumber") {
              return (
                <View style={styles.fieldContainer}>
                  <Text style={styles.fieldLabel}>
                    Contact Number <Text style={{ color: "red" }}>*</Text>
                  </Text>
                  <View style={styles.phoneRow}>
                    <CountryCodePicker selectedValue={countryCode} onValueChange={setCountryCode} />
                    <View style={styles.phoneInputWrapper}>
                      <TextInput
                        placeholder="3001234567"
                        placeholderTextColor="#2c1ca4ff"
                        style={styles.phoneInput}
                        value={contactNumber}
                        onChangeText={setContactNumber}
                        keyboardType="numeric"
                        maxLength={11}
                      />
                    </View>
                  </View>
                  {errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}
                </View>
              );
            }

            return (
              <InputField
                key={item.id}
                label={item.label}
                value={item.value}
                onChange={item.onChange}
                placeholder={item.placeholder}
                required={item.required}
                secureTextEntry={item.secureTextEntry}
                error={errors[item.id]}
                keyboardType={item.keyboardType}
                maxLength={item.maxLength}
                multiline={item.multiline}
              />
            );
          }}
          ListFooterComponent={
            <>
              <SignInLink navigation={navigation} onPress={SignInHandler} />
              <SubmitButton title="Create Account" onPress={handleCreateAccountPress} />
            </>
          }
        />
      </View>

      {/* OTP Verification Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconCircle}>
                <Ionicons name="mail-open-outline" size={moderateScale(32)} color="#fff" />
              </View>
              <Text style={styles.modalTitle}>Verification Required</Text>
              <Text style={styles.modalSubtitle}>We sent a 6-digit OTP code to:</Text>
              <Text style={styles.modalEmail}>{email}</Text>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                placeholder="Enter 6-digit code"
                placeholderTextColor="#9fa8da"
                style={styles.otpInput}
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              {otpError ? <Text style={styles.otpModalError}>{otpError}</Text> : null}
            </View>

            <View style={styles.modalActions}>
              <Pressable 
                style={[styles.modalBtn, styles.modalVerifyBtn, isVerifyingOtp && styles.disabledBtn]} 
                onPress={handleVerifyOtpAndCreateAccount}
                disabled={isVerifyingOtp}
              >
                {isVerifyingOtp ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalVerifyText}>Verify & Create Account</Text>
                )}
              </Pressable>

              <View style={styles.modalTextActions}>
                <Pressable onPress={handleSendOtp} disabled={isSendingOtp} style={styles.modalTextBtn}>
                  <Text style={styles.modalResendText}>Resend Code</Text>
                </Pressable>
                
                <Pressable onPress={() => setOtpModalVisible(false)} style={styles.modalTextBtn}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(20) },
  title: { fontSize: platformFont(moderateScale(28)), fontWeight: "bold", color: "#180991ff", textAlign: "center", marginBottom: moderateScale(20) },
  
  // Custom Styles
  fieldContainer: { marginBottom: moderateScale(15) },
  fieldLabel: { fontSize: platformFont(moderateScale(16)), color: "#180991ff", marginBottom: moderateScale(5), fontWeight: "500" },
  
  // Phone styles
  phoneRow: { flexDirection: "row", alignItems: "center" },
  phoneInputWrapper: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: moderateScale(10), backgroundColor: "#fff" },
  phoneInput: { paddingVertical: moderateScale(12), paddingHorizontal: moderateScale(12), fontSize: platformFont(moderateScale(16)), color: "#180991ff" },
  errorText: { color: "red", fontSize: platformFont(moderateScale(13)), marginTop: moderateScale(4) },

  // Loading overlay
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  loadingText: {
    marginTop: moderateScale(10),
    color: '#180991ff',
    fontWeight: 'bold',
    fontSize: platformFont(moderateScale(16))
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: moderateScale(20),
    padding: moderateScale(25),
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: "#180991ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(15)
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: moderateScale(20)
  },
  modalTitle: {
    fontSize: platformFont(moderateScale(20)),
    fontWeight: "bold",
    color: "#180991ff",
    marginBottom: moderateScale(8)
  },
  modalSubtitle: {
    fontSize: platformFont(moderateScale(14)),
    color: "#666",
    textAlign: "center"
  },
  modalEmail: {
    fontSize: platformFont(moderateScale(15)),
    fontWeight: "bold",
    color: "#180991ff",
    marginTop: moderateScale(2),
    textAlign: "center"
  },
  modalBody: {
    width: "100%",
    marginBottom: moderateScale(20),
    alignItems: "center"
  },
  otpInput: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#180991ff",
    borderRadius: moderateScale(12),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(15),
    fontSize: platformFont(moderateScale(20)),
    fontWeight: "bold",
    color: "#180991ff",
    textAlign: "center",
    letterSpacing: moderateScale(5),
    backgroundColor: "#f4f7fe"
  },
  otpModalError: {
    color: "red",
    fontSize: platformFont(moderateScale(13)),
    marginTop: moderateScale(6),
    textAlign: "center"
  },
  modalActions: {
    width: "100%"
  },
  modalBtn: {
    width: "100%",
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center"
  },
  modalVerifyBtn: {
    backgroundColor: "#180991ff"
  },
  disabledBtn: {
    backgroundColor: "#9fa8da"
  },
  modalVerifyText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: platformFont(moderateScale(15))
  },
  modalTextActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: moderateScale(15),
    paddingHorizontal: moderateScale(10)
  },
  modalTextBtn: {
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(10)
  },
  modalResendText: {
    color: "#4C39DB",
    fontWeight: "bold",
    fontSize: platformFont(moderateScale(14))
  },
  modalCancelText: {
    color: "#d32f2f",
    fontWeight: "bold",
    fontSize: platformFont(moderateScale(14))
  }
});
