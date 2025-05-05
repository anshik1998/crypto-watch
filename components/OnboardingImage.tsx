import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Bitcoin, TrendingUp, BarChart3, Search, Settings } from 'lucide-react-native';

interface OnboardingImageProps {
  type: 'welcome' | 'market' | 'personalize';
}

const { width } = Dimensions.get('window');

export default function OnboardingImage({ type }: OnboardingImageProps) {
  const { colors } = useTheme();

  // Render different placeholder images based on the type
  const renderImage = () => {
    switch (type) {
      case 'welcome':
        return (
          <View style={styles.welcomeContainer}>
            <Bitcoin color="#F7931A" size={80} style={styles.bitcoinIcon} />
            <TrendingUp color="#30D5C8" size={50} style={styles.trendingIcon} />
            <View style={[styles.card, { backgroundColor: colors.card }]} />
            <View style={[styles.card2, { backgroundColor: colors.card }]} />
          </View>
        );
      case 'market':
        return (
          <View style={styles.marketContainer}>
            <BarChart3 color={colors.primary} size={60} style={styles.chartIcon} />
            <View style={[styles.chartBar1, { backgroundColor: colors.primary }]} />
            <View style={[styles.chartBar2, { backgroundColor: colors.success }]} />
            <View style={[styles.chartBar3, { backgroundColor: colors.error }]} />
            <View style={[styles.chartLine, { backgroundColor: colors.primary }]} />
          </View>
        );
      case 'personalize':
        return (
          <View style={styles.personalizeContainer}>
            <Settings color={colors.primary} size={60} style={styles.settingsIcon} />
            <View style={[styles.toggle, { backgroundColor: colors.primaryLight }]}>
              <View style={[styles.toggleButton, { backgroundColor: colors.primary }]} />
            </View>
            <View style={[styles.slider, { backgroundColor: colors.primaryLight }]}>
              <View style={[styles.sliderButton, { backgroundColor: colors.primary }]} />
            </View>
            <View style={[styles.option, { backgroundColor: colors.card }]} />
            <View style={[styles.option2, { backgroundColor: colors.card }]} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Welcome screen styles
  welcomeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bitcoinIcon: {
    position: 'absolute',
    top: '30%',
    left: '30%',
  },
  trendingIcon: {
    position: 'absolute',
    bottom: '30%',
    right: '30%',
  },
  card: {
    position: 'absolute',
    width: '60%',
    height: '30%',
    borderRadius: 16,
    top: '15%',
    right: '10%',
    opacity: 0.7,
  },
  card2: {
    position: 'absolute',
    width: '60%',
    height: '30%',
    borderRadius: 16,
    bottom: '15%',
    left: '10%',
    opacity: 0.7,
  },
  // Market screen styles
  marketContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartIcon: {
    position: 'absolute',
    top: '10%',
    right: '10%',
  },
  chartBar1: {
    position: 'absolute',
    width: 30,
    height: '40%',
    borderRadius: 8,
    bottom: '20%',
    left: '20%',
  },
  chartBar2: {
    position: 'absolute',
    width: 30,
    height: '60%',
    borderRadius: 8,
    bottom: '20%',
    left: '40%',
  },
  chartBar3: {
    position: 'absolute',
    width: 30,
    height: '30%',
    borderRadius: 8,
    bottom: '20%',
    left: '60%',
  },
  chartLine: {
    position: 'absolute',
    width: '70%',
    height: 3,
    bottom: '20%',
    left: '15%',
  },
  // Personalize screen styles
  personalizeContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    top: '10%',
    left: '10%',
  },
  toggle: {
    position: 'absolute',
    width: 60,
    height: 30,
    borderRadius: 15,
    top: '40%',
    right: '20%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 5,
  },
  toggleButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  slider: {
    position: 'absolute',
    width: '60%',
    height: 10,
    borderRadius: 5,
    top: '60%',
    left: '20%',
  },
  sliderButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -5,
    left: '70%',
  },
  option: {
    position: 'absolute',
    width: '70%',
    height: 40,
    borderRadius: 8,
    bottom: '30%',
    left: '15%',
  },
  option2: {
    position: 'absolute',
    width: '70%',
    height: 40,
    borderRadius: 8,
    bottom: '20%',
    left: '15%',
  },
});
