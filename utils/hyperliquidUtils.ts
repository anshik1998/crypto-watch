import { HYPERLIQUID_API_URL } from '@env';
import { CurrencyType } from '@/context/ThemeContext';
import { convertFromUsd } from './currencyUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COINGECKO_API_KEY, COINGECKO_API_URL } from '@env';

// Hyperliquid API base URL - using environment variable
export const API_HYPERLIQUID_URL = HYPERLIQUID_API_URL || 'https://api.hyperliquid.xyz';

// Cache key for the symbol mapping
const SYMBOL_MAPPING_CACHE_KEY = 'hyperliquid_symbol_mapping_cache';
const SYMBOL_MAPPING_CACHE_EXPIRY_KEY = 'hyperliquid_symbol_mapping_cache_expiry';
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Fallback mapping in case API fails
const fallbackCoinGeckoToHyperliquidMap: Record<string, string> = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'solana': 'SOL',
  'arbitrum': 'ARB',
  'avalanche-2': 'AVAX',
  'binancecoin': 'BNB',
  'cardano': 'ADA',
  'dogecoin': 'DOGE',
  'polkadot': 'DOT',
  'ripple': 'XRP',
  'usd-coin': 'USDC',
  'tether': 'USDT',
  'matic-network': 'MATIC',
  'chainlink': 'LINK',
  'litecoin': 'LTC'
};

// CoinGecko API configuration
const COINGECKO_CONFIG = {
  // Base URLs - using environment variables
  FREE_API_URL: COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',

  // API key - using environment variable
  API_KEY: COINGECKO_API_KEY || '',

  // Get API parameters including API key if available
  getParams(params = {}) {
    return params;
  },

  // Get headers with API key
  getHeaders() {
    return {
      'x-cg-demo-api-key': this.API_KEY
    };
  }
};

/**
 * Fetch and cache the mapping between CoinGecko IDs and Hyperliquid symbols
 * @returns A promise that resolves to the mapping object
 */
export const fetchSymbolMapping = async (): Promise<Record<string, string>> => {
  try {
    // Check if we have a valid cached mapping
    const cachedExpiryStr = await AsyncStorage.getItem(SYMBOL_MAPPING_CACHE_EXPIRY_KEY);
    const cachedExpiry = cachedExpiryStr ? parseInt(cachedExpiryStr, 10) : 0;

    // If cache is still valid, use it
    if (cachedExpiry > Date.now()) {
      const cachedMapping = await AsyncStorage.getItem(SYMBOL_MAPPING_CACHE_KEY);
      if (cachedMapping) {
        console.log('Using cached symbol mapping');
        return JSON.parse(cachedMapping);
      }
    }

    // Fetch top 100 coins from CoinGecko
    console.log('Fetching fresh symbol mapping from CoinGecko');
    const response = await axios.get(`${COINGECKO_CONFIG.FREE_API_URL}/coins/markets`, {
      params: COINGECKO_CONFIG.getParams({
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false
      }),
      headers: COINGECKO_CONFIG.getHeaders(),
    });

    // Create mapping from CoinGecko ID to symbol
    const mapping: Record<string, string> = {};
    response.data.forEach((coin: any) => {
      // Convert CoinGecko symbol to uppercase for Hyperliquid
      mapping[coin.id] = coin.symbol.toUpperCase();
    });

    // Cache the mapping
    await AsyncStorage.setItem(SYMBOL_MAPPING_CACHE_KEY, JSON.stringify(mapping));
    await AsyncStorage.setItem(
      SYMBOL_MAPPING_CACHE_EXPIRY_KEY,
      (Date.now() + CACHE_EXPIRY_TIME).toString()
    );

    return mapping;
  } catch (error) {
    console.error('Error fetching symbol mapping:', error);
    // Return fallback mapping if fetch fails
    return fallbackCoinGeckoToHyperliquidMap;
  }
};

// In-memory cache for the mapping to avoid excessive AsyncStorage reads
let symbolMappingCache: Record<string, string> | null = null;

/**
 * Initialize the symbol mapping cache
 * This can be called when the app starts to preload the mapping
 */
export const initializeSymbolMapping = async (): Promise<void> => {
  try {
    if (!symbolMappingCache) {
      symbolMappingCache = await fetchSymbolMapping();
      console.log('Symbol mapping initialized with', Object.keys(symbolMappingCache).length, 'entries');
    }
  } catch (error) {
    console.error('Error initializing symbol mapping:', error);
  }
};

/**
 * Get the Hyperliquid symbol for a given CoinGecko ID
 * @param coinGeckoId CoinGecko ID
 * @returns Hyperliquid symbol or default if not found
 */
export const getHyperliquidSymbol = async (coinGeckoId: string): Promise<string> => {
  try {
    // Use in-memory cache if available
    if (!symbolMappingCache) {
      symbolMappingCache = await fetchSymbolMapping();
    }

    // Return the symbol or default to BTC
    return symbolMappingCache[coinGeckoId] || 'BTC';
  } catch (error) {
    console.error('Error getting Hyperliquid symbol:', error);
    // Use fallback mapping if all else fails
    return fallbackCoinGeckoToHyperliquidMap[coinGeckoId] || 'BTC';
  }
};

/**
 * Convert order book prices from USD to the user's selected currency
 * @param orderBook Order book data with prices in USD
 * @param currency Target currency
 * @returns Order book with prices converted to the target currency
 */
export const convertOrderBookPrices = (
  orderBook: { bids: any[]; asks: any[] } | null,
  currency: CurrencyType
): { bids: any[]; asks: any[] } | null => {
  if (!orderBook) return null;

  return {
    bids: orderBook.bids.map(bid => ({
      ...bid,
      price: convertFromUsd(bid.price, currency),
      total: convertFromUsd(bid.price * bid.amount, currency)
    })),
    asks: orderBook.asks.map(ask => ({
      ...ask,
      price: convertFromUsd(ask.price, currency),
      total: convertFromUsd(ask.price * ask.amount, currency)
    }))
  };
};

/**
 * Get WebSocket URL for Hyperliquid API
 * @returns WebSocket URL
 */
export const getHyperliquidWebSocketUrl = (): string => {
  return HYPERLIQUID_API_URL
    ? `wss://${HYPERLIQUID_API_URL.replace('https://', '')}/ws`
    : 'wss://api.hyperliquid.xyz/ws';
};

/**
 * Create a subscription message for Hyperliquid WebSocket
 * @param symbol Coin symbol
 * @returns Subscription message object
 */
export const createHyperliquidSubscriptionMessage = (symbol: string): object => {
  return {
    "method": "subscribe",
    "subscription": {
      "type": "l2Book",
      "coin": symbol
    }
  };
};
