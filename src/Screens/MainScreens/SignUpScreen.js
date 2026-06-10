import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import InputField from "../../Components/SigiUpComponent/InputField";
import RoleSelector from "../../Components/SigiUpComponent/RoleSelector";
import GenderSelector from "../../Components/SigiUpComponent/GenderSelector";
import SubmitButton from "../../Components/SigiUpComponent/SubmitButton";
import SignInLink from "../../Components/SigiUpComponent/SignInLink";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { UserContext } from "../../store/context/UserContext";
import { moderateScale, platformFont } from "../../utils/responsive";

const BACKEND_URL = "https://mediassist-rho.vercel.app";

export default function SignUpScreen({ navigation }) {
  const { saveUser } = useContext(UserContext);

  // Form states
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cnic, setCnic] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);

  // Role-specific fields
  const [specialization, setSpecialization] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [experience, setExperience] = useState("");
  const [age, setAge] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  const SignInHandler = () => {
    if (isRegistering) return;
    navigation.navigate("Sign In");
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: "", color: "" };
    if (pass.length < 6) return { label: "Weak (Minimum 6 characters)", color: "red" };
    
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasMixedCase = /[a-z]/.test(pass) && /[A-Z]/.test(pass);
    
    if (pass.length >= 8 && hasNumber && hasSpecialChar && hasMixedCase) {
      return { label: "Strong", color: "green" };
    }
    
    return { label: "Medium", color: "orange" };
  };

  const handleCreateAccount = async () => {
    if (isRegistering) return;
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    // Email Check
    if (!email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    }

    // Phone Check (Original 11-digit check)
    if (!contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (contactNumber.length !== 11) {
      newErrors.contactNumber = "Contact number must be 11 digits";
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
      let firebaseUser = null;
      setIsRegistering(true);
      try {
        // 1. Firebase Auth mein user create karo
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;

        // 2. Humare Backend Server (PostgreSQL) ko data bhejo
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
            contactNumber,
            cnic,
            address,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Account Created Successfully!");
          saveUser(result);
        } else {
          // Database error rollback: Delete the Firebase Auth user if DB save fails
          if (firebaseUser) {
            await deleteUser(firebaseUser);
          }
          alert("Database error: " + result.error);
        }
      } catch (error) {
        console.error("Signup Flow Error:", error);
        // Rollback Firebase user if DB signup failed
        if (firebaseUser) {
          try {
            await deleteUser(firebaseUser);
          } catch (delErr) {
            console.error("Error deleting Firebase user during rollback:", delErr);
          }
        }
        alert("Registration Error: " + error.message);
      } finally {
        setIsRegistering(false);
      }
    }
  };

  // Build form fields dynamically
  let formFields = [
    { id: "fullName", label: "Full Name", value: fullName, onChange: setFullName, placeholder: "Enter your full name", required: true },
    { id: "userName", label: "Username", value: userName, onChange: setUserName, placeholder: "Enter your username" },
    { id: "email", label: "Email", value: email, onChange: setEmail, placeholder: "Enter your email", required: true, keyboardType: "email-address" },
    { id: "contactNumber", label: "Contact Number", value: contactNumber, onChange: setContactNumber, placeholder: "Enter your contact number", required: true, keyboardType: "numeric", maxLength: 11 },
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(50) : moderateScale(50)}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <FlatList
          data={formFields}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "role") return <RoleSelector role={role} setRole={setRole} error={errors.role} />;
            if (item.type === "gender") return <GenderSelector gender={gender} setGender={setGender} error={errors.gender} />;

            return (
              <View style={styles.fieldContainer}>
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
                {item.id === "password" && password.length > 0 && (
                  <Text style={[styles.strengthText, { color: getPasswordStrength(password).color }]}>
                    Password Strength: {getPasswordStrength(password).label}
                  </Text>
                )}
              </View>
            );
          }}
          ListFooterComponent={
            <>
              <SignInLink navigation={navigation} onPress={SignInHandler} />
              <SubmitButton title="Create Account" onPress={handleCreateAccount} isLoading={isRegistering} />
            </>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(20) },
  title: { fontSize: platformFont(moderateScale(28)), fontWeight: "bold", color: "#180991ff", textAlign: "center", marginBottom: moderateScale(20) },
  fieldContainer: { width: "100%" },
  strengthText: {
    fontSize: platformFont(moderateScale(13)),
    fontWeight: "600",
    marginTop: moderateScale(-10),
    marginBottom: moderateScale(15),
    marginLeft: moderateScale(4)
  }
});
