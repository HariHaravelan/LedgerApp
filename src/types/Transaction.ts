export type TransactionType = 'expense' | 'income';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id?: string;
  type: TransactionType;
  amount: number;
  accountId: string;
  categoryId: string;
  date: Date;
  remarks?: string;
}