import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

// Define theme types
export type ThemeType = 'light' | 'dark';
export type CurrencyType = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD';

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
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
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
  setCurrency: () => {},
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the device color scheme
  const colorScheme = useColorScheme();
  
  // Initialize theme state based on device preference
  const [theme, setTheme] = useState<ThemeType>(colorScheme || 'light');
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  // Update theme when device preference changes
  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme as ThemeType);
    }
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
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
    currency,
    setCurrency,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};