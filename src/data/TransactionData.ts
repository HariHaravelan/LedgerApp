import { Category, Account } from '../types/Transaction';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Food & Dining', icon: 'restaurant', type: 'expense' },
  { id: '2', name: 'Shopping', icon: 'cart', type: 'expense' },
  { id: '3', name: 'Transport', icon: 'car', type: 'expense' },
  { id: '4', name: 'Bills', icon: 'receipt', type: 'expense' },
  { id: '5', name: 'Health', icon: 'medical', type: 'expense' },
  { id: '6', name: 'Entertainment', icon: 'film', type: 'expense' },
  { id: '7', name: 'Salary', icon: 'cash', type: 'income' },
  { id: '8', name: 'Investment', icon: 'trending-up', type: 'income' },
  { id: '9', name: 'Others', icon: 'ellipsis-horizontal', type: 'income' },
];

export const ACCOUNTS: Account[] = [
  { id: '1', name: 'HDFC Savings', balance: 25000, type: 'bank' },
  { id: '2', name: 'ICICI Credit Card', balance: -15000, type: 'card' },
  { id: '3', name: 'Cash Wallet', balance: 5000, type: 'wallet' },
];