export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value < 1 ? Math.min(4, 20) : 2,
    minimumFractionDigits: value < 1 ? Math.min(4, 20) : 2,
  }).format(value);
};

export const formatLargeNumber = (value: number): string => {
  if (!value) return '0';
  
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  
  return `$${value.toFixed(2)}`;
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};