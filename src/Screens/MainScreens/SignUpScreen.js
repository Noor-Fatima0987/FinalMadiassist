import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import InputField from "../../Components/SigiUpComponent/InputField";
import RoleSelector from "../../Components/SigiUpComponent/RoleSelector";
import SubmitButton from "../../Components/SigiUpComponent/SubmitButton";
import SignInLink from "../../Components/SigiUpComponent/SignInLink";
import { UserContext } from "../../store/context/UserContext";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function SignUpScreen({ navigation }) {
  const { saveUser } = useContext(UserContext);

  // State variables
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
  const [specialization, setSpecialization] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [age, setAge] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [errors, setErrors] = useState({});

  // Handle account creation
  function SignInHandler(){
     navigation.navigate("Sign In");
  }
  
  const handleCreateAccount = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) newErrors.email = "Invalid email format";
    }

    if (!contactNumber.trim()) newErrors.contactNumber = "Contact number is required";
    else if (contactNumber.length !== 11) newErrors.contactNumber = "Contact number must be 11 digits";

    if (!cnic.trim()) newErrors.cnic = "CNIC is required";
    else if (cnic.length !== 13) newErrors.cnic = "CNIC must be 13 digits";

    if (!role.trim()) newErrors.role = "Please select your role";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);

    // if (Object.keys(newErrors).length === 0) {
    //   const userData = { fullName, userName, gender, role, cnic, contactNumber, address, password, specialization, licenseNo, age, medicalHistory };
    //   saveUser(userData);
    //   if (role === "doctor") navigation.navigate("Main Doctor");
    //   else navigation.navigate("Main Patient");
    // }
    if (Object.keys(newErrors).length === 0) {
       let userData = {
         fullName,
         userName,
         gender,
         email,
         role,
         cnic,
         contactNumber,
         address,
         password,
       };
      if (role === "doctor") {
       userData.specialization = specialization;
       userData.licenseNo = licenseNo;
      } 
      else if (role === "patient") {
        userData.age = age;
        userData.medicalHistory = medicalHistory;
      }

      saveUser(userData);

      if (role === "doctor") navigation.navigate("Main Doctor");
      else navigation.navigate("Main Patient");
   }

  };

  // Build form fields dynamically
  let formFields = [
    { id: "fullName", label: "Full Name", value: fullName, onChange: setFullName, placeholder: "Enter your full name", required: true },
    { id: "userName", label: "Username", value: userName, onChange: setUserName, placeholder: "Enter your username" },
    { id: "email", label: "Email", value: email, onChange: setEmail, placeholder: "Enter your email", required: true, keyboardType: "email-address" },
    { id: "contactNumber", label: "Contact Number", value: contactNumber, onChange: setContactNumber, placeholder: "Enter your contact number", required: true, keyboardType: "numeric" },
    { id: "gender", label: "Gender", value: gender, onChange: setGender, placeholder: "Enter your gender" },
    { id: "role", label: "Select Role", value: role, onChange: setRole, required: true, type: "role" },
    { id: "cnic", label: "CNIC", value: cnic, onChange: setCnic, placeholder: "Enter your CNIC (without dashes)", required: true, keyboardType: "numeric" },
    { id: "address", label: "Address", value: address, onChange: setAddress, placeholder: "Enter your address", required: true, multiline: true },
    { id: "password", label: "Password", value: password, onChange: setPassword, placeholder: "Enter your password", required: true, secureTextEntry: true },
    { id: "confirmPassword", label: "Confirm Password", value: confirmPassword, onChange: setConfirmPassword, placeholder: "Re-enter your password", required: true, secureTextEntry: true },
  ];

  // Role-specific fields insert immediately after role
  if (role === "doctor") {
    const doctorFields = [
      { id: "specialization", label: "Specialization", value: specialization, onChange: setSpecialization, placeholder: "Enter your specialization", required: true },
      { id: "licenseNo", label: "License Number", value: licenseNo, onChange: setLicenseNo, placeholder: "Enter your license number", required: true }
    ];
    formFields.splice(5, 0, ...doctorFields);
  } else if (role === "patient") {
    const patientFields = [
      { id: "age", label: "Age", value: age, onChange: setAge, placeholder: "Enter your age", required: true },
      { id: "medicalHistory", label: "Medical History", value: medicalHistory, onChange: setMedicalHistory, placeholder: "Enter your medical history", required: true, multiline: true }
    ];
    formFields.splice(5, 0, ...patientFields);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <FlatList
        data={formFields}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "role") return <RoleSelector role={role} setRole={setRole} error={errors.role} />;
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
            />
          );
        }}
        ListFooterComponent={
          <>
            <SignInLink navigation={navigation} onPress={SignInHandler}/>
            <SubmitButton title="Create Account" onPress={handleCreateAccount} />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(20) },
  title: { fontSize: platformFont(moderateScale(28)), fontWeight: "bold", color: "#180991ff", textAlign: "center", marginBottom: moderateScale(20) }
});
