import { View, Text, StyleSheet, Platform } from "react-native";
import { platformFont, moderateScale } from "../../utils/responsive";

function Tittle({ children, customStyle }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, customStyle]}>{children}</Text>
    </View>
  );
}

export default Tittle;

const styles = StyleSheet.create({
  container: {
    flex:0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: platformFont( moderateScale(40) ),
    fontWeight: "bold",
    color: "#180991ff",
    textAlign: "center",
  },
});
