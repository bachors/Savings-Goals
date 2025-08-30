import { SavingsCalculation, SavingsGoal, Transaction } from '@/types/savings';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

const STORAGE_KEY = 'savings_goals';

export const [SavingsProvider, useSavings] = createContextHook(() => {
  const queryClient = useQueryClient();

  const goalsQuery = useQuery({
    queryKey: ['savings-goals'],
    queryFn: async (): Promise<SavingsGoal[]> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error loading goals:', error);
        return [];
      }
    }
  });

  const saveGoalsMutation = useMutation({
    mutationFn: async (goals: SavingsGoal[]) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      return goals;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
    }
  });

  const goals = goalsQuery.data || [];

  const addGoal = useCallback((goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'transactions'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      currentAmount: 0,
      transactions: [],
      currency: goal.currency || 'USD'
    };
    const updatedGoals = [...goals, newGoal];
    saveGoalsMutation.mutate(updatedGoals);
  }, [goals, saveGoalsMutation]);

  const updateGoal = useCallback((goalId: string, updates: Partial<SavingsGoal>) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    );
    saveGoalsMutation.mutate(updatedGoals);
  }, [goals, saveGoalsMutation]);

  const deleteGoal = useCallback((goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoalsMutation.mutate(updatedGoals);
  }, [goals, saveGoalsMutation]);

  const addTransaction = useCallback((goalId: string, transaction: Omit<Transaction, 'id' | 'goalId'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      goalId
    };

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newCurrentAmount = transaction.type === 'deposit' 
          ? goal.currentAmount + transaction.amount
          : goal.currentAmount - transaction.amount;
        
        return {
          ...goal,
          currentAmount: Math.max(0, newCurrentAmount),
          transactions: [...goal.transactions, newTransaction]
        };
      }
      return goal;
    });

    saveGoalsMutation.mutate(updatedGoals);
  }, [goals, saveGoalsMutation]);

  const calculateProgress = useCallback((goal: SavingsGoal): SavingsCalculation => {
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);
    const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
    
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    
    const requiredPerDay = daysRemaining > 0 ? remainingAmount / daysRemaining : 0;
    const requiredPerWeek = requiredPerDay * 7;
    const requiredPerMonth = requiredPerDay * 30;
    
    const isOnTrack = progressPercentage >= ((Date.now() - new Date(goal.createdAt).getTime()) / (targetDate.getTime() - new Date(goal.createdAt).getTime())) * 100;

    return {
      remainingAmount,
      progressPercentage,
      daysRemaining,
      requiredPerDay,
      requiredPerWeek,
      requiredPerMonth,
      isOnTrack
    };
  }, []);

  return {
    goals,
    isLoading: goalsQuery.isLoading,
    addGoal,
    updateGoal,
    deleteGoal,
    addTransaction,
    calculateProgress
  };
});