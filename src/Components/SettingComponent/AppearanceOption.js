import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

function getAppearanceDetails(mode) {
  if (mode === 'dark') {
    return { label: 'Dark', subtitle: 'Always use dark colors' };
  }

  if (mode === 'light') {
    return { label: 'Light', subtitle: 'Always use light colors' };
  }

  return { label: 'Automatic', subtitle: 'Follow your device setting' };
}

export default function AppearanceOption({ onPress, mode = 'system' }) {
  const { colors, borderRadii, spacing } = useTheme();
  const { subtitle } = getAppearanceDetails(mode);
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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={{ fontSize: 18, color: colors.primary, fontWeight: '600' }}>
            Appearance
          </Text>
          <Text style={{ marginTop: 4, fontSize: 14, color: colors.secondaryText }}>
            {subtitle}
          </Text>
        </View>
        <Text style={{ fontSize: 18, color: colors.mutedIcon, fontWeight: '700' }}>
          ›
        </Text>
      </View>
    </Pressable>
  );
}
