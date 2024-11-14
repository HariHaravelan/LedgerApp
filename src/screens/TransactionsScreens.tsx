// src/screens/TransactionsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/colors';

interface Transaction {
  id: string;
  date: string;
  category: string;
  remarks: string;
  account: string;
  amount: number;
  type: 'income' | 'expense';
}

// Helper function for date formatting
const formatDate = (date: string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });
};

// Helper function for amount formatting
const formatAmount = (amount: number): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  let numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  let otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

// Sample transactions data
const transactions: Transaction[] = [
  // Today
  {
    id: '1',
    date: '2024-03-14',
    category: 'Food',
    remarks: 'Lunch with team',
    account: 'HDFC Debit Card',
    amount: -850,
    type: 'expense'
  },
  {
    id: '2',
    date: '2024-03-14',
    category: 'Shopping',
    remarks: 'Groceries',
    account: 'Amazon Pay',
    amount: -2100,
    type: 'expense'
  },
  // Yesterday
  {
    id: '3',
    date: '2024-03-13',
    category: 'Salary',
    remarks: 'Monthly Salary',
    account: 'HDFC Savings',
    amount: 75000,
    type: 'income'
  },
  {
    id: '4',
    date: '2024-03-13',
    category: 'Bills',
    remarks: 'Electricity Bill',
    account: 'SBI Credit Card',
    amount: -3200,
    type: 'expense'
  },
  // 2 days ago
  {
    id: '5',
    date: '2024-03-12',
    category: 'Transport',
    remarks: 'Uber to Office',
    account: 'Paytm Wallet',
    amount: -250,
    type: 'expense'
  },
  {
    id: '6',
    date: '2024-03-12',
    category: 'Entertainment',
    remarks: 'Movie Tickets',
    account: 'HDFC Credit Card',
    amount: -1200,
    type: 'expense'
  },
  // 3 days ago
  {
    id: '7',
    date: '2024-03-11',
    category: 'Investment',
    remarks: 'Mutual Fund SIP',
    account: 'ICICI Savings',
    amount: -10000,
    type: 'expense'
  },
  // 4 days ago
  {
    id: '8',
    date: '2024-03-10',
    category: 'Shopping',
    remarks: 'Amazon Purchase',
    account: 'Amazon Pay Card',
    amount: -4500,
    type: 'expense'
  },
  // 5 days ago
  {
    id: '9',
    date: '2024-03-09',
    category: 'Food',
    remarks: 'Dinner with Family',
    account: 'HDFC Credit Card',
    amount: -3200,
    type: 'expense'
  },
  // 6 days ago
  {
    id: '10',
    date: '2024-03-08',
    category: 'Rent',
    remarks: 'Monthly Rent',
    account: 'HDFC Savings',
    amount: -25000,
    type: 'expense'
  },
];

const TransactionsScreen = () => {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Calculate daily totals
  const getDailyTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'income') {
          totals.income += transaction.amount;
        } else {
          totals.expense += Math.abs(transaction.amount);
        }
        return totals;
      },
      { income: 0, expense: 0 }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedTransactions)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map(date => {
            const dailyTransactions = groupedTransactions[date];
            const { income, expense } = getDailyTotals(dailyTransactions);

            return (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                  <View style={styles.dailyTotals}>
                    {income > 0 && (
                      <Text style={styles.incomeText}>+{formatAmount(income)}</Text>
                    )}
                    {expense > 0 && (
                      <Text style={styles.expenseText}>-{formatAmount(expense)}</Text>
                    )}
                  </View>
                </View>

                {dailyTransactions.map(transaction => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <Text style={styles.category}>
                      {transaction.category}
                    </Text>
                    
                    <View style={styles.centerSection}>
                      <Text style={styles.remarks}>
                        {transaction.remarks}
                      </Text>
                      <Text style={styles.account}>
                        {transaction.account}
                      </Text>
                    </View>

                    <Text style={[
                      styles.amount,
                      transaction.type === 'income' ? styles.incomeText : styles.expenseText
                    ]}>
                      {formatAmount(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dailyTotals: {
    flexDirection: 'row',
    gap: 12,
  },
  transactionCard: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    width: '25%', // Adjust this value to control category width
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  remarks: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  account: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  amount: {
    width: '25%', // Adjust this value to control amount width
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'right',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: colors.error,
  },
});

export default TransactionsScreen;