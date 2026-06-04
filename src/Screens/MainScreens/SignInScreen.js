import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import InputField from "../../Components/SigiUpComponent/InputField";
import RoleSelector from "../../Components/SigiUpComponent/RoleSelector";
import SubmitButton from "../../Components/SigiUpComponent/SubmitButton";
import SignUpLink from "../../Components/SigiUpComponent/SignInLink";
import { auth } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from "../../store/context/UserContext";
import { moderateScale, platformFont } from "../../utils/responsive";

const BACKEND_URL = "https://mediassist-rho.vercel.app"; // Localtunnel URL

export default function SignInScreen({ navigation }) {
  const { saveUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  function SignUpHandler() {
    navigation.navigate("Sign Up");
  }

  const handleLogin = async () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!role.trim()) newErrors.role = "Please select your role";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        // 1. Firebase Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // 2. Fetch User Profile from Backend (PostgreSQL)
        const response = await fetch(`${BACKEND_URL}/api/user/${firebaseUser.uid}`);
        const result = await response.json();

        if (response.ok) {
          // Check if the role matches
          if (result.role.toLowerCase() !== role.toLowerCase()) {
            alert(`You are registered as a ${result.role}, not a ${role}.`);
            return;
          }

          saveUser(result);
          // Conditional rendering in Navigation.js handles the screen switch automatically.
        } else {
          alert("Error: " + result.error);
        }

      } catch (error) {
        console.error(error);
        alert("Login Error: " + error.message);
      }
    }
  };

  const formFields = [
    { key: "email", label: "Email", value: email, onChange: setEmail, placeholder: "Enter your email", required: true, keyboardType: "email-address" },
    { key: "password", label: "Password", value: password, onChange: setPassword, placeholder: "Enter your password", required: true, secureTextEntry: true },
    { key: "role", label: "Select Role", value: role, onChange: setRole, required: true, type: "role" },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? moderateScale(50) : moderateScale(50)}
    >
      <View style={styles.container}>
        {/* <Text style={styles.title}>Sign In</Text> */}
        <FlatList
          data={formFields}
          keyExtractor={(item) => item.key}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const { key, type, ...restProps } = item;
            if (type === "role") return <RoleSelector role={role} setRole={setRole} error={errors.role} />;
            return <InputField key={key} {...restProps} error={errors[key]} />;
          }}
          ListFooterComponent={
            <>
              <SignUpLink navigation={navigation} onPress={SignUpHandler} />
              <SubmitButton title="Sign In" onPress={handleLogin} />
            </>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: moderateScale(20) },
  title: { fontSize: platformFont(moderateScale(28)), fontWeight: "bold", color: "#180991ff", textAlign: "center", marginBottom: moderateScale(20) }
});
