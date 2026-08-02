import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@shopify/restyle";

export default function LogoutButton({ onPress }) {
  const { colors, borderRadii, spacing } = useTheme();
  const buttonBg = colors.mainBackground === '#0F131A' ? colors.primary : '#180991ff';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 15,
        backgroundColor: buttonBg,
        borderRadius: borderRadii.md,
        marginTop: spacing.xs,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Text
        style={{
          color: colors.white,
          fontSize: 18,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        Logout
      </Text>
    </Pressable>
  );
}
