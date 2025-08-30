import { formatCurrency, getCurrencySymbol } from '@/components/CurrencySelector';
import { useSavings } from '@/hooks/savings-store';
import { useTheme } from '@/hooks/theme-store';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FileText, Minus, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'deposit' | 'withdrawal' }>();
  const { goals, addTransaction } = useSavings();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const goal = goals.find(g => g.id === id);
  const isDeposit = type === 'deposit';
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    header: {
      backgroundColor: theme.colors.surface,
      padding: 24,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    depositIcon: {
      backgroundColor: '#D1FAE5',
    },
    withdrawalIcon: {
      backgroundColor: '#FEE2E2',
    },
    goalName: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    currentBalance: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    form: {
      flex: 1,
      padding: 20,
    },
    inputGroup: {
      marginBottom: 24,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    inputWithIcon: {
      position: 'relative',
    },
    currencySymbol: {
      position: 'absolute',
      left: 16,
      top: 14,
      zIndex: 1,
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.textMuted,
    },
    descriptionIcon: {
      position: 'absolute',
      left: 16,
      top: 14,
      zIndex: 1,
    },
    textInputWithIcon: {
      paddingLeft: 48,
    },
    amountInput: {
      fontSize: 24,
      fontWeight: '600',
      paddingVertical: 16,
    },
    previewSection: {
      marginTop: 24,
    },
    previewTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    previewCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    previewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    previewLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    previewValue: {
      fontSize: 14,
      fontWeight: '500',
      color: '#111827',
    },
    depositText: {
      color: '#10B981',
    },
    withdrawalText: {
      color: '#EF4444',
    },
    footer: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    addButton: {
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    depositButton: {
      backgroundColor: '#10B981',
    },
    withdrawalButton: {
      backgroundColor: '#EF4444',
    },
    addButtonDisabled: {
      backgroundColor: '#9CA3AF',
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      marginBottom: 20,
    },
    backButton: {
      backgroundColor: '#3B82F6',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  if (!goal) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Goal Not Found' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Goal not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddTransaction = () => {
    const transactionAmount = parseFloat(amount);
    
    if (!transactionAmount || transactionAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!isDeposit && transactionAmount > goal.currentAmount) {
      Alert.alert(
        'Insufficient Funds',
        `You can't withdraw ${formatCurrency(transactionAmount, goal.currency || 'USD')} because your current balance is only ${formatCurrency(goal.currentAmount, goal.currency || 'USD')}.`
      );
      return;
    }

    setIsLoading(true);

    try {
      addTransaction(goal.id, {
        amount: transactionAmount,
        type: type,
        description: description.trim(),
        date: new Date().toISOString(),
      });

      router.back();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `${isDeposit ? 'Add Deposit' : 'Add Withdrawal'}`,
          headerBackTitle: 'Back'
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, isDeposit ? styles.depositIcon : styles.withdrawalIcon]}>
            {isDeposit ? (
              <Plus size={32} color="#10B981" />
            ) : (
              <Minus size={32} color="#EF4444" />
            )}
          </View>
          <Text style={styles.goalName}>{goal.name}</Text>
          <Text style={styles.currentBalance}>
            Current Balance: {formatCurrency(goal.currentAmount, goal.currency || 'USD')}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount</Text>
            <View style={styles.inputWithIcon}>
              <Text style={styles.currencySymbol}>{getCurrencySymbol(goal.currency || 'USD')}</Text>
              <TextInput
                style={[styles.textInput, styles.textInputWithIcon, styles.amountInput]}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                testID="transaction-amount-input"
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={styles.inputWithIcon}>
              <FileText size={20} color="#6B7280" style={styles.descriptionIcon} />
              <TextInput
                style={[styles.textInput, styles.textInputWithIcon]}
                value={description}
                onChangeText={setDescription}
                placeholder={isDeposit ? "e.g., Salary, Gift, Side hustle" : "e.g., Emergency expense, Changed plans"}
                placeholderTextColor="#9CA3AF"
                testID="transaction-description-input"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {amount && description && (
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Transaction Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Type</Text>
                  <Text style={[styles.previewValue, isDeposit ? styles.depositText : styles.withdrawalText]}>
                    {isDeposit ? 'Deposit' : 'Withdrawal'}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Amount</Text>
                  <Text style={[styles.previewValue, isDeposit ? styles.depositText : styles.withdrawalText]}>
                    {isDeposit ? '+' : '-'}{formatCurrency(parseFloat(amount || '0'), goal.currency || 'USD').replace(/^[^\d]*/, '')}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>New Balance</Text>
                  <Text style={styles.previewValue}>
                    {formatCurrency(
                      isDeposit 
                        ? goal.currentAmount + parseFloat(amount || '0')
                        : goal.currentAmount - parseFloat(amount || '0'),
                      goal.currency || 'USD'
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.addButton, 
              isDeposit ? styles.depositButton : styles.withdrawalButton,
              isLoading && styles.addButtonDisabled
            ]}
            onPress={handleAddTransaction}
            disabled={isLoading}
            testID="add-transaction-button"
          >
            <Text style={styles.addButtonText}>
              {isLoading ? 'Adding...' : `Add ${isDeposit ? 'Deposit' : 'Withdrawal'}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}