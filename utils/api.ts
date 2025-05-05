import axios from 'axios';
import { CryptoCurrency, MarketStats } from '@/context/CryptoDataContext';
import {
  saveCryptoDataToCache,
  getCachedCryptoData,
  saveMarketStatsToCache,
  getCachedMarketStats,
  saveCryptoDetailToCache,
  getCachedCryptoDetail,
  savePriceHistoryToCache,
  getCachedPriceHistory,
  saveOrderBookToCache,
  getCachedOrderBook,
  isRateLimitError
} from './cache';
import { COINGECKO_API_KEY, COINGECKO_API_URL, HYPERLIQUID_API_URL } from '@env';

// CoinGecko API configuration
const COINGECKO_CONFIG = {
  // Base URLs - using environment variables
  FREE_API_URL: COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
  PRO_API_URL: 'https://pro-api.coingecko.com/api/v3',

  // API key - using environment variable
  API_KEY: COINGECKO_API_KEY || '',

  // Use Pro API if API key is provided
  get BASE_URL() {
    // Always use the free API URL with the API key in headers
    return this.FREE_API_URL;
  },

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

// Helper functions for creating empty data structures when API calls fail
const createEmptyOrderBook = () => {
  return {
    bids: [],
    asks: []
  };
};

const createEmptyPriceHistory = (currency: string = 'usd') => {
  return {
    '1d': [],
    '7d': [],
    '30d': [],
    'currency': currency.toLowerCase()
  };
};

// Fetch top cryptocurrencies
export const fetchCryptoData = async (currency: string = 'usd'): Promise<CryptoCurrency[]> => {
  try {
    // Ensure currency is lowercase for CoinGecko API
    const vsCurrency = currency.toLowerCase();

    const response = await axios.get(`${COINGECKO_CONFIG.BASE_URL}/coins/markets`, {
      params: COINGECKO_CONFIG.getParams({
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
        price_change_percentage: '1h,24h,7d',
      }),
      headers: COINGECKO_CONFIG.getHeaders(),
    });

    // Cache the successful response
    await saveCryptoDataToCache(response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);

    // Check if it's a rate limit error
    if (isRateLimitError(error)) {
      console.log('Rate limit reached, trying to use cached data...');
      const cachedData = await getCachedCryptoData();

      if (cachedData) {
        console.log('Using cached crypto data');

        // Create a custom error with cached data
        const customError: any = new Error('Rate limit reached');
        customError.cachedData = { cryptoData: cachedData };
        throw customError;
      }
    }

    throw error;
  }
};

// Fetch market statistics
export const fetchMarketStats = async (currency: string = 'usd'): Promise<MarketStats> => {
  try {
    // Ensure currency is lowercase for CoinGecko API
    const vsCurrency = currency.toLowerCase();

    const response = await axios.get(`${COINGECKO_CONFIG.BASE_URL}/global`, {
      params: COINGECKO_CONFIG.getParams(),
      headers: COINGECKO_CONFIG.getHeaders(),
    });
    const data = response.data.data;

    // Get values in the requested currency if available, fallback to USD
    const totalMarketCap = data.total_market_cap[vsCurrency] || data.total_market_cap.usd;
    const totalVolume = data.total_volume[vsCurrency] || data.total_volume.usd;

    const marketStats = {
      total_market_cap: totalMarketCap,
      total_volume: totalVolume,
      market_cap_percentage: {
        btc: data.market_cap_percentage.btc,
        eth: data.market_cap_percentage.eth,
      },
      market_cap_change_percentage_24h_usd: data.market_cap_change_percentage_24h_usd,
      currency: vsCurrency,
    };

    // Cache the successful response
    await saveMarketStatsToCache(marketStats);

    return marketStats;
  } catch (error) {
    console.error('Error fetching market stats:', error);

    // Check if it's a rate limit error
    if (isRateLimitError(error)) {
      console.log('Rate limit reached, trying to use cached market stats...');
      const cachedStats = await getCachedMarketStats();

      if (cachedStats) {
        console.log('Using cached market stats');

        // Create a custom error with cached data
        const customError: any = new Error('Rate limit reached');
        customError.cachedData = { marketStats: cachedStats };
        throw customError;
      }
    }

    throw error;
  }
};

// Fetch detailed crypto data
export const fetchCryptoDetail = async (id: string, currency: string = 'usd'): Promise<CryptoCurrency> => {
  try {
    // Ensure currency is lowercase for CoinGecko API
    const vsCurrency = currency.toLowerCase();

    const response = await axios.get(`${COINGECKO_CONFIG.BASE_URL}/coins/${id}`, {
      params: COINGECKO_CONFIG.getParams(),
      headers: COINGECKO_CONFIG.getHeaders(),
    });
    const marketData = response.data.market_data;

    // Get values in the requested currency if available, fallback to USD
    const currentPrice = marketData.current_price[vsCurrency] || marketData.current_price.usd;
    const marketCap = marketData.market_cap[vsCurrency] || marketData.market_cap.usd;
    const totalVolume = marketData.total_volume[vsCurrency] || marketData.total_volume.usd;
    const priceChange1h = marketData.price_change_percentage_1h_in_currency?.[vsCurrency] ||
      marketData.price_change_percentage_1h_in_currency?.usd || 0;
    const priceChange7d = marketData.price_change_percentage_7d_in_currency?.[vsCurrency] ||
      marketData.price_change_percentage_7d_in_currency?.usd || 0;
    const ath = marketData.ath[vsCurrency] || marketData.ath.usd;
    const athChangePercentage = marketData.ath_change_percentage[vsCurrency] || marketData.ath_change_percentage.usd;

    const cryptoDetail = {
      id: response.data.id,
      symbol: response.data.symbol,
      name: response.data.name,
      image: response.data.image.large,
      current_price: currentPrice,
      market_cap: marketCap,
      market_cap_rank: marketData.market_cap_rank,
      total_volume: totalVolume,
      price_change_percentage_24h: marketData.price_change_percentage_24h,
      price_change_percentage_1h_in_currency: priceChange1h,
      price_change_percentage_7d_in_currency: priceChange7d,
      circulating_supply: marketData.circulating_supply,
      total_supply: marketData.total_supply,
      ath: ath,
      ath_change_percentage: athChangePercentage,
      currency: vsCurrency,
    };

    // Cache the successful response
    await saveCryptoDetailToCache(id, cryptoDetail);

    return cryptoDetail;
  } catch (error) {
    console.error('Error fetching crypto details:', error);

    // Check if it's a rate limit error
    if (isRateLimitError(error)) {
      console.log(`Rate limit reached, trying to use cached data for ${id}...`);
      const cachedDetail = await getCachedCryptoDetail(id);

      if (cachedDetail) {
        console.log(`Using cached data for ${id}`);
        return cachedDetail;
      }
    }

    throw error;
  }
};

// Helper function to format price data
const formatPriceData = (prices: [number, number][]) => {
  return prices.map(item => item[1]); // Extract just the price values
};

// Fetch price history from CoinGecko API
export const fetchPriceHistory = async (id: string, currency: string = 'usd') => {
  try {
    // Ensure currency is lowercase for CoinGecko API
    const vsCurrency = currency.toLowerCase();

    // Check for cached data first
    const cachedPriceHistory = await getCachedPriceHistory(id);
    if (cachedPriceHistory) {
      console.log(`Using cached price history for ${id}`);
      return cachedPriceHistory;
    }

    // CoinGecko free tier has a rate limit of 5-15 calls per minute
    // To avoid hitting rate limits, we'll make sequential requests with delays

    // Instead of making 3 separate API calls, let's use the market_chart/range endpoint
    // which allows us to get all the data in a single call

    // Calculate timestamps for 30 days ago, 7 days ago, and 1 day ago
    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - (24 * 60 * 60);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60);

    // Make a single API call to get all the data
    const response = await axios.get(`${COINGECKO_CONFIG.BASE_URL}/coins/${id}/market_chart/range`, {
      params: COINGECKO_CONFIG.getParams({
        vs_currency: vsCurrency,
        from: thirtyDaysAgo,
        to: now,
      }),
      headers: COINGECKO_CONFIG.getHeaders(),
    });

    // Process the data to create 1d, 7d, and 30d arrays
    const allPrices = response.data.prices;

    // Filter data points for different time ranges
    const oneDayData = allPrices.filter(([timestamp]: [number, number]) =>
      timestamp >= oneDayAgo * 1000
    );

    const sevenDayData = allPrices.filter(([timestamp]: [number, number]) =>
      timestamp >= sevenDaysAgo * 1000
    );

    const thirtyDayData = allPrices;

    // Format the data to match our app's expected structure
    const priceHistory = {
      '1d': formatPriceData(oneDayData),
      '7d': formatPriceData(sevenDayData),
      '30d': formatPriceData(thirtyDayData),
      'currency': vsCurrency,
    };

    // Cache the successful response
    await savePriceHistoryToCache(id, priceHistory);

    return priceHistory;
  } catch (error: any) {
    console.error('Error fetching price history:', error);

    // Check if it's a 401 Unauthorized error (likely due to rate limiting)
    const is401Error = error?.response?.status === 401;
    if (is401Error) {
      console.log('CoinGecko API returned 401 Unauthorized. This is likely due to rate limiting.');

      // Try with a longer delay and fewer data points as a fallback
      try {
        console.log('Trying fallback approach with longer delay...');

        // Add a longer delay
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Try to fetch historical data for a specific date instead
        // This is a different endpoint that might not be rate-limited the same way
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateString = `${yesterday.getDate()}-${yesterday.getMonth() + 1}-${yesterday.getFullYear()}`;

        // Keep the vsCurrency from the original request
        const vsCurrency = currency.toLowerCase();

        const fallbackResponse = await axios.get(`${COINGECKO_CONFIG.BASE_URL}/coins/${id}/history`, {
          params: COINGECKO_CONFIG.getParams({
            date: dateString,
          }),
          headers: COINGECKO_CONFIG.getHeaders(),
        });

        // If successful, create a simplified price history
        if (fallbackResponse.data && fallbackResponse.data.market_data) {
          // The history endpoint returns a single price point, so we'll create a simple array
          const currentPrice = fallbackResponse.data.market_data.current_price[vsCurrency] ||
            fallbackResponse.data.market_data.current_price.usd;
          const simplePriceHistory = {
            '1d': [currentPrice],
            '7d': [currentPrice],
            '30d': [currentPrice],
            'currency': vsCurrency
          };

          // Cache this partial data
          await savePriceHistoryToCache(id, simplePriceHistory);

          console.log('Successfully retrieved partial price history data');
          return simplePriceHistory;
        }
      } catch (fallbackError) {
        console.error('Fallback approach also failed:', fallbackError);
      }
    }

    // Check for cached data again (in case it was added after our initial check)
    const cachedPriceHistory = await getCachedPriceHistory(id);
    if (cachedPriceHistory) {
      console.log(`Using cached price history for ${id} after API error`);
      return cachedPriceHistory;
    }

    // If we can't get data from API or cache, return empty arrays
    console.log(`No price history data available for ${id}, returning empty data`);
    return createEmptyPriceHistory(currency);
  }
};

