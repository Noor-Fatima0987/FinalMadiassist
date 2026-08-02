import { createBox, createText, createTheme } from '@shopify/restyle';

const sharedColors = {
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

const lightColors = {
  mainBackground: '#F6F8FC',
  cardBackground: '#FFFFFF',
  surfaceBackground: '#EDF4FF',
  mainText: '#111827',
  secondaryText: '#6B7280',
  border: '#D7DFEA',
  primary: '#180991',
  primarySoft: '#EAF2FF',
  primaryTint: '#D9EFFF',
  accent: '#2EA3B6',
  accentSoft: '#E8F9FC',
  icon: '#4B5563',
  mutedIcon: '#9CA3AF',
  danger: '#E75A5A',
  success: '#2A9D8F',
  radioOutline: '#C7CCD6',
  radioFill: '#2EA3B6',
  selectionBackground: '#E9F9FB',
  selectionBorder: '#A9E1E8',
  shadow: '#DCE4F2',
  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#667085',
  tabBarActive: '#180991',
  ...sharedColors,
};

const darkColors = {
  mainBackground: '#0F131A',
  cardBackground: '#171C24',
  surfaceBackground: '#1E2430',
  mainText: '#F8FAFC',
  secondaryText: '#B3BBC8',
  border: '#2A3140',
  primary: '#7DD3FC',
  primarySoft: '#123347',
  primaryTint: '#10324A',
  accent: '#5BC0DE',
  accentSoft: '#102B33',
  icon: '#CBD5E1',
  mutedIcon: '#64748B',
  danger: '#FB7185',
  success: '#34D399',
  radioOutline: '#5D6878',
  radioFill: '#5BC0DE',
  selectionBackground: '#112F3B',
  selectionBorder: '#2F8CA8',
  shadow: '#000000',
  tabBarBackground: '#171C24',
  tabBarInactive: '#94A3B8',
  tabBarActive: '#7DD3FC',
  ...sharedColors,
};

const commonTheme = {
  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },
  borderRadii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    full: 9999,
  },
  textVariants: {
    defaults: {
      color: 'mainText',
      fontSize: 16,
      lineHeight: 22,
    },
    header: {
      color: 'mainText',
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 38,
    },
    title: {
      color: 'mainText',
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 30,
    },
    sectionTitle: {
      color: 'mainText',
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 24,
    },
    cardTitle: {
      color: 'mainText',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 26,
    },
    cardSubtitle: {
      color: 'secondaryText',
      fontSize: 14,
      lineHeight: 20,
    },
    body: {
      color: 'mainText',
      fontSize: 16,
      lineHeight: 22,
    },
    caption: {
      color: 'secondaryText',
      fontSize: 13,
      lineHeight: 18,
    },
    button: {
      color: 'white',
      fontSize: 16,
      fontWeight: '700',
    },
  },
};

export const lightTheme = createTheme({
  colors: lightColors,
  ...commonTheme,
});

export const darkTheme = createTheme({
  colors: darkColors,
  ...commonTheme,
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const Box = createBox();
export const Text = createText();
