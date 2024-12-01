import { Category, Transaction } from '../types/Transaction';
import { ACCOUNT_SUBTYPES, ACCOUNT_TYPES } from './AccountsData';

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

// Then define the accounts data
export const ACCOUNTS: Account[] = [
  {
    id: '1',
    name: 'HDFC Savings',
    type: ACCOUNT_TYPES[0],           // bank
    subType: ACCOUNT_SUBTYPES[0],     // savings
    balance: 25000,
    institution: 'HDFC Bank',
    lastSync: new Date().toISOString(),
    notes: 'Primary savings account'
  },
  {
    id: '2',
    name: 'ICICI Credit Card',
    type: ACCOUNT_TYPES[2],           // card
    subType: ACCOUNT_SUBTYPES[6],     // credit
    balance: -15000,
    institution: 'ICICI Bank',
    lastSync: new Date().toISOString(),
    notes: 'Primary credit card'
  },
  {
    id: '3',
    name: 'Amazon Pay',
    type: ACCOUNT_TYPES[1],           // wallet
    subType: ACCOUNT_SUBTYPES[3],     // amazonpay
    balance: 5000,
    institution: 'Amazon',
    lastSync: new Date().toISOString(),
    notes: 'Digital wallet for online shopping'
  },
  {
    id: '4',
    name: 'SBI Credit Card',
    type: ACCOUNT_TYPES[2],           // card
    subType: ACCOUNT_SUBTYPES[6],     // credit
    balance: -150,
    institution: 'State Bank of India',
    lastSync: new Date().toISOString(),
    notes: 'Secondary credit card'
  },
  {
    id: '5',
    name: 'Paytm Wallet',
    type: ACCOUNT_TYPES[1],           // wallet
    subType: ACCOUNT_SUBTYPES[2],     // paytm
    balance: 4567,
    institution: 'Paytm',
    lastSync: new Date().toISOString(),
    notes: 'Digital wallet for daily transactions'
  },
  {
    id: '6',
    name: 'Amex Credit Card',
    type: ACCOUNT_TYPES[2],           // card
    subType: ACCOUNT_SUBTYPES[6],     // credit
    balance: 0,
    institution: 'American Express',
    lastSync: new Date().toISOString(),
    notes: 'Premium credit card'
  },
  {
    id: '7',
    name: 'HDFC Mutual Funds',
    type: ACCOUNT_TYPES[3],           // investments
    subType: ACCOUNT_SUBTYPES[15],    // mutual_funds
    balance: 50000,
    institution: 'HDFC Mutual Fund',
    lastSync: new Date().toISOString(),
    notes: 'Long term investments'
  },
  {
    id: '8',
    name: 'Zerodha Stocks',
    type: ACCOUNT_TYPES[3],           // investments
    subType: ACCOUNT_SUBTYPES[14],    // stocks
    balance: 75000,
    institution: 'Zerodha',
    lastSync: new Date().toISOString(),
    notes: 'Stock trading account'
  },
  {
    id: '9',
    name: 'SBI Home Loan',
    type: ACCOUNT_TYPES[4],           // loan
    subType: ACCOUNT_SUBTYPES[10],    // home
    balance: -2500000,
    institution: 'State Bank of India',
    lastSync: new Date().toISOString(),
    notes: 'Home loan EMI due on 5th'
  }
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