import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import PriceChangeIndicator from '@/components/PriceChangeIndicator';
import OrderBook from '@/components/OrderBook';
import { formatCurrency, formatLargeNumber } from '@/utils/formatters';

const screenWidth = Dimensions.get('window').width;

type TimeRange = '1d' | '7d' | '30d';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme, colors, currency } = useTheme();
  const { crypto, loading, error, priceHistory, orderBook } = useCryptoDetail(id);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');
  const [expanded, setExpanded] = useState(true);

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const toggleExpanded = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setExpanded(!expanded);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeRange(range);
  };

  if (loading || !crypto) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading cryptocurrency data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace(`/details/${id}`)}
        >
          <Text style={[styles.retryText, { color: colors.cardText }]}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const chartData = {
    labels: [],
    datasets: [
      {
        data: priceHistory[timeRange] || [0, 0],
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
      r: '0',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {crypto.name}
            </Text>
            <Text style={[styles.headerSymbol, { color: colors.textSecondary }]}>
              {crypto.symbol.toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.priceSection, { backgroundColor: colors.card }]}>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.text }]}>
              {formatCurrency(crypto.current_price, currency)}
            </Text>
            <PriceChangeIndicator change={crypto.price_change_percentage_24h} large />
          </View>

          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === '1d' && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => handleTimeRangeChange('1d')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  { color: timeRange === '1d' ? colors.primary : colors.textSecondary },
                ]}
              >
                1D
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === '7d' && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => handleTimeRangeChange('7d')}
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
            <TouchableOpacity
              style={[
                styles.timeRangeButton,
                timeRange === '30d' && { backgroundColor: colors.primaryLight },
              ]}
              onPress={() => handleTimeRangeChange('30d')}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  { color: timeRange === '30d' ? colors.primary : colors.textSecondary },
                ]}
              >
                30D
              </Text>
            </TouchableOpacity>
          </View>

          {priceHistory[timeRange] && priceHistory[timeRange].length > 0 && (
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={false}
              withHorizontalLabels={false}
            />
          )}
        </View>

        <View style={[styles.statsSection, { backgroundColor: colors.card }]}>
          <View style={[styles.sectionHeader, { marginBottom: expanded ? 16 : 0 }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Market Stats
            </Text>
            <TouchableOpacity onPress={toggleExpanded} style={styles.expandButton}>
              {expanded ? (
                <ChevronUp color={colors.textSecondary} size={20} />
              ) : (
                <ChevronDown color={colors.textSecondary} size={20} />
              )}
            </TouchableOpacity>
          </View>

          {expanded && (
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Market Cap
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatLargeNumber(crypto.market_cap)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Volume (24h)
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatLargeNumber(crypto.total_volume)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Circulating Supply
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatLargeNumber(crypto.circulating_supply)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Supply
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {crypto.total_supply ? formatLargeNumber(crypto.total_supply) : 'N/A'}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  All-Time High
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {formatCurrency(crypto.ath, currency)}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  ATH Change %
                </Text>
                <Text style={[
                  styles.statValue, 
                  { color: crypto.ath_change_percentage >= 0 ? colors.success : colors.error }
                ]}>
                  {crypto.ath_change_percentage.toFixed(2)}%
                </Text>
              </View>
            </View>
          )}
        </View>

        <OrderBook data={orderBook} />
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
    paddingBottom: 20,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  headerSymbol: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  priceSection: {
    borderRadius: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    padding: 4,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  chart: {
    marginTop: 8,
    borderRadius: 16,
  },
  statsSection: {
    borderRadius: 16,
    marginTop: 16,
    marginBottom: 16,
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
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  expandButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
});