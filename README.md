# Crypto Market App

A React Native application for tracking cryptocurrency market data using real-world APIs.

## Environment Variables

The application uses environment variables for API configuration. Create a `.env` file in the root directory with the following variables:

```
# API Keys
COINGECKO_API_KEY=your-api-key

# API URLs
COINGECKO_API_URL=https://api.coingecko.com/api/v3
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
```

### API Keys

- **COINGECKO_API_KEY**: Using CoinGecko API key (free tier).

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Features

- Real-time cryptocurrency market data
- Price history charts
- Order book visualization
- WebSocket integration for live updates
- Caching for offline use and rate limit handling

## API Integration

The application integrates with the following APIs:

- **CoinGecko API**: For cryptocurrency market data and price history
- **Hyperliquid API**: For order book data and real-time updates via WebSocket

## Caching Strategy

The application implements a robust caching strategy to handle API rate limits and provide offline functionality:

1. Check for cached data first
2. Try to fetch fresh data from APIs
3. Fall back to cached data if API requests fail
4. Show empty data only as a last resort

## Error Handling

The application includes comprehensive error handling to ensure a smooth user experience:

- Graceful handling of API rate limits
- Fallback to alternative endpoints when needed
- Clear user feedback when using cached data
