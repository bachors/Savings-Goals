export type Currency = 'USD' | 'IDR';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  currency: Currency;
  imageUri?: string;
  createdAt: string;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  date: string;
}

export interface SavingsCalculation {
  remainingAmount: number;
  progressPercentage: number;
  daysRemaining: number;
  requiredPerDay: number;
  requiredPerWeek: number;
  requiredPerMonth: number;
  isOnTrack: boolean;
}