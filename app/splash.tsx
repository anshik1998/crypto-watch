import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bitcoin, TrendingUp, BarChart3 } from 'lucide-react-native';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';

export default function SplashScreen() {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const moveUpAnim = new Animated.Value(50);
  const rotateAnim = new Animated.Value(0);
  const pulseAnim = new Animated.Value(1);

  // Convert rotate value to interpolated string
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    // Trigger light haptic feedback when splash screen appears
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Main animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(moveUpAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to appropriate screen after animation completes
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isLoading, hasCompletedOnboarding]);

  // Use theme-aware gradient colors
  const gradientColors = isDark
    ? ['#111827', '#1E293B'] as const
    : ['#5C67F5', '#F9FAFB'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: moveUpAnim }
            ]
          }
        ]}
      >
        <View style={styles.iconGroup}>
          <Animated.View style={{ transform: [{ rotate: spin }, { scale: pulseAnim }] }}>
            <Bitcoin color="#F7931A" size={80} />
          </Animated.View>
          <TrendingUp
            color="#30D5C8"
            size={40}
            style={styles.trendingIcon}
          />
          <BarChart3
            color={colors.primary}
            size={30}
            style={styles.chartIcon}
          />
        </View>
        <Text style={[styles.appName, { color: isDark ? 'white' : colors.text }]}>
          CryptoWatch
        </Text>
        <Text style={[styles.tagline, { color: isDark ? '#94A3B8' : colors.textSecondary }]}>
          Real-time market insights
        </Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGroup: {
    position: 'relative',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendingIcon: {
    position: 'absolute',
    top: 5,
    right: -20,
  },
  chartIcon: {
    position: 'absolute',
    bottom: 10,
    left: -15,
  },
  appName: {
    marginTop: 20,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
});