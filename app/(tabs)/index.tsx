import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useCryptoData } from '@/hooks/useCryptoData';
import { useTheme } from '@/hooks/useTheme';
import CryptoCard from '@/components/CryptoCard';
import { ArrowUpDown, Grid2x2 as Grid, List, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const { cryptoData, loading, error, refreshData, isUsingCachedData } = useCryptoData();
  const { theme, colors } = useTheme();
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const headerOpacity = useSharedValue(0);

  // Animated styles for header
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const handleRefresh = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await refreshData();
  };

  const toggleViewType = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setViewType(prev => prev === 'list' ? 'grid' : 'list');
  };

  const toggleSortOrder = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleCryptoPress = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/details/${id}`);
  };

  // Sort data based on market cap
  const sortedData = [...(cryptoData || [])].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.market_cap - a.market_cap;
    } else {
      return a.market_cap - b.market_cap;
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card, colors.background]}
        style={styles.headerGradient}
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>CryptoWatch</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Live Market Data
            </Text>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleSortOrder}>
              <ArrowUpDown size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={toggleViewType}>
              {viewType === 'list' ? (
                <Grid size={20} color={colors.primary} />
              ) : (
                <List size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {isUsingCachedData && (
          <View style={[styles.cachedDataBanner, { backgroundColor: colors.warning }]}>
            <AlertCircle size={16} color={colors.background} />
            <Text style={[styles.cachedDataText, { color: colors.background }]}>
              Showing cached data. Pull down to refresh.
            </Text>
          </View>
        )}
      </LinearGradient>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={refreshData}
          >
            <Text style={[styles.retryText, { color: colors.cardText }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CryptoCard
              crypto={item}
              onPress={() => handleCryptoPress(item.id)}
              viewType={viewType}
            />
          )}
          numColumns={viewType === 'grid' ? 2 : 1}
          key={viewType} // Force re-render when view type changes
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 20,
  },
  listContent: {
    padding: 16,
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
  cachedDataBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  cachedDataText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginLeft: 8,
  },
});