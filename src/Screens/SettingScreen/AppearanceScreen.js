import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Box, Text, useThemeMode } from '../../theme';

const OPTIONS = [
  {
    value: 'dark',
    label: 'Dark',
    subtitle: 'Always use dark colors',
    icon: 'moon-outline',
  },
  {
    value: 'light',
    label: 'Light',
    subtitle: 'Always use light colors',
    icon: 'sunny-outline',
  },
  {
    value: 'system',
    label: 'Automatic',
    subtitle: 'Follow your device setting',
    icon: 'phone-portrait-outline',
  },
];

function AppearanceCard({ option, selected, onPress }) {
  const { colors, borderRadii, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: selected ? colors.selectionBackground : colors.cardBackground,
        borderColor: selected ? colors.selectionBorder : colors.border,
        borderRadius: borderRadii.xl,
        borderWidth: 0,
        marginBottom: spacing.lg,
        padding: spacing.lg,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: borderRadii.lg,
            borderWidth: 1,
            borderColor: selected ? colors.accent : colors.border,
            backgroundColor: selected ? colors.primarySoft : colors.surfaceBackground,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.lg,
          }}
        >
          <Ionicons
            name={option.icon}
            size={26}
            color={selected ? colors.accent : colors.mutedIcon}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: selected ? colors.accent : colors.mainText }}>
            {option.label}
          </Text>
          <Text style={{ marginTop: 3, fontSize: 12, color: colors.secondaryText }}>
            {option.subtitle}
          </Text>
        </View>

        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: selected ? colors.accent : colors.radioOutline,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected ? (
            <Ionicons name="checkmark" size={20} color={colors.accent} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export default function AppearanceScreen({ navigation }) {
  const { colors, spacing } = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <Box flex={1} backgroundColor="mainBackground" paddingHorizontal="xl" paddingTop="md">
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Ionicons name="chevron-back" size={30} color={colors.accent} />
        </Pressable>

        <Text style={{ fontSize: 32, lineHeight: 38, fontWeight: '800', color: colors.mainText }}>
          Appearance
        </Text>
        <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 20, color: colors.secondaryText }}>
          Choose how the app should look and behave.
        </Text>

        <View style={{ marginTop: 24 }}>
          {OPTIONS.map(option => (
            <AppearanceCard
              key={option.value}
              option={option}
              selected={mode === option.value}
              onPress={() => setMode(option.value)}
            />
          ))}
        </View>
      </Box>
    </SafeAreaView>
  );
}
