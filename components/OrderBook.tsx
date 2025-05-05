import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { CURRENCY_SYMBOLS } from '@/utils/currencyUtils';
import { CurrencyType } from '@/context/ThemeContext';
import { convertOrderBookPrices } from '@/utils/hyperliquidUtils';

interface OrderBookEntry {
  price: number;
  amount: number;
}

interface OrderBookProps {
  data: {
    bids: OrderBookEntry[];
    asks: OrderBookEntry[];
  } | null;
}

const OrderBook: React.FC<OrderBookProps> = ({ data }) => {
  const { colors, currency } = useTheme();

  if (!data) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Order Book
        </Text>
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          Loading order book data...
        </Text>
      </View>
    );
  }

  // Convert order book prices to the user's selected currency
  const convertedData = useMemo(() => {
    return convertOrderBookPrices(data, currency as CurrencyType);
  }, [data, currency]);

  if (!convertedData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Order Book
        </Text>
        <Text style={[styles.placeholder, { color: colors.textSecondary }]}>
          Error loading order book data
        </Text>
      </View>
    );
  }

  const { bids, asks } = convertedData;

  // Calculate maximum volume for visualization
  const maxVolume = Math.max(
    ...bids.map(bid => bid.amount),
    ...asks.map(ask => ask.amount)
  );

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.card }]}
      entering={FadeIn.duration(500)}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Order Book
      </Text>

      <View style={styles.headerRow}>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>
          Price
        </Text>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>
          Amount
        </Text>
        <Text style={[styles.headerText, { color: colors.textSecondary }]}>
          Total
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Ask orders (sell) - displayed in reverse order */}
        {asks.slice(0, 5).map((ask, index) => (
          <View key={`ask-${index}`} style={styles.orderRow}>
            <View
              style={[
                styles.volumeBar,
                {
                  backgroundColor: `${colors.error}30`,
                  width: `${(ask.amount / maxVolume) * 100}%`,
                  right: 0,
                }
              ]}
            />
            <Text style={[styles.priceText, { color: colors.error }]}>
              {CURRENCY_SYMBOLS[currency as CurrencyType]}{ask.price.toFixed(2)}
            </Text>
            <Text style={[styles.amountText, { color: colors.text }]}>
              {ask.amount.toFixed(4)}
            </Text>
            <Text style={[styles.totalText, { color: colors.textSecondary }]}>
              {CURRENCY_SYMBOLS[currency as CurrencyType]}{(ask.price * ask.amount).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={[styles.spreadRow, { borderColor: colors.border }]}>
          <Text style={[styles.spreadText, { color: colors.primary }]}>
            Spread: {CURRENCY_SYMBOLS[currency as CurrencyType]}{((asks[0]?.price || 0) - (bids[0]?.price || 0)).toFixed(2)} ({
              (((asks[0]?.price || 0) - (bids[0]?.price || 0)) / (asks[0]?.price || 1) * 100).toFixed(2)
            }%)
          </Text>
        </View>

        {/* Bid orders (buy) */}
        {bids.slice(0, 5).map((bid, index) => (
          <View key={`bid-${index}`} style={styles.orderRow}>
            <View
              style={[
                styles.volumeBar,
                {
                  backgroundColor: `${colors.success}30`,
                  width: `${(bid.amount / maxVolume) * 100}%`,
                  left: 0,
                }
              ]}
            />
            <Text style={[styles.priceText, { color: colors.success }]}>
              {CURRENCY_SYMBOLS[currency as CurrencyType]}{bid.price.toFixed(2)}
            </Text>
            <Text style={[styles.amountText, { color: colors.text }]}>
              {bid.amount.toFixed(4)}
            </Text>
            <Text style={[styles.totalText, { color: colors.textSecondary }]}>
              {CURRENCY_SYMBOLS[currency as CurrencyType]}{(bid.price * bid.amount).toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
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
  placeholder: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginVertical: 20,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  scrollView: {
    maxHeight: 320,
  },
  orderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    position: 'relative',
    zIndex: 1,
  },
  volumeBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  priceText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  amountText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  totalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  spreadRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 8,
    alignItems: 'center',
  },
  spreadText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default OrderBook;