// Hyperliquid API base URL - using environment variable
const API_HYPERLIQUID_URL = HYPERLIQUID_API_URL || 'https://api.hyperliquid.xyz';

// Map CoinGecko IDs to Hyperliquid coin symbols
const coinGeckoToHyperliquidMap: Record<string, string> = {
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
  // Add more mappings as needed
};

// Fetch order book from Hyperliquid API
export const fetchOrderBook = async (id: string) => {
  try {
    // Check for cached data first
    const cachedOrderBook = await getCachedOrderBook(id);
    if (cachedOrderBook) {
      console.log(`Using cached order book for ${id}`);
      return cachedOrderBook;
    }

    // Get the Hyperliquid symbol for this coin
    const symbol = coinGeckoToHyperliquidMap[id] || 'BTC'; // Default to BTC if not found

    // Fetch the L2 order book data from Hyperliquid
    const response = await axios.post(`${API_HYPERLIQUID_URL}/info`, {
      type: 'l2Book',
      coin: symbol
    });

    // The Hyperliquid API returns data in the format:
    // { coin: "BTC", time: timestamp, levels: [[bid1, bid2, ...], [ask1, ask2, ...]] }
    // Each bid/ask has format { px: "price", sz: "size", n: number_of_orders }
    const l2Data = response.data;

    // Log the response format to help with debugging
    console.log('Hyperliquid API response:', JSON.stringify(l2Data).substring(0, 200));

    if (l2Data && l2Data.levels && Array.isArray(l2Data.levels) && l2Data.levels.length === 2) {
      const bids = l2Data.levels[0] || [];
      const asks = l2Data.levels[1] || [];

      // Format the bids and asks to match our app's expected structure
      const orderBook = {
        bids: bids.slice(0, 10).map((item: { px: string; sz: string }) => ({
          price: parseFloat(item.px),
          amount: parseFloat(item.sz),
        })),
        asks: asks.slice(0, 10).map((item: { px: string; sz: string }) => ({
          price: parseFloat(item.px),
          amount: parseFloat(item.sz),
        })),
      };

      // Cache the successful response
      await saveOrderBookToCache(id, orderBook);

      return orderBook;
    } else {
      // If we don't have valid data, throw an error to trigger the cache fallback
      throw new Error('Invalid order book data format from Hyperliquid API');
    }
  } catch (error) {
    console.error('Error fetching order book:', error);

    // Check if we have cached data
    const cachedOrderBook = await getCachedOrderBook(id);
    if (cachedOrderBook) {
      console.log(`Using cached order book for ${id}`);
      return cachedOrderBook;
    }

    // If we can't get data from API or cache, create an empty order book
    // We don't want to use mock data, so we'll return an empty order book
    console.log(`No cached order book data available for ${id}, returning empty order book`);
    return createEmptyOrderBook();
  }
};