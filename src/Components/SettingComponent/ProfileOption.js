import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "@shopify/restyle";

export default function ProfileOption({ onPress }) {
  const { colors, borderRadii, spacing } = useTheme();
  const cardBg = colors.mainBackground === '#0F131A' ? '#171C24' : '#f2f1ff';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: cardBg,
        borderRadius: borderRadii.md,
        marginBottom: spacing.md,
        paddingVertical: 16,
        paddingHorizontal: 18,
        opacity: pressed ? 0.88 : 1,
      })}
    >
      <Text style={{ fontSize: 18, color: colors.primary, fontWeight: "600" }}>
        Profile
      </Text>
    </Pressable>
  );
}
