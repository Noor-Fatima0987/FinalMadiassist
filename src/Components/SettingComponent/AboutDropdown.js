import React, { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { useTheme } from "@shopify/restyle";

export default function AboutDropdown() {
  const [open, setOpen] = useState(false);
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
      }}
    >
      <Pressable
        onPress={() => setOpen(!open)}
        style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
      >
        <Text style={{ fontSize: 18, color: colors.primary, fontWeight: "600" }}>
          About Us
        </Text>
        <Text style={{ fontSize: 18, color: colors.mutedIcon, fontWeight: "600" }}>
          {open ? "⌃" : "⌄"}
        </Text>
      </Pressable>
      {open && (
        <Text style={{ marginTop: 10, fontSize: 14, color: colors.secondaryText, lineHeight: 20 }}>
          MediAssist helps you manage appointments, medical records, reminders,
          and connect with doctors easily & securely.
        </Text>
      )}
    </View>
  );
}
