import { View, Image, StyleSheet } from "react-native";
import PrassableCode from "../home/PrassableCode";
import { moderateScale } from "../../utils/responsive";

function Header({ navigation }) {

  function handleSignUp() {
    navigation.navigate("Sign Up");
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/madiassist.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <PrassableCode
        textStyle={{
          color: "#180991ff",
          borderBottomWidth: 2,
          borderBottomColor: "#180991ff",
        }}
        mainStyle={{ margin: 0 }}
        onPress={handleSignUp}
      >
        SignUp
      </PrassableCode>
    </View>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    flex:0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: moderateScale(60),
    height: moderateScale(70),
  },
});
