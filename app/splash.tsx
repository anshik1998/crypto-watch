import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Bitcoin, TrendingUp } from 'lucide-react-native';

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const moveUpAnim = new Animated.Value(50);

  useEffect(() => {
    // Animation sequence
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
    ]).start();

    // Navigate to main screen after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#111827', '#1E293B']}
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
        <Bitcoin color="#F7931A" size={80} />
        <TrendingUp 
          color="#30D5C8" 
          size={40} 
          style={styles.trendingIcon} 
        />
        <Text style={styles.appName}>CryptoWatch</Text>
        <Text style={styles.tagline}>Real-time market insights</Text>
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
  trendingIcon: {
    position: 'absolute',
    top: 5,
    right: -20,
  },
  appName: {
    marginTop: 20,
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: 'white',
    letterSpacing: 1,
  },
  tagline: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
  },
});