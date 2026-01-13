import React, { useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import InputField from "../../Components/SigiUpComponent/InputField";
import RoleSelector from "../../Components/SigiUpComponent/RoleSelector";
import SubmitButton from "../../Components/SigiUpComponent/SubmitButton";
import SignUpLink from "../../Components/SigiUpComponent/SignInLink";
import { UserContext } from "../../store/context/UserContext";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function SignInScreen({ navigation }) {
  const { saveUser } = useContext(UserContext);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  function SignUpHandler() {
    navigation.navigate("Sign Up");
  }

  const handleLogin = () => {
    const newErrors = {};

    if (!userName.trim()) newErrors.userName = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!role.trim()) newErrors.role = "Please select your role";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Save login info to context
      saveUser({ userName, role });
      if (role === "doctor") navigation.navigate("Main Doctor");
      else navigation.navigate("Main Patient");
    }
  };

  const formFields = [
    { key: "userName", label: "Username", value: userName, onChange: setUserName, placeholder: "Enter your username", required: true },
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
            if (item.type === "role") return <RoleSelector role={role} setRole={setRole} error={errors.role} />;
            return <InputField {...item} error={errors[item.key]} />;
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
