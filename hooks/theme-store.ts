import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  shadow: string;
}

interface Theme {
  colors: Colors;
  isDark: boolean;
}

const lightColors: Colors = {
  primary: '#3B82F6',
  primaryLight: '#DBEAFE',
  primaryDark: '#1E40AF',
  secondary: '#8B5CF6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  shadow: '#000000',
};

const darkColors: Colors = {
  primary: '#60A5FA',
  primaryLight: '#1E3A8A',
  primaryDark: '#93C5FD',
  secondary: '#A78BFA',
  background: '#0F172A',
  surface: '#1E293B',
  card: '#334155',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  border: '#475569',
  borderLight: '#334155',
  success: '#34D399',
  successLight: '#064E3B',
  warning: '#FBBF24',
  warningLight: '#92400E',
  error: '#F87171',
  errorLight: '#7F1D1D',
  shadow: '#000000',
};

const THEME_STORAGE_KEY = 'app_theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const queryClient = useQueryClient();
  const systemColorScheme = useColorScheme();

  const themeQuery = useQuery({
    queryKey: ['theme-mode'],
    queryFn: async (): Promise<ThemeMode> => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        return (stored as ThemeMode) || 'system';
      } catch (error) {
        console.error('Error loading theme:', error);
        return 'system';
      }
    }
  });

  const saveThemeMutation = useMutation({
    mutationFn: async (mode: ThemeMode) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      return mode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme-mode'] });
    }
  });

  const { mutate: saveTheme } = saveThemeMutation;

  const themeMode = themeQuery.data || 'system';
  
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const theme = useMemo((): Theme => ({
    colors: isDark ? darkColors : lightColors,
    isDark,
  }), [isDark]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    saveTheme(mode);
  }, [saveTheme]);

  return useMemo(() => ({
    theme,
    themeMode,
    setThemeMode,
    isLoading: themeQuery.isLoading,
  }), [theme, themeMode, setThemeMode, themeQuery.isLoading]);
});

export type { Colors, Theme, ThemeMode };
