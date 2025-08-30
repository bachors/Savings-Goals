import { formatCurrency } from '@/components/CurrencySelector';
import ProgressRing from '@/components/ProgressRing';
import { useSavings } from '@/hooks/savings-store';
import { useTheme } from '@/hooks/theme-store';
import { SavingsGoal } from '@/types/savings';
import { router } from 'expo-router';
import { Calendar, Moon, Plus, Smartphone, Sun, Target, TrendingUp } from 'lucide-react-native';
import React from 'react';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function GoalsScreen() {
  const { goals, calculateProgress } = useSavings();
  const { theme, themeMode, setThemeMode } = useTheme();

  const handleThemeToggle = () => {
    if (themeMode === 'light') {
      setThemeMode('dark');
    } else if (themeMode === 'dark') {
      setThemeMode('system');
    } else {
      setThemeMode('light');
    }
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Sun size={20} color={theme.colors.text} />;
      case 'dark':
        return <Moon size={20} color={theme.colors.text} />;
      default:
        return <Smartphone size={20} color={theme.colors.text} />;
    }
  };

  const renderGoalCard = ({ item: goal }: { item: SavingsGoal }) => {
    const progress = calculateProgress(goal);
    const targetDate = new Date(goal.targetDate).toLocaleDateString();

    const dynamicStyles = StyleSheet.create({
      goalCard: {
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: theme.isDark ? 0.3 : 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: theme.isDark ? 1 : 0,
        borderColor: theme.colors.border,
      },
      goalName: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: theme.colors.text,
        marginBottom: 8,
      },
      goalTarget: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontWeight: '600' as const,
      },
      goalDate: {
        fontSize: 14,
        color: theme.colors.textMuted,
      },
      progressText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: theme.colors.text,
      },
      currentAmount: {
        fontSize: 20,
        fontWeight: '800' as const,
        color: theme.colors.success,
      },
      remainingAmount: {
        fontSize: 14,
        color: theme.colors.textMuted,
        marginTop: 2,
      },
      requirementText: {
        fontSize: 14,
        color: theme.colors.textMuted,
        fontWeight: '500' as const,
      },
    });

    return (
      <TouchableOpacity 
        style={dynamicStyles.goalCard}
        onPress={() => router.push(`/goal/${goal.id}`)}
        testID={`goal-card-${goal.id}`}
      >
        <View style={styles.cardHeader}>
          {goal.imageUri && (
            <Image source={{ uri: goal.imageUri }} style={styles.goalImage} />
          )}
          <View style={styles.goalInfo}>
            <Text style={dynamicStyles.goalName}>{goal.name}</Text>
            <View style={styles.goalMeta}>
              <Target size={14} color={theme.colors.textMuted} />
              <Text style={dynamicStyles.goalTarget}>{formatCurrency(goal.targetAmount, goal.currency || 'USD')}</Text>
              <Calendar size={14} color={theme.colors.textMuted} />
              <Text style={dynamicStyles.goalDate}>{targetDate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressRing
            progress={progress.progressPercentage}
            size={80}
            strokeWidth={8}
            color={progress.isOnTrack ? theme.colors.success : theme.colors.warning}
            backgroundColor={theme.colors.border}
          >
            <Text style={dynamicStyles.progressText}>
              {Math.round(progress.progressPercentage)}%
            </Text>
          </ProgressRing>

          <View style={styles.progressDetails}>
            <View style={styles.amountRow}>
              <Text style={dynamicStyles.currentAmount}>
                {formatCurrency(goal.currentAmount, goal.currency || 'USD')}
              </Text>
              <Text style={dynamicStyles.remainingAmount}>
                {formatCurrency(progress.remainingAmount, goal.currency || 'USD')} left
              </Text>
            </View>
            
            <View style={styles.requirementRow}>
              <TrendingUp size={14} color={theme.colors.textMuted} />
              <Text style={dynamicStyles.requirementText}>
                {formatCurrency(progress.requiredPerDay, goal.currency || 'USD')}/day needed
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: theme.isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      color: theme.colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeButton: {
      backgroundColor: theme.colors.primaryLight,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
    },
    emptyTitle: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: theme.colors.text,
      marginTop: 24,
      marginBottom: 12,
    },
    emptyDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
    },
    createFirstButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 16,
      borderRadius: 16,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    createFirstButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700' as const,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.title}>Savings Goals</Text>
        <View style={dynamicStyles.headerActions}>
          <TouchableOpacity 
            style={dynamicStyles.themeButton}
            onPress={handleThemeToggle}
            testID="theme-toggle-button"
          >
            {getThemeIcon()}
          </TouchableOpacity>
          <TouchableOpacity 
            style={dynamicStyles.addButton}
            onPress={() => router.push('/create-goal')}
            testID="add-goal-button"
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {goals.length === 0 ? (
        <View style={dynamicStyles.emptyState}>
          <Target size={80} color={theme.colors.textMuted} />
          <Text style={dynamicStyles.emptyTitle}>No Goals Yet</Text>
          <Text style={dynamicStyles.emptyDescription}>
            Create your first savings goal to start tracking your progress and achieve your dreams
          </Text>
          <TouchableOpacity 
            style={dynamicStyles.createFirstButton}
            onPress={() => router.push('/create-goal')}
          >
            <Text style={dynamicStyles.createFirstButtonText}>Create Your First Goal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={goals}
            renderItem={renderGoalCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.goalsListWithWidget}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  goalsList: {
    padding: 20,
  },
  goalsListWithWidget: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  goalImage: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDetails: {
    flex: 1,
    marginLeft: 20,
  },
  amountRow: {
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});