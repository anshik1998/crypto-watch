import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  THEME: 'app_theme',
  CURRENCY: 'app_currency',
};

// Define theme types
export type ThemeType = 'light' | 'dark';
export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'INR';

// Color palette for both themes
export interface ColorPalette {
  primary: string;
  primaryLight: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  cardText: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  inputBackground: string;
}

// Theme context type
interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  colors: ColorPalette;
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  isLoading: boolean;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => { },
  colors: {
    primary: '#5C67F5',
    primaryLight: 'rgba(92, 103, 245, 0.1)',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    cardText: '#FFFFFF',
    border: '#E5E7EB',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    inputBackground: '#F3F4F6',
  },
  currency: 'USD',
  setCurrency: () => { },
  isLoading: true,
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme();

  // Initialize theme and currency state
  const [theme, setTheme] = useState<ThemeType>(colorScheme || 'light');
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved preferences on mount
  useEffect(() => {
    const loadSavedPreferences = async () => {
      try {
        // Load saved theme
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
        } else if (colorScheme) {
          // If no saved theme, use device preference
          setTheme(colorScheme as ThemeType);
        }

        // Load saved currency
        const savedCurrency = await AsyncStorage.getItem(STORAGE_KEYS.CURRENCY);
        if (savedCurrency) {
          setCurrency(savedCurrency as CurrencyType);
        }
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPreferences();
  }, []);

  // Update theme when device preference changes (only if no saved preference)
  useEffect(() => {
    const updateThemeBasedOnDevice = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
        // Only update based on device if user hasn't explicitly set a theme
        if (!savedTheme && colorScheme) {
          setTheme(colorScheme as ThemeType);
        }
      } catch (error) {
        console.error('Error checking saved theme:', error);
      }
    };

    updateThemeBasedOnDevice();
  }, [colorScheme]);

  // Define colors for both themes
  const lightColors: ColorPalette = {
    primary: '#5C67F5',
    primaryLight: 'rgba(92, 103, 245, 0.1)',
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    cardText: '#FFFFFF',
    border: '#E5E7EB',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    inputBackground: '#F3F4F6',
  };

  const darkColors: ColorPalette = {
    primary: '#5C67F5',
    primaryLight: 'rgba(92, 103, 245, 0.15)',
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    cardText: '#F9FAFB',
    border: '#374151',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    inputBackground: '#374151',
  };

  // Get current theme colors
  const colors = theme === 'light' ? lightColors : darkColors;

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme).catch(error => {
      console.error('Error saving theme preference:', error);
    });
  };

  // Currency setter with persistence
  const handleSetCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    // Save to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEYS.CURRENCY, newCurrency).catch(error => {
      console.error('Error saving currency preference:', error);
    });
  };

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
    currency,
    setCurrency: handleSetCurrency,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};