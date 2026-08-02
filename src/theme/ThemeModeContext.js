import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';
import { themes } from './theme';

const THEME_MODE_STORAGE_KEY = 'madiassist.theme.mode';

const ThemeModeContext = createContext(null);

export function ThemeModeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);
        if (!isMounted) {
          return;
        }

        if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
          setMode(savedMode);
        }
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    loadThemeMode();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, mode).catch(() => {
      // Ignore persistence errors and keep the in-memory choice active.
    });
  }, [isHydrated, mode]);

  const resolvedMode = mode === 'system'
    ? (systemColorScheme === 'dark' ? 'dark' : 'light')
    : mode;

  const theme = resolvedMode === 'dark' ? themes.dark : themes.light;

  const value = useMemo(() => ({
    mode,
    resolvedMode,
    isHydrated,
    setMode,
    useSystemMode: () => setMode('system'),
    useLightMode: () => setMode('light'),
    useDarkMode: () => setMode('dark'),
  }), [isHydrated, mode, resolvedMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <RestyleThemeProvider theme={theme}>
        {children}
      </RestyleThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider');
  }

  return context;
}
