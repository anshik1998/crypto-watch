import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface PriceChangeIndicatorProps {
  change: number;
  large?: boolean;
}

const PriceChangeIndicator: React.FC<PriceChangeIndicatorProps> = ({ 
  change, 
  large = false 
}) => {
  const { colors } = useTheme();
  const isPositive = change >= 0;
  const color = isPositive ? colors.success : colors.error;
  const backgroundColor = isPositive 
    ? `${colors.success}10` // 10% opacity
    : `${colors.error}10`;  // 10% opacity

  return (
    <View style={[
      styles.container, 
      { backgroundColor },
      large && styles.large
    ]}>
      {isPositive ? (
        <TrendingUp size={large ? 16 : 12} color={color} />
      ) : (
        <TrendingDown size={large ? 16 : 12} color={color} />
      )}
      <Text style={[
        styles.text, 
        { color },
        large && styles.largeText
      ]}>
        {Math.abs(change).toFixed(2)}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  largeText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default PriceChangeIndicator;