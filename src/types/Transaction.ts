import type { Account } from './Account';

export type TransactionType = 'expense' | 'income' | 'transfer';
export type SMSTransactionType = 'debit' | 'credit' | 'transfer' | 'unknown';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  account: Account;
  toAccount?: Account;
  date: string;
  remarks?: string;
}


export interface SMSTransaction {
  id: string,
  type: SMSTransactionType;
  amount: number;
  sender: string;
  account?: string;
  date: Date;
  merchantName?: string;
  balance?: number;
  body: string;
}
