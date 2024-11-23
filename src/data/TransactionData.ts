import { Category, Account, Transaction } from '../types/Transaction';

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


export const transactions: Transaction[] = [
  // Today
  {
    id: '1',
    date: '2024-11-14',
    category: 'Food',
    remarks: 'Lunch with team',
    account: 'HDFC Debit Card',
    amount: -850,
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-11-14',
    category: 'Shopping',
    remarks: 'Groceries',
    account: 'Amazon Pay',
    amount: -2100,
    type: 'expense'
  },
  // Yesterday
  {
    id: '3',
    date: '2024-11-13',
    category: 'Salary',
    remarks: 'Monthly Salary',
    account: 'HDFC Savings',
    amount: 75000,
    type: 'income'
  },
  {
    id: '4',
    date: '2024-11-13',
    category: 'Bills',
    remarks: 'Electricity Bill',
    account: 'SBI Credit Card',
    amount: -3200,
    type: 'expense'
  },
  // 2 days ago
  {
    id: '5',
    date: '2024-11-12',
    category: 'Transport',
    remarks: 'Uber to Office',
    account: 'Paytm Wallet',
    amount: -250,
    type: 'expense'
  },
  {
    id: '6',
    date: '2024-11-12',
    category: 'Entertainment',
    remarks: 'Movie Tickets',
    account: 'HDFC Credit Card',
    amount: -1200,
    type: 'expense'
  },
  // 3 days ago
  {
    id: '7',
    date: '2024-11-12',
    category: 'Investment',
    remarks: 'Mutual Fund SIP',
    account: 'ICICI Savings',
    amount: -10000,
    type: 'expense'
  },
  // 4 days ago
  {
    id: '8',
    date: '2024-11-12',
    category: 'Shopping',
    remarks: 'Amazon Purchase',
    account: 'Amazon Pay Card',
    amount: -4500,
    type: 'expense'
  },
  // 5 days ago
  {
    id: '9',
    date: '2024-11-11',
    category: 'Food',
    remarks: 'Dinner with Family',
    account: 'HDFC Credit Card',
    amount: -3200,
    type: 'expense'
  },
  // 6 days ago
  {
    id: '10',
    date: '2024-11-10',
    category: 'Rent',
    remarks: 'Monthly Rent',
    account: 'HDFC Savings',
    amount: -25000,
    type: 'expense'
  },
];