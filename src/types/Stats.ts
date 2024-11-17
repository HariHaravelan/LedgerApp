// src/types/stats.ts
export type PeriodType = 'weekly' | 'monthly' | 'annually' | 'custom';
export type ChartType = 'income' | 'expenses';

export interface PeriodOption {
  value: PeriodType;
  label: string;
  icon: string;
}

export interface TransactionData {
  name: string;
  value: number;
  color: string;
  transactions: number;
  trend: number;
}