import { useState, useEffect } from 'react';
import { useCryptoData } from './useCryptoData';
import { useTheme } from './useTheme';
import { fetchCryptoDetail, fetchPriceHistory, fetchOrderBook } from '@/utils/api';
import { CryptoCurrency } from '@/context/CryptoDataContext';
import {
  getHyperliquidSymbol,
  getHyperliquidWebSocketUrl,
  createHyperliquidSubscriptionMessage
} from '@/utils/hyperliquidUtils';

interface OrderBookEntry {
  price: number;
  amount: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface PriceHistory {
  '1d': number[];
  '7d': number[];
  '30d': number[];
  currency?: string;
}

export const useCryptoDetail = (id: string | undefined) => {
  const { cryptoData } = useCryptoData();
  const { currency } = useTheme();
  const [crypto, setCrypto] = useState<CryptoCurrency | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory>({
    '1d': [],
    '7d': [],
    '30d': [],
    currency: currency.toLowerCase(),
  });
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);

  // Type for WebSocket message data
  type WebSocketMessageData = {
    channel: string;
    data: {
      coin?: string;
      time?: number;
      levels?: Array<Array<{ px: string; sz: string; n: number }>>;
      [key: string]: any;
    };
  };

  useEffect(() => {
    let wsConnection: WebSocket | null = null;
    // Flag to enable WebSocket (set to true to use WebSocket)
    const useWebSocket = true;

    const loadData = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // First try to get crypto from context
        const contextCrypto = cryptoData?.find((c: CryptoCurrency) => c.id === id);

        if (contextCrypto) {
          setCrypto(contextCrypto);
        } else {
          try {
            // If not found in context, fetch it with the current currency
            const fetchedCrypto = await fetchCryptoDetail(id, currency.toLowerCase());
            setCrypto(fetchedCrypto);
          } catch (err: any) {
            console.error('Error fetching crypto details:', err);

            // If we couldn't fetch the data, show an error
            if (!crypto) {
              setError('Failed to fetch cryptocurrency details. Please try again.');
              setLoading(false);
              return;
            }
          }
        }

        // Fetch price history with the current currency
        try {
          const history = await fetchPriceHistory(id, currency.toLowerCase());
          setPriceHistory(history);
        } catch (err) {
          console.error('Error fetching price history:', err);
        }

        // Fetch initial order book
        try {
          const book = await fetchOrderBook(id);
          setOrderBook(book);
        } catch (err) {
          console.error('Error fetching order book:', err);
        }
      } catch (err) {
        console.error('Error fetching crypto details:', err);

        // Only set error if we don't have any crypto data
        if (!crypto) {
          setError('Failed to fetch cryptocurrency details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    const setupWebSocket = async () => {
      if (!id) return;

      try {
        // Import the mapping from the API utils
        const symbol = await getHyperliquidSymbol(id);

        // Close any existing connection
        if (wsConnection) {
          wsConnection.close();
        }

        // Connect to Hyperliquid WebSocket API
        const wsUrl = getHyperliquidWebSocketUrl();
        wsConnection = new WebSocket(wsUrl);

        wsConnection.onopen = () => {
          console.log('WebSocket connection established');

          // Subscribe to L2 order book updates
          if (wsConnection) {
            // Use the utility function to create the subscription message
            const subscriptionMessage = createHyperliquidSubscriptionMessage(symbol);
            wsConnection.send(JSON.stringify(subscriptionMessage));

            // Log the subscription
            console.log(`Subscribed to L2 order book for ${symbol}`);
          }
        };

        wsConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WebSocketMessageData;
            console.log('WebSocket message received:', JSON.stringify(data).substring(0, 200));

            // Hyperliquid WebSocket response format from logs:
            // { channel: 'l2Book', data: { coin: "BTC", time: timestamp, levels: [...] } }
            // Where levels contains the order book data
            if (data.channel === 'l2Book' && data.data) {
              // Log the full data structure to understand the format
              console.log('WebSocket l2Book data structure:',
                JSON.stringify({
                  coin: data.data.coin,
                  time: data.data.time,
                  hasLevels: !!data.data.levels,
                  levelsType: data.data.levels ? typeof data.data.levels : 'undefined',
                  levelsIsArray: data.data.levels ? Array.isArray(data.data.levels) : false,
                  levelsLength: data.data.levels ? data.data.levels.length : 0
                })
              );

              // Check if we have the expected structure
              if (data.data.levels) {
                // Extract bids and asks based on the actual structure
                // The structure seems to be an array of arrays, where each inner array
                // contains objects with px, sz, and n properties
                const allLevels = data.data.levels;

                // Assuming the first array contains bids and the second contains asks
                // This might need adjustment based on the actual data structure
                const bids = Array.isArray(allLevels[0]) ? allLevels[0] : [];
                const asks = Array.isArray(allLevels[1]) ? allLevels[1] : [];

                // Format the data to match our app's structure
                const orderBookUpdate = {
                  bids: bids.slice(0, 10).map((item: { px: string; sz: string }) => ({
                    price: parseFloat(item.px),
                    amount: parseFloat(item.sz),
                  })),
                  asks: asks.slice(0, 10).map((item: { px: string; sz: string }) => ({
                    price: parseFloat(item.px),
                    amount: parseFloat(item.sz),
                  })),
                };

                setOrderBook(orderBookUpdate);
              } else {
                console.log('WebSocket data format unexpected:', JSON.stringify(data.data).substring(0, 100));
              }
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };

        wsConnection.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        wsConnection.onclose = () => {
          console.log('WebSocket connection closed');
        };
      } catch (err) {
        console.error('Error setting up WebSocket:', err);
      }
    };

    loadData();

    // Try to set up WebSocket for real-time order book updates if enabled
    if (useWebSocket) {
      // We need to use an IIFE (Immediately Invoked Function Expression)
      // to handle the async setupWebSocket function
      (async () => {
        try {
          await setupWebSocket();
        } catch (error) {
          console.error('Error setting up WebSocket:', error);
        }
      })();
    }

    // Set up interval to refresh order book data
    // This will be the primary method if WebSocket is disabled
    // Or a fallback if WebSocket fails
    const intervalId = setInterval(async () => {
      // Skip if WebSocket is working
      if (!id || (useWebSocket && wsConnection && wsConnection.readyState === WebSocket.OPEN)) {
        return;
      }

      try {
        // Fetch the order book with the latest symbol mapping
        const book = await fetchOrderBook(id);
        setOrderBook(book);
      } catch (err) {
        console.error('Error refreshing order book:', err);
      }
    }, 10000); // Every 10 seconds

    // Clean up
    return () => {
      clearInterval(intervalId);
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, [id, cryptoData, crypto, currency]);

  return { crypto, loading, error, priceHistory, orderBook };
};