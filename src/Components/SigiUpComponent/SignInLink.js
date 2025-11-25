import React from "react";
import { Text } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

export default function SignInLink({ onPress }) {
  return (
    <Text style={{ textAlign: "center", marginTop: moderateScale(10), fontSize: platformFont(moderateScale(15)), color: "#333" }}>
      You already have an account?{" "}
      <Text style={{ color: "#180991ff", fontWeight: "bold" }} onPress={onPress}>
        (Sign In)
      </Text>
    </Text>
  );
}
