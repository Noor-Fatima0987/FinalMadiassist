import { View, StyleSheet } from "react-native";
import Header from "../../Components/home/Header";
import WelcomeText from "../../Components/home/WelcomeText";
import Description from "../../Components/home/Description";
import ActionButtons from "../../Components/home/ActionButtons";
import { moderateScale } from "../../utils/responsive";

function MainScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <WelcomeText />
      <Description />
      <ActionButtons navigation={navigation} />
    </View>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(25),
  },
});
