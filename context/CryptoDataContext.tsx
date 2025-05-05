import React, { createContext, useState, useEffect } from 'react';
import { fetchCryptoData, fetchMarketStats } from '@/utils/api';

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
}

export interface MarketStats {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  market_cap_change_percentage_24h_usd: number;
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

    try {
      // Try to fetch crypto data
      cryptoDataResult = await fetchCryptoData();
    } catch (err: any) {
      console.error('Error fetching crypto data:', err);

      // Check if we got cached data
      if (err.cachedData && err.cachedData.cryptoData) {
        cryptoDataResult = err.cachedData.cryptoData;
        usingCachedData = true;
      }
    }

    try {
      // Try to fetch market stats
      marketStatsResult = await fetchMarketStats();
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

  useEffect(() => {
    fetchData();

    // Set up a timer to refresh data every 60 seconds
    const intervalId = setInterval(fetchData, 60000); // 60 seconds

    return () => clearInterval(intervalId);
  }, []);

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