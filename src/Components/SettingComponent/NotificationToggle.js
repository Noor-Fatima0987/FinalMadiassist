import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "@shopify/restyle";

export default function NotificationToggle({ enabled, onToggle }) {
  const { colors, borderRadii, spacing } = useTheme();
  const cardBg = colors.mainBackground === '#0F131A' ? '#171C24' : '#f2f1ff';

  return (
    <View
      style={{
        paddingVertical: 16,
        paddingHorizontal: 18,
        backgroundColor: cardBg,
        borderRadius: borderRadii.md,
        marginBottom: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, color: colors.primary, fontWeight: "600" }}>
        Notifications
      </Text>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}
