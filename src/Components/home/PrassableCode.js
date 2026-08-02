import { View, Text, StyleSheet, Pressable } from "react-native";
import { moderateScale, platformFont } from "../../utils/responsive";
import { useTheme } from "@shopify/restyle";

function PrassableCode({ children, onPress, textStyle, mainStyle }) {
  const { colors } = useTheme();

  return (
    <View style={mainStyle}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerStyle, styles.pressed]
            : styles.buttonInnerStyle
        }
        onPress={onPress}
      >
        <View style={[styles.buttonOuterStyle, mainStyle]}>
          <Text style={[styles.textStyle, { color: colors.white }, textStyle]}>{children}</Text>
        </View>
      </Pressable>
    </View>
  );
}

export default PrassableCode;

const styles = StyleSheet.create({
  buttonOuterStyle: {
    margin: moderateScale(10),
    overflow: "hidden",
  },
  buttonInnerStyle: {
    alignSelf: "center",
    elevation: 4,
  },
  textStyle: {
    fontSize: platformFont( moderateScale(18) ),
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});
