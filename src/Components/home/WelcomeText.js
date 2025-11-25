import { View, StyleSheet } from "react-native";
import Tittle from "../home/Tittle";

function WelcomeText() {
  return (
    <View style={styles.container}>
      <Tittle> MadiAssist </Tittle>
      <Tittle customStyle={{ fontSize: 35 }}>Welcome!</Tittle>
    </View>
  );
}

export default WelcomeText;

const styles = StyleSheet.create({
  container: {
    flex:0.2,
    alignItems: "center",
    marginVertical: 10,
  },
});
