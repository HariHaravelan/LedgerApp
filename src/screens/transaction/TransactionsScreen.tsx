import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import ActionButtons from '../../components/ActionButtons';

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

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '.' : text;
};

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
  

  const [currentDate, setCurrentDate] = useState(new Date());

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    // Handle month change logic here
  };

  const formatMonth = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation and Actions Bar */}
      <View style={styles.navigationBar}>
        <View style={styles.monthSelector}>
          <TouchableOpacity 
            style={styles.monthNavButton}
            onPress={() => changeMonth('prev')}
          >
            <Icon name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.monthTextContainer}>
            <Text style={styles.monthText}>{formatMonth(currentDate)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.monthNavButton}
            onPress={() => changeMonth('next')}
          >
            <Icon name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Search')}
          >
            <Icon name="search-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>Find</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Read SMS')}
          >
            <Icon name="mail-unread-outline" size={18} color={colors.primary} />
            <Text style={styles.actionButtonText}>SMS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transactions List */}
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
                      {truncateText(transaction.category, 10)}
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
      <ActionButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthNavButton: {
    padding: 4,
  },
  monthTextContainer: {
    minWidth: 80,
    alignItems: 'center',
  },
  monthText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  transactionsList: {
    flex: 1,
  },
  category: {
    width: '25%',
    fontSize: 13, // Smaller font size
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
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