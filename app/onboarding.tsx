import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Platform,
  Animated
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useOnboarding } from '@/hooks/useOnboarding';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Check, ChevronRight, TrendingUp, BarChart3, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingPagination from '@/components/OnboardingPagination';
import OnboardingImage from '@/components/OnboardingImage';

const { width, height } = Dimensions.get('window');

// Onboarding data
const onboardingData = [
  {
    id: '1',
    title: 'Welcome to CryptoWatch',
    description: 'Your personal cryptocurrency tracker with real-time market data and insights.',
    imageType: 'welcome',
    icon: TrendingUp,
    iconColor: '#30D5C8',
  },
  {
    id: '2',
    title: 'Track Market Trends',
    description: 'Monitor price movements, market caps, and trading volumes of top cryptocurrencies.',
    imageType: 'market',
    icon: BarChart3,
    iconColor: '#5C67F5',
  },
  {
    id: '3',
    title: 'Personalize Your Experience',
    description: 'Customize your dashboard, set price alerts, and choose your preferred currency.',
    imageType: 'personalize',
    icon: Settings,
    iconColor: '#F7931A',
  },
];

export default function OnboardingScreen() {
  const { theme, colors } = useTheme();
  const { completeOnboarding } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const renderItem = ({ item, index }: { item: typeof onboardingData[0], index: number }) => {
    const Icon = item.icon;

    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <OnboardingImage type={item.imageType as 'welcome' | 'market' | 'personalize'} />
          <Icon color={item.iconColor} size={60} style={styles.icon} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
            >
              <Text style={[styles.skipText, { color: colors.textSecondary }]}>
                Skip
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={styles.flatList}
        />

        <View style={styles.footer}>
          <OnboardingPagination
            scrollX={scrollX}
            totalPages={onboardingData.length}
          />

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            {currentIndex === onboardingData.length - 1 ? (
              <Check color={colors.cardText} size={24} />
            ) : (
              <ChevronRight color={colors.cardText} size={24} />
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  icon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
