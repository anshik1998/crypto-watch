import AsyncStorage from '@react-native-async-storage/async-storage';
import { CryptoCurrency, MarketStats } from '@/context/CryptoDataContext';

// Cache keys
const CACHE_KEYS = {
  CRYPTO_DATA: 'cached_crypto_data',
  MARKET_STATS: 'cached_market_stats',
  CRYPTO_DETAIL: 'cached_crypto_detail_', // Will be appended with crypto ID
  PRICE_HISTORY: 'cached_price_history_', // Will be appended with crypto ID
  ORDER_BOOK: 'cached_order_book_', // Will be appended with crypto ID
};

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = {
  CRYPTO_DATA: 5 * 60 * 1000, // 5 minutes
  MARKET_STATS: 5 * 60 * 1000, // 5 minutes
  CRYPTO_DETAIL: 10 * 60 * 1000, // 10 minutes
  PRICE_HISTORY: 15 * 60 * 1000, // 15 minutes
  ORDER_BOOK: 30 * 1000, // 30 seconds (order books change frequently)
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Save data to cache
export const saveToCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

// Get data from cache
export const getFromCache = async <T>(key: string, expirationTime: number): Promise<T | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(key);

    if (!cachedData) {
      return null;
    }

    const cacheItem: CacheItem<T> = JSON.parse(cachedData);
    const now = Date.now();

    // Check if cache is expired
    if (now - cacheItem.timestamp > expirationTime) {
      console.log(`Cache expired for ${key}`);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
};

// Specific functions for our data types
export const saveCryptoDataToCache = async (data: CryptoCurrency[]): Promise<void> => {
  await saveToCache(CACHE_KEYS.CRYPTO_DATA, data);
};

export const getCachedCryptoData = async (): Promise<CryptoCurrency[] | null> => {
  return await getFromCache<CryptoCurrency[]>(
    CACHE_KEYS.CRYPTO_DATA,
    CACHE_EXPIRATION.CRYPTO_DATA
  );
};

export const saveMarketStatsToCache = async (data: MarketStats): Promise<void> => {
  await saveToCache(CACHE_KEYS.MARKET_STATS, data);
};

export const getCachedMarketStats = async (): Promise<MarketStats | null> => {
  return await getFromCache<MarketStats>(
    CACHE_KEYS.MARKET_STATS,
    CACHE_EXPIRATION.MARKET_STATS
  );
};

export const saveCryptoDetailToCache = async (id: string, data: CryptoCurrency): Promise<void> => {
  await saveToCache(`${CACHE_KEYS.CRYPTO_DETAIL}${id}`, data);
};

export const getCachedCryptoDetail = async (id: string): Promise<CryptoCurrency | null> => {
  return await getFromCache<CryptoCurrency>(
    `${CACHE_KEYS.CRYPTO_DETAIL}${id}`,
    CACHE_EXPIRATION.CRYPTO_DETAIL
  );
};

// Cache functions for price history
export const savePriceHistoryToCache = async (id: string, data: any): Promise<void> => {
  await saveToCache(`${CACHE_KEYS.PRICE_HISTORY}${id}`, data);
};

export const getCachedPriceHistory = async (id: string): Promise<any | null> => {
  return await getFromCache(
    `${CACHE_KEYS.PRICE_HISTORY}${id}`,
    CACHE_EXPIRATION.PRICE_HISTORY
  );
};

// Cache functions for order book
export const saveOrderBookToCache = async (id: string, data: any): Promise<void> => {
  await saveToCache(`${CACHE_KEYS.ORDER_BOOK}${id}`, data);
};

export const getCachedOrderBook = async (id: string): Promise<any | null> => {
  return await getFromCache(
    `${CACHE_KEYS.ORDER_BOOK}${id}`,
    CACHE_EXPIRATION.ORDER_BOOK
  );
};

// Check if error is a rate limit error (429)
export const isRateLimitError = (error: any): boolean => {
  return error?.response?.status === 429;
};
