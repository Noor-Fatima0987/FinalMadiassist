import { View, Text, StyleSheet } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";

function Description() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        MediAssist is a smart and reliable healthcare platform designed to
        connect patients and doctors seamlessly. Manage appointments, access
        medical records, receive prescriptions, and stay updated with your
        health—all in one simple and secure app.
      </Text>
    </View>
  );
}

export default Description;

const styles = StyleSheet.create({
  container: {
    flex: 0.4,
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(15),
  },
  text: {
    fontSize: platformFont(moderateScale(18)), // responsive font
    textAlign: "center",
    color: "#2c1ca4ff",
    lineHeight: moderateScale(25), // readable line height
  },
});
