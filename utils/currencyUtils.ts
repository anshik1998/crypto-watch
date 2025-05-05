import { CurrencyType } from '@/context/ThemeContext';

// Currency symbols for formatting
export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'AUD': 'A$',
  'INR': '₹',
};

// Approximate exchange rates (as of implementation)
// These would ideally come from an API, but for simplicity we'll use static values
// In a production app, these should be fetched from a currency exchange API
export const EXCHANGE_RATES: Record<CurrencyType, number> = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 151.5,
  'AUD': 1.52,
  'INR': 83.5,
};

/**
 * Convert a value from USD to the target currency
 * @param valueInUsd Value in USD
 * @param targetCurrency Target currency code
 * @returns Value in target currency
 */
export const convertFromUsd = (valueInUsd: number, targetCurrency: CurrencyType): number => {
  if (targetCurrency === 'USD') return valueInUsd;
  return valueInUsd * EXCHANGE_RATES[targetCurrency];
};

/**
 * Convert a value from the source currency to USD
 * @param value Value in source currency
 * @param sourceCurrency Source currency code
 * @returns Value in USD
 */
export const convertToUsd = (value: number, sourceCurrency: CurrencyType): number => {
  if (sourceCurrency === 'USD') return value;
  return value / EXCHANGE_RATES[sourceCurrency];
};

/**
 * Get the appropriate number of decimal places based on currency and value
 * @param currency Currency code
 * @param value Value to format
 * @returns Number of decimal places
 */
export const getDecimalPlaces = (currency: CurrencyType, value: number): number => {
  // JPY typically doesn't use decimal places
  if (currency === 'JPY') return 0;
  
  // For small values, show more decimal places
  if (value < 1) return 4;
  
  // Default to 2 decimal places
  return 2;
};

/**
 * Get locale for number formatting based on currency
 * @param currency Currency code
 * @returns Appropriate locale string
 */
export const getLocaleForCurrency = (currency: CurrencyType): string => {
  switch (currency) {
    case 'USD':
    case 'AUD':
      return 'en-US';
    case 'EUR':
      return 'de-DE'; // Using German locale for Euro
    case 'GBP':
      return 'en-GB';
    case 'JPY':
      return 'ja-JP';
    case 'INR':
      return 'en-IN';
    default:
      return 'en-US';
  }
};
