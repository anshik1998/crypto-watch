# CryptoWatch

![CryptoWatch Logo](assets/images/icon.png)

A comprehensive React Native mobile application for tracking cryptocurrency market data in real-time. CryptoWatch provides users with detailed information about cryptocurrencies, including price charts, order books, and market statistics.

Crafted with ❤ by [Anshik Bansal](https://anshik1998.github.io)

## 📱 Demo Video

[![CryptoWatch Demo](https://img.youtube.com/vi/v_HzJVnpKWU/0.jpg)](https://youtu.be/v_HzJVnpKWU?si=vP_4iHh7JCs5-5ub)

## ✨ Features

### Home Screen
- Real-time cryptocurrency market data with price updates
- Market overview with total market cap and volume statistics
- Toggle between list and grid view for crypto listings
- Pull-to-refresh functionality for latest data
- Visual indicators for price changes with animations
- Sorting options for cryptocurrency listings

### Search & Filtering
- Search cryptocurrencies by name or symbol
- Advanced filtering options:
  - Price range filtering
  - Market cap filtering
  - Multiple sorting options (Market Cap, Price, Name, 24h Change)
  - Ascending/Descending sorting

### Cryptocurrency Details
- Detailed information for each cryptocurrency
- Interactive price charts with multiple time ranges (1d, 7d, 30d)
- Real-time order book visualization with bid/ask prices
- Key statistics including:
  - Current price with 24h change
  - Market cap and volume
  - All-time high price
  - Circulating and total supply

### Settings & Customization
- Dark mode / Light mode toggle
- Multiple currency options (USD, EUR, GBP, JPY, AUD, INR)
- Notification preferences
- Onboarding experience with reset option

### Technical Features
- WebSocket integration for live order book updates
- Robust caching system for offline use and API rate limit handling
- Dynamic symbol mapping for cryptocurrency data
- Haptic feedback for enhanced user experience
- Smooth animations and transitions

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **UI Components**: Custom components with Lucide React Native icons
- **Data Visualization**: React Native Chart Kit
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for caching and preferences
- **API Integration**: Axios for REST API calls, WebSockets for real-time data
- **Styling**: StyleSheet with theming support

## 📊 API Integration

The application integrates with the following APIs:

- **CoinGecko API**: For cryptocurrency market data, price history, and general market statistics
- **Hyperliquid API**: For order book data and real-time updates via WebSocket

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
# API Keys
COINGECKO_API_KEY=your-api-key

# API URLs
COINGECKO_API_URL=https://api.coingecko.com/api/v3
HYPERLIQUID_API_URL=https://api.hyperliquid.xyz
```

#### API Keys

- **COINGECKO_API_KEY**: You can obtain a free API key from [CoinGecko](https://www.coingecko.com/en/api).

### Installation

```bash
# Clone the repository
git clone https://github.com/anshik1998/crypto-watch.git
cd crypto-watch

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on a Device or Emulator

- For iOS: `npm run ios`
- For Android: `npm run android`
- For web: `npm run web`

You can also scan the QR code with the Expo Go app on your physical device.

## 📁 Project Structure

```
crypto-watch/
├── app/                  # Main application screens using Expo Router
│   ├── (tabs)/           # Tab-based screens (Home, Search, Settings)
│   ├── details/          # Cryptocurrency detail screens
│   ├── onboarding/       # Onboarding screens
│   └── splash.tsx        # Splash screen
├── assets/               # Static assets like images and fonts
├── components/           # Reusable UI components
├── context/              # React Context providers
├── hooks/                # Custom React hooks
├── utils/                # Utility functions and helpers
│   ├── api.ts            # API integration functions
│   ├── cache.ts          # Caching utilities
│   ├── currencyUtils.ts  # Currency conversion utilities
│   ├── formatters.ts     # Data formatting utilities
│   └── hyperliquidUtils.ts # Hyperliquid API utilities
└── types/                # TypeScript type definitions
```

## 💾 Caching Strategy

The application implements a robust caching strategy to handle API rate limits and provide offline functionality:

1. Check for cached data first (with expiration time validation)
2. Try to fetch fresh data from APIs
3. Fall back to cached data if API requests fail or rate limits are hit
4. Show empty data only as a last resort

## 🔄 State Management

The application uses React Context API for state management:

- **ThemeContext**: Manages theme (dark/light) and currency preferences
- **CryptoDataContext**: Manages cryptocurrency data and market statistics
- **OnboardingContext**: Manages onboarding state

## 🌐 Currency Support

The application supports multiple currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- AUD (Australian Dollar)
- INR (Indian Rupee)

All prices, market caps, and volumes are converted to the selected currency.

## 🛡️ Error Handling

The application includes comprehensive error handling to ensure a smooth user experience:

- Graceful handling of API rate limits
- Fallback to alternative endpoints when needed
- Clear user feedback when using cached data
- Retry mechanisms for failed API calls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

## 📧 Support

For support, please email [anshik1998@gmail.com](mailto:anshik1998@gmail.com).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Hyperliquid API](https://hyperliquid.xyz) for order book data
- [Expo](https://expo.dev/) for the development framework
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- All the open-source libraries used in this project