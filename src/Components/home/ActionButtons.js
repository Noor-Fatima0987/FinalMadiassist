import { View, StyleSheet } from "react-native";
import PrassableCode from "../home/PrassableCode";
import { moderateScale } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

function ActionButtons({ navigation }) {
  const { colors } = useTheme();

  function handleOurDoctor() {
    navigation.navigate("Our Doctor");
  }

  function handleBook() {
    navigation.navigate("Sign Up");
  }

  return (
    <View style={styles.container}>
      <View style={[styles.btn, { backgroundColor: colors.primary }]}>
        <PrassableCode onPress={handleOurDoctor}>
          Our Doctors
        </PrassableCode>
      </View>

      <View style={[styles.btn, { backgroundColor: colors.primary }]}>
        <PrassableCode onPress={handleBook}>
          Book Appointment
        </PrassableCode>
      </View>
    </View>
  );
}

export default ActionButtons;

const styles = StyleSheet.create({
  container: {
    flex:0.2,
    marginTop: 20,
  },
  btn: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
    borderRadius: 12,
    marginVertical: 10,
    alignSelf: "center",
    elevation: 6,
  },
});
