import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useCryptoData } from '@/hooks/useCryptoData';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import CryptoCard from '@/components/CryptoCard';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import FilterModal from '@/components/FilterModal';

export default function SearchScreen() {
  const { theme, colors } = useTheme();
  const { cryptoData } = useCryptoData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(cryptoData || []);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minMarketCap: '',
    sortBy: 'market_cap' as 'market_cap' | 'price' | 'name' | 'price_change_24h',
    sortDirection: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    if (cryptoData) {
      handleSearch(searchQuery);
    }
  }, [cryptoData, filters]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (!cryptoData) return;

    const query = text.toLowerCase().trim();
    let results = cryptoData;

    // Text search
    if (query) {
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.symbol.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.minPrice) {
      results = results.filter(item => item.current_price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(item => item.current_price <= parseFloat(filters.maxPrice));
    }
    if (filters.minMarketCap) {
      results = results.filter(item => item.market_cap >= parseFloat(filters.minMarketCap) * 1000000);
    }

    // Sort data
    results = [...results].sort((a, b) => {
      if (filters.sortBy === 'name') {
        return filters.sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (filters.sortBy === 'price') {
        return filters.sortDirection === 'asc'
          ? a.current_price - b.current_price
          : b.current_price - a.current_price;
      } else if (filters.sortBy === 'price_change_24h') {
        return filters.sortDirection === 'asc'
          ? a.price_change_percentage_24h - b.price_change_percentage_24h
          : b.price_change_percentage_24h - a.price_change_percentage_24h;
      } else {
        // Default: market_cap
        return filters.sortDirection === 'asc'
          ? a.market_cap - b.market_cap
          : b.market_cap - a.market_cap;
      }
    });

    setFilteredData(results);
  };

  const clearSearch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSearchQuery('');
    handleSearch('');
  };

  const handleCryptoPress = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/details/${id}`);
  };

  const toggleFilterModal = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowFilterModal(!showFilterModal);
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Find your favorite cryptocurrencies
        </Text>

        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground }]}>
          <Search color={colors.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name or symbol"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X color={colors.textSecondary} size={16} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={toggleFilterModal} style={styles.filterButton}>
            <SlidersHorizontal color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CryptoCard 
            crypto={item} 
            onPress={() => handleCryptoPress(item.id)} 
            viewType="list"
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No cryptocurrencies found matching your criteria
            </Text>
          </View>
        )}
      />

      {showFilterModal && (
        <FilterModal 
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onApply={applyFilters}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  clearButton: {
    padding: 8,
  },
  filterButton: {
    padding: 8,
    marginLeft: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});