import { View, Text, StyleSheet } from "react-native";
import { platformFont, moderateScale } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

function Tittle({ children, customStyle }) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.primary }, customStyle]}>{children}</Text>
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
    textAlign: "center",
  },
});
