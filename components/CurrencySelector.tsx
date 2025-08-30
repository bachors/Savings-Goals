import { useTheme } from '@/hooks/theme-store';
import { Currency } from '@/types/savings';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const CURRENCIES = [
  { code: 'USD' as Currency, symbol: '$', name: 'US Dollar' },
  { code: 'IDR' as Currency, symbol: 'Rp', name: 'Indonesian Rupiah' },
];

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const { theme } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    currencyOptions: {
      flexDirection: 'row',
      gap: 12,
    },
    currencyOption: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
    },
    selectedCurrency: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginBottom: 4,
    },
    currencyName: {
      fontSize: 12,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    selectedText: {
      color: '#FFFFFF',
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.label}>Currency</Text>
      <View style={dynamicStyles.currencyOptions}>
        {CURRENCIES.map((currency) => (
          <TouchableOpacity
            key={currency.code}
            style={[
              dynamicStyles.currencyOption,
              selectedCurrency === currency.code && dynamicStyles.selectedCurrency,
            ]}
            onPress={() => onCurrencyChange(currency.code)}
            testID={`currency-${currency.code}`}
          >
            <Text style={[
              dynamicStyles.currencySymbol,
              selectedCurrency === currency.code && dynamicStyles.selectedText,
            ]}>
              {currency.symbol}
            </Text>
            <Text style={[
              dynamicStyles.currencyName,
              selectedCurrency === currency.code && dynamicStyles.selectedText,
            ]}>
              {currency.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export function getCurrencySymbol(currency: Currency): string {
  const currencyData = CURRENCIES.find(c => c.code === currency);
  return currencyData?.symbol || '$';
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  
  if (currency === 'IDR') {
    return `${symbol} ${amount.toLocaleString('id-ID')}`;
  }
  
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

