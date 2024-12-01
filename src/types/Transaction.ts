export type TransactionType = 'expense' | 'income' | 'transfer';

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
  type: 'debit' | 'credit' | 'transfer' | 'unknown';
  amount: number;
  sender: string;
  account?: string;
  date: Date;
  merchantName?: string;
  balance?: number;
  body: string;
}