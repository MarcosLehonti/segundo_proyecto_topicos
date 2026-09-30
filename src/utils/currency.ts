import { CurrencyConfig } from '../types';

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  BOB: 'Bs',
  EUR: '€',
  ARS: '$',
};

export const convertAmount = (
  amountInUSD: number,
  targetCurrency: string,
  currencyConfig: CurrencyConfig
): number => {
  const rate = currencyConfig.rates[targetCurrency] || 1;
  return amountInUSD * rate;
};

export const convertToUSD = (
  amountInCurrency: number,
  currency: string,
  currencyConfig: CurrencyConfig
): number => {
  const rate = currencyConfig.rates[currency] || 1;
  return amountInCurrency / rate;
};

export const formatCurrency = (
  amountInUSD: number,
  currencyConfig: CurrencyConfig
): string => {
  const targetCurrency = currencyConfig.selectedCurrency;
  const converted = convertAmount(amountInUSD, targetCurrency, currencyConfig);
  const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency;

  const formattedNumber = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);

  return `${symbol} ${formattedNumber}`;
};
