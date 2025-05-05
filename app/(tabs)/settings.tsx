import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun, DollarSign, Bell, Globe, Shield, Github, HelpCircle, Heart, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useOnboarding } from '@/hooks/useOnboarding';
import { router } from 'expo-router';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export default function SettingsScreen() {
  const { theme, toggleTheme, colors, currency, setCurrency } = useTheme();
  const { resetOnboarding } = useOnboarding();
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleTheme();
  };

  const handleCurrencySelect = (currencyCode: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrency(currencyCode as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'INR');
  };

  const handleResetOnboarding = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "Reset Onboarding",
      "This will reset the onboarding screens. You'll need to restart the app to see them. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetOnboarding();
            Alert.alert(
              "Onboarding Reset",
              "Onboarding has been reset. Restart the app to see the onboarding screens.",
              [
                {
                  text: "OK",
                  onPress: () => router.replace('/splash')
                }
              ]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your experience
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                {isDark ? (
                  <Moon color={colors.primary} size={22} />
                ) : (
                  <Sun color={colors.primary} size={22} />
                )}
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleToggleTheme}
              trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
              thumbColor={isDark ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Currency
          </Text>
          {CURRENCIES.map((curr) => (
            <TouchableOpacity
              key={curr.code}
              style={styles.settingItem}
              onPress={() => handleCurrencySelect(curr.code)}
            >
              <View style={styles.settingRow}>
                <View style={styles.iconContainer}>
                  <DollarSign color={colors.primary} size={22} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {curr.name} ({curr.symbol})
                </Text>
              </View>
              <View style={[
                styles.radioButton,
                currency === curr.code && { borderColor: colors.primary }
              ]}>
                {currency === curr.code && (
                  <View style={[styles.radioButtonInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Bell color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Price Alerts
              </Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: colors.inputBackground, true: colors.primaryLight }}
              thumbColor={colors.textSecondary}
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Globe color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Website
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Github color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                GitHub Repository
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Shield color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Privacy Policy
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <HelpCircle color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Help & Support
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Developer Options
          </Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetOnboarding}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <RefreshCw color={colors.primary} size={22} />
              </View>
              <Text style={[styles.settingText, { color: colors.text }]}>
                Reset Onboarding
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            CryptoWatch v1.0.0
          </Text>
          <View style={styles.footerRow}>
            <Heart color={colors.error} size={14} style={{ marginRight: 4 }} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with React Native & Expo
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(150, 150, 150, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});