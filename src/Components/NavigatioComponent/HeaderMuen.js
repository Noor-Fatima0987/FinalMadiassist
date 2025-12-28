import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HeaderMenu({ navigation }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={{ position: "relative" }}>
      {/* Three Dots Button */}
      <Pressable onPress={() => setShowMenu(!showMenu)}>
        <MaterialIcons name="more-vert" size={26} color="#180991ff" />
      </Pressable>

      {showMenu && (
        <View style={styles.menu}>
          <Pressable
            onPress={() => {
              setShowMenu(false);
              navigation.navigate("Setting");
            }}
          >
            <Text style={styles.menuItem}>Settings</Text>
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
    backgroundColor: "#fff",
    elevation: 5,
    paddingVertical: 10,
    borderRadius: 8,
    width: 130,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
});
