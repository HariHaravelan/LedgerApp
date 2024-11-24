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
  { id: '10', name: 'Transfer', icon: 'ellipsis-horizontal', type: 'transfer' },
];

export const ACCOUNTS: Account[] = [
  { id: '1', name: 'HDFC Savings', balance: 25000, type: 'bank' },
  { id: '2', name: 'ICICI Credit Card', balance: -15000, type: 'card' },
  { id: '3', name: 'Amazon Pay', balance: 5000, type: 'wallet' },
  { id: '4', name: 'SBI Credit Card', balance: -150, type: 'card' },
  { id: '5', name: 'Paytm Wallet', balance: 4567, type: 'card' },
  { id: '6', name: 'Amex Credit Card', balance: 0, type: 'card' },
];


export const transactions: Transaction[] = [
  // Today
  {
    id: '1',
    date: '2024-11-14',
    category: CATEGORIES[0],
    remarks: 'Lunch with team',
    account: ACCOUNTS[0],
    amount: -850,
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-11-14',
    category: CATEGORIES[1],
    remarks: 'Groceries',
    account: ACCOUNTS[2],
    amount: -2100,
    type: 'expense'
  },
  // Yesterday
  {
    id: '3',
    date: '2024-11-13',
    category: CATEGORIES[6],
    remarks: 'Monthly Salary',
    account: ACCOUNTS[0],
    amount: 75000,
    type: 'income'
  },
  {
    id: '4',
    date: '2024-11-13',
    category: CATEGORIES[3],
    remarks: 'Electricity Bill',
    account: ACCOUNTS[3],
    amount: -3200,
    type: 'expense'
  },
  // 2 days ago
  {
    id: '5',
    date: '2024-11-12',
    category: CATEGORIES[2],
    remarks: 'Uber to Office',
    account: ACCOUNTS[4],
    amount: -250,
    type: 'expense'
  },
  {
    id: '6',
    date: '2024-11-12',
    category: CATEGORIES[5],
    remarks: 'Movie Tickets',
    account: ACCOUNTS[5],
    amount: -1200,
    type: 'expense'
  },
  // 3 days ago
  {
    id: '7',
    date: '2024-11-12',
    category: CATEGORIES[7],
    remarks: 'Mutual Fund SIP',
    account: ACCOUNTS[0],
    amount: -10000,
    type: 'expense'
  },
  // 4 days ago
  {
    id: '8',
    date: '2024-11-12',
    category: CATEGORIES[1],
    remarks: 'Amazon Purchase',
    account: ACCOUNTS[2],
    amount: -4500,
    type: 'expense'
  },
  // 5 days ago
  {
    id: '9',
    date: '2024-11-11',
    category: CATEGORIES[0],
    remarks: 'Dinner with Family',
    account: ACCOUNTS[5],
    amount: -3200,
    type: 'expense'
  },
  // 6 days ago
  {
    id: '10',
    date: '2024-11-10',
    category: CATEGORIES[3],
    remarks: 'Monthly Rent',
    account: ACCOUNTS[0],
    amount: -25000,
    type: 'expense'
  },
  {
    id: '11',
    date: '2024-11-14',
    category: CATEGORIES[9],
    remarks: 'Credit Card Bill',
    account: ACCOUNTS[0],
    toAccount: ACCOUNTS[5],
    amount: 25000,
    type: 'transfer'
  },
];