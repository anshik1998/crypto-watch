import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { CryptoCurrency } from '@/context/CryptoDataContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { formatCurrency, formatLargeNumber } from '@/utils/formatters';
import PriceChangeIndicator from './PriceChangeIndicator';

interface CryptoCardProps {
  crypto: CryptoCurrency;
  onPress: () => void;
  viewType: 'list' | 'grid';
}

const CryptoCard: React.FC<CryptoCardProps> = ({ crypto, onPress, viewType }) => {
  const { theme, colors, currency } = useTheme();
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const previousPrice = useSharedValue(crypto.current_price);

  useEffect(() => {
    // If price changed, animate the card
    if (previousPrice.value !== crypto.current_price) {
      const isIncrease = crypto.current_price > previousPrice.value;
      
      // Pulse animation
      scale.value = withSequence(
        withTiming(1.02, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) })
      );
      
      // Glow animation
      glowOpacity.value = withSequence(
        withTiming(0.5, { duration: 300 }),
        withTiming(0, { duration: 1200 })
      );
      
      // Update previous price
      previousPrice.value = crypto.current_price;
    }
  }, [crypto.current_price]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      backgroundColor: crypto.price_change_percentage_24h >= 0 
        ? colors.success 
        : colors.error,
    };
  });

  if (viewType === 'grid') {
    return (
      <Animated.View style={[styles.gridCardContainer, animatedStyle]}>
        <TouchableOpacity 
          style={[styles.gridCard, { backgroundColor: colors.card }]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Animated.View style={[styles.glow, glowStyle]} />
          
          <View style={styles.gridTopRow}>
            <Image source={{ uri: crypto.image }} style={styles.gridImage} />
            <PriceChangeIndicator change={crypto.price_change_percentage_24h} />
          </View>
          
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {crypto.name}
          </Text>
          
          <Text style={[styles.gridPrice, { color: colors.text }]}>
            {formatCurrency(crypto.current_price, currency)}
          </Text>
          
          <Text style={[styles.gridMarketCap, { color: colors.textSecondary }]}>
            Market Cap: {formatLargeNumber(crypto.market_cap)}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.glow, glowStyle]} />
        
        <View style={styles.leftContent}>
          <Image source={{ uri: crypto.image }} style={styles.image} />
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {crypto.name}
            </Text>
            <Text style={[styles.symbol, { color: colors.textSecondary }]}>
              {crypto.symbol.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(crypto.current_price, currency)}
          </Text>
          <PriceChangeIndicator change={crypto.price_change_percentage_24h} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  symbol: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  gridCardContainer: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  gridCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  gridTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  gridPrice: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  gridMarketCap: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
  },
});

export default CryptoCard;