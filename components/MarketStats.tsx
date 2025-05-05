import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { MarketStats as MarketStatsType } from '@/context/CryptoDataContext';
import { formatLargeNumber, formatPercentage } from '@/utils/formatters';
import { DollarSign, BarChart, PieChart as PieChartIcon, TrendingUp } from 'lucide-react-native';

interface MarketStatsProps {
  marketStats: MarketStatsType | null;
}

const MarketStats: React.FC<MarketStatsProps> = ({ marketStats }) => {
  const { colors, currency } = useTheme();

  if (!marketStats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Market Statistics
        </Text>
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading market data...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Market Statistics
      </Text>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <DollarSign size={18} color={colors.primary} />
            <Text style={[styles.statTitle, { color: colors.text }]}>
              Total Market Cap
            </Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatLargeNumber(marketStats.total_market_cap, currency)}
          </Text>
          <Text style={[
            styles.statChange,
            {
              color: marketStats.market_cap_change_percentage_24h_usd >= 0
                ? colors.success
                : colors.error
            }
          ]}>
            {formatPercentage(marketStats.market_cap_change_percentage_24h_usd)} (24h)
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <BarChart size={18} color={colors.primary} />
            <Text style={[styles.statTitle, { color: colors.text }]}>
              24h Volume
            </Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {formatLargeNumber(marketStats.total_volume, currency)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <PieChartIcon size={18} color={colors.primary} />
            <Text style={[styles.statTitle, { color: colors.text }]}>
              BTC Dominance
            </Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {marketStats.market_cap_percentage.btc.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statHeader}>
            <TrendingUp size={18} color={colors.primary} />
            <Text style={[styles.statTitle, { color: colors.text }]}>
              ETH Dominance
            </Text>
          </View>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {marketStats.market_cap_percentage.eth.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 8,
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    marginLeft: 6,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});

export default MarketStats;