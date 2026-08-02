import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";

export default function HeaderMenu({ navigation }) {
  const [showMenu, setShowMenu] = useState(false);
  const { colors, borderRadii, spacing } = useTheme();

  return (
    <View style={{ position: "relative" }}>
      {/* Three Dots Button */}
      <Pressable onPress={() => setShowMenu(!showMenu)}>
        <MaterialIcons name="more-vert" size={26} color={colors.primary} />
      </Pressable>

      {showMenu && (
        <View style={[styles.menu, {
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
          borderRadius: borderRadii.md,
          paddingVertical: spacing.sm,
        }]}>
          <Pressable
            onPress={() => {
              setShowMenu(false);
              navigation.navigate("Setting");
            }}
          >
            <Text style={[styles.menuItem, { color: colors.mainText }]}>Settings</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: "absolute",
    right: 0,
    top: 32,
    borderWidth: 1,
    elevation: 5,
    width: 130,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
});
