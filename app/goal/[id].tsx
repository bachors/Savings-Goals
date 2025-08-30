import { formatCurrency } from '@/components/CurrencySelector';
import ProgressRing from '@/components/ProgressRing';
import { useSavings } from '@/hooks/savings-store';
import { useTheme } from '@/hooks/theme-store';
import { Transaction } from '@/types/savings';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  Calendar,
  Clock,
  Edit3,
  Minus,
  Plus,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, calculateProgress, deleteGoal } = useSavings();
  const { theme } = useTheme();
  
  const goal = goals.find(g => g.id === id);
  
  if (!goal) {
    const errorStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      errorText: {
        fontSize: 18,
        color: theme.colors.textMuted,
        marginBottom: 20,
      },
      backButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
      },
      backButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600' as const,
      },
    });

    return (
      <SafeAreaView style={errorStyles.container}>
        <Stack.Screen options={{ title: 'Goal Not Found' }} />
        <View style={errorStyles.errorContainer}>
          <Text style={errorStyles.errorText}>Goal not found</Text>
          <TouchableOpacity 
            style={errorStyles.backButton}
            onPress={() => router.back()}
          >
            <Text style={errorStyles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = calculateProgress(goal);
  const targetDate = new Date(goal.targetDate).toLocaleDateString();

  const handleDeleteGoal = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id);
            router.back();
          },
        },
      ]
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isDeposit = item.type === 'deposit';
    const date = new Date(item.date).toLocaleDateString();
    
    const transactionStyles = StyleSheet.create({
      transactionDescription: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: theme.colors.text,
        marginBottom: 2,
      },
      transactionDate: {
        fontSize: 14,
        color: theme.colors.textMuted,
      },
      depositAmount: {
        color: theme.colors.success,
      },
      withdrawalAmount: {
        color: theme.colors.error,
      },
      depositIcon: {
        backgroundColor: theme.colors.successLight,
      },
      withdrawalIcon: {
        backgroundColor: theme.colors.errorLight,
      },
    });
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIcon, isDeposit ? transactionStyles.depositIcon : transactionStyles.withdrawalIcon]}>
          {isDeposit ? (
            <TrendingUp size={16} color={theme.colors.success} />
          ) : (
            <TrendingDown size={16} color={theme.colors.error} />
          )}
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={transactionStyles.transactionDescription}>{item.description}</Text>
          <Text style={transactionStyles.transactionDate}>{date}</Text>
        </View>
        
        <Text style={[styles.transactionAmount, isDeposit ? transactionStyles.depositAmount : transactionStyles.withdrawalAmount]}>
          {isDeposit ? '+' : '-'}{formatCurrency(item.amount, goal.currency || 'USD').replace(/^[^\d]*/, '')}
        </Text>
      </View>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    heroSection: {
      backgroundColor: theme.colors.surface,
      padding: 24,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    progressPercentage: {
      fontSize: 24,
      fontWeight: '800' as const,
      color: theme.colors.text,
    },
    progressLabel: {
      fontSize: 12,
      color: theme.colors.textMuted,
      marginTop: 4,
    },
    currentAmountLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    currentAmount: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: theme.colors.success,
    },
    targetAmountLabel: {
      fontSize: 14,
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    targetAmount: {
      fontSize: 20,
      fontWeight: '800' as const,
      color: theme.colors.primary,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.colors.border,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginTop: 8,
      marginBottom: 4,
      textAlign: 'center',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    sectionCard: {
      margin: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 20,
      padding: 20,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginBottom: 16,
    },
    requirementLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    requirementValue: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: theme.colors.text,
    },
    depositButton: {
      backgroundColor: theme.colors.success,
    },
    withdrawalButton: {
      backgroundColor: theme.colors.error,
    },
    emptyTransactionsText: {
      fontSize: 16,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    transactionSeparator: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: 8,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <Stack.Screen 
        options={{ 
          title: goal.name,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push(`/edit-goal/${goal.id}`)}
              >
                <Edit3 size={20} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleDeleteGoal}
              >
                <Trash2 size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.heroSection}>
          {goal.imageUri && (
            <Image source={{ uri: goal.imageUri }} style={styles.heroImage} />
          )}
          
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={progress.progressPercentage}
              size={120}
              strokeWidth={12}
              color={progress.isOnTrack ? theme.colors.success : theme.colors.warning}
              backgroundColor={theme.colors.border}
            >
              <Text style={dynamicStyles.progressPercentage}>
                {Math.round(progress.progressPercentage)}%
              </Text>
              <Text style={dynamicStyles.progressLabel}>Complete</Text>
            </ProgressRing>
            
            <View style={styles.progressInfo}>
              <View style={styles.amountInfo}>
                <Text style={dynamicStyles.currentAmountLabel}>Current Amount</Text>
                <Text style={dynamicStyles.currentAmount}>
                  {formatCurrency(goal.currentAmount, goal.currency || 'USD')}
                </Text>
              </View>
              
              <View style={styles.targetInfo}>
                <Text style={dynamicStyles.targetAmountLabel}>Target Amount</Text>
                <Text style={dynamicStyles.targetAmount}>
                  {formatCurrency(goal.targetAmount, goal.currency || 'USD')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <View style={dynamicStyles.statCard}>
            <Target size={24} color={theme.colors.primary} />
            <Text style={dynamicStyles.statValue}>{formatCurrency(progress.remainingAmount, goal.currency || 'USD')}</Text>
            <Text style={dynamicStyles.statLabel}>Remaining</Text>
          </View>
          
          <View style={dynamicStyles.statCard}>
            <Clock size={24} color={theme.colors.secondary} />
            <Text style={dynamicStyles.statValue}>{progress.daysRemaining}</Text>
            <Text style={dynamicStyles.statLabel}>Days Left</Text>
          </View>
          
          <View style={dynamicStyles.statCard}>
            <Calendar size={24} color={theme.colors.success} />
            <Text style={dynamicStyles.statValue}>{targetDate}</Text>
            <Text style={dynamicStyles.statLabel}>Target Date</Text>
          </View>
        </View>

        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>Savings Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Text style={dynamicStyles.requirementLabel}>Per Day</Text>
              <Text style={dynamicStyles.requirementValue}>
                {formatCurrency(progress.requiredPerDay, goal.currency || 'USD')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={dynamicStyles.requirementLabel}>Per Week</Text>
              <Text style={dynamicStyles.requirementValue}>
                {formatCurrency(progress.requiredPerWeek, goal.currency || 'USD')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Text style={dynamicStyles.requirementLabel}>Per Month</Text>
              <Text style={dynamicStyles.requirementValue}>
                {formatCurrency(progress.requiredPerMonth, goal.currency || 'USD')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={[styles.actionButton, dynamicStyles.depositButton]}
            onPress={() => router.push(`/add-transaction/${goal.id}?type=deposit`)}
            testID="add-deposit-button"
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Deposit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, dynamicStyles.withdrawalButton]}
            onPress={() => router.push(`/add-transaction/${goal.id}?type=withdrawal`)}
            testID="add-withdrawal-button"
          >
            <Minus size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Add Withdrawal</Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.sectionCard}>
          <Text style={dynamicStyles.sectionTitle}>Recent Transactions</Text>
          {goal.transactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={dynamicStyles.emptyTransactionsText}>
                No transactions yet. Add your first deposit to get started!
              </Text>
            </View>
          ) : (
            <FlatList
              data={goal.transactions.slice().reverse()}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={dynamicStyles.transactionSeparator} />}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
  },
  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    marginBottom: 24,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 32,
  },
  amountInfo: {
    alignItems: 'center',
  },
  currentAmountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  targetInfo: {
    alignItems: 'center',
  },
  targetAmountLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  targetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statsSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  requirementsSection: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  requirementLabel: {
    fontSize: 16,
    color: '#374151',
  },
  requirementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  depositButton: {
    backgroundColor: '#10B981',
  },
  withdrawalButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsSection: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTransactions: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyTransactionsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  depositIcon: {
    backgroundColor: '#D1FAE5',
  },
  withdrawalIcon: {
    backgroundColor: '#FEE2E2',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  depositAmount: {
    color: '#10B981',
  },
  withdrawalAmount: {
    color: '#EF4444',
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
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