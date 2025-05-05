import { CurrencyType } from '@/context/ThemeContext';
import { CURRENCY_SYMBOLS, getDecimalPlaces, getLocaleForCurrency } from './currencyUtils';

/**
 * Format a currency value for display
 * @param value The value to format (already in the target currency)
 * @param currency The currency to format in
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  currency: CurrencyType = 'USD'
): string => {
  // Get appropriate decimal places based on the value and currency
  const decimalPlaces = getDecimalPlaces(currency, value);

  // Get appropriate locale for the currency
  const locale = getLocaleForCurrency(currency);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Format a large number with appropriate suffix (K, M, B, T)
 * @param value The value to format (already in the target currency)
 * @param currency The currency to format in
 * @returns Formatted string with currency symbol and suffix
 */
export const formatLargeNumber = (
  value: number,
  currency: CurrencyType = 'USD'
): string => {
  if (!value) return '0';

  // Get the currency symbol
  const symbol = CURRENCY_SYMBOLS[currency];

  if (value >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(2)}K`;
  }

  return `${symbol}${value.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};