import React, { createContext, useState, useEffect } from 'react';
import { fetchCryptoData, fetchMarketStats } from '@/utils/api';
import { useTheme } from '@/hooks/useTheme';
import { initializeSymbolMapping } from '@/utils/hyperliquidUtils';

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  circulating_supply: number;
  total_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  currency?: string; // Added to track which currency the data is in
}

export interface MarketStats {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  market_cap_change_percentage_24h_usd: number;
  currency?: string; // Added to track which currency the data is in
}

interface CryptoDataContextType {
  cryptoData: CryptoCurrency[] | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  marketStats: MarketStats | null;
  isUsingCachedData: boolean;
}

export const CryptoDataContext = createContext<CryptoDataContextType>({
  cryptoData: null,
  loading: false,
  error: null,
  refreshData: async () => { },
  marketStats: null,
  isUsingCachedData: false,
});

export const CryptoDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // Get the current currency from ThemeContext
  const { currency } = useTheme();

  const [cryptoData, setCryptoData] = useState<CryptoCurrency[] | null>(null);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCachedData, setIsUsingCachedData] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setIsUsingCachedData(false);

    let cryptoDataResult = null;
    let marketStatsResult = null;
    let usingCachedData = false;

    // Convert currency to lowercase for API calls
    const currencyParam = currency.toLowerCase();

    try {
      // Try to fetch crypto data with the current currency
      cryptoDataResult = await fetchCryptoData(currencyParam);
    } catch (err: any) {
      console.error('Error fetching crypto data:', err);

      // Check if we got cached data
      if (err.cachedData && err.cachedData.cryptoData) {
        cryptoDataResult = err.cachedData.cryptoData;
        usingCachedData = true;
      }
    }

    try {
      // Try to fetch market stats with the current currency
      marketStatsResult = await fetchMarketStats(currencyParam);
    } catch (err: any) {
      console.error('Error fetching market stats:', err);

      // Check if we got cached data
      if (err.cachedData && err.cachedData.marketStats) {
        marketStatsResult = err.cachedData.marketStats;
        usingCachedData = true;
      }
    }

    // Update state based on results
    if (cryptoDataResult) {
      setCryptoData(cryptoDataResult);
    }

    if (marketStatsResult) {
      setMarketStats(marketStatsResult);
    }

    // Set error if we don't have any data
    if (!cryptoDataResult && !marketStatsResult) {
      setError('Failed to fetch cryptocurrency data. Please try again.');
    } else if (usingCachedData) {
      // If we're using cached data for any of the results
      setIsUsingCachedData(true);
    }

    setLoading(false);
  };

  // Fetch data initially and when currency changes
  useEffect(() => {
    fetchData();

    // Initialize the symbol mapping for Hyperliquid
    initializeSymbolMapping().catch(err => {
      console.error('Failed to initialize symbol mapping:', err);
    });

    // Set up a timer to refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, [currency]); // Re-fetch when currency changes

  const contextValue: CryptoDataContextType = {
    cryptoData,
    loading,
    error,
    refreshData: fetchData,
    marketStats,
    isUsingCachedData,
  };

  return (
    <CryptoDataContext.Provider value={contextValue}>
      {children}
    </CryptoDataContext.Provider>
  );
};