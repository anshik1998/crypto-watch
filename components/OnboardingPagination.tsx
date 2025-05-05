import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface OnboardingPaginationProps {
  scrollX: Animated.Value;
  totalPages: number;
}

const { width } = Dimensions.get('window');

export default function OnboardingPagination({ scrollX, totalPages }: OnboardingPaginationProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, i) => {
        // Calculate the input range for the current dot
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        // Animate the width of the dot
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 20, 8],
          extrapolate: 'clamp',
        });
        
        // Animate the opacity of the dot
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {
                width: dotWidth,
                backgroundColor: colors.primary,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
