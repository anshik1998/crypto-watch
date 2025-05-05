import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCryptoData } from '@/hooks/useCryptoData';
import { LineChart } from 'react-native-chart-kit';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import MarketStats from '@/components/MarketStats';
import { ArrowDown, ArrowUp } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

type TimeRange = '1h' | '24h' | '7d';

export default function MarketScreen() {
  const { theme, colors } = useTheme();
  const { cryptoData, marketStats } = useCryptoData();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [showingTop, setShowingTop] = useState(5);
  
  const opacity = useSharedValue(0);
  
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const topCryptos = cryptoData
    ?.sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, showingTop) || [];

  const chartData = {
    labels: topCryptos.map(crypto => crypto.symbol.toUpperCase()),
    datasets: [
      {
        data: topCryptos.map(crypto => {
          switch (timeRange) {
            case '1h':
              return crypto.price_change_percentage_1h_in_currency || 0;
            case '7d':
              return crypto.price_change_percentage_7d_in_currency || 0;
            default:
              return crypto.price_change_percentage_24h || 0;
          }
        }),
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 2,
    color: (opacity = 1) => colors.primary,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  const toggleShowingTop = () => {
    setShowingTop(prev => prev === 5 ? 10 : 5);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={styles.headerGradient}
      >
        <Text style={[styles.title, { color: colors.text }]}>Market</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Market performance and trends
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.section, { backgroundColor: colors.card }, animatedStyle]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Market Overview
            </Text>
            <View style={styles.timeRangeSelector}>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === '1h' && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => setTimeRange('1h')}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    { color: timeRange === '1h' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  1H
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === '24h' && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => setTimeRange('24h')}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    { color: timeRange === '24h' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  24H
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.timeRangeButton,
                  timeRange === '7d' && { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => setTimeRange('7d')}
              >
                <Text
                  style={[
                    styles.timeRangeText,
                    { color: timeRange === '7d' ? colors.primary : colors.textSecondary },
                  ]}
                >
                  7D
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>
              Top {showingTop} Cryptocurrencies
            </Text>
            <TouchableOpacity onPress={toggleShowingTop}>
              {showingTop === 5 ? (
                <ArrowDown size={20} color={colors.primary} />
              ) : (
                <ArrowUp size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>

          {topCryptos.length > 0 && (
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </Animated.View>

        <MarketStats marketStats={marketStats} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 15,
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
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 4,
  },
  timeRangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timeRangeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});