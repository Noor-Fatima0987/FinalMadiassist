import { View, Image, StyleSheet } from "react-native";
import PrassableCode from "../home/PrassableCode";
import { moderateScale } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

function Header({ navigation }) {
  const { colors } = useTheme();

  function handleSignUp() {
    navigation.navigate("Sign Up");
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/assets/MediAssistLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <PrassableCode
        textStyle={{
          color: colors.primary,
          borderBottomWidth: 2,
          borderBottomColor: colors.primary,
        }}
        mainStyle={{ margin: 0 }}
        onPress={handleSignUp}
      >
        Sign Up
      </PrassableCode>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: moderateScale(60),
    height: moderateScale(70),
  },
});
