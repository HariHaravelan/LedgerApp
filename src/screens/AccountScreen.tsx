// src/screens/AccountsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

// Types
interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
  subtype?: string;
}

// Sample data
const accounts: Account[] = [
  { id: '1', name: 'HDFC Savings', balance: 25000, type: 'bank', subtype: 'savings' },
  { id: '2', name: 'SBI Current', balance: 45000, type: 'bank', subtype: 'current' },
  { id: '3', name: 'ICICI FD', balance: 100000, type: 'bank', subtype: 'fd' },
  { id: '4', name: 'HDFC Credit Card', balance: -15000, type: 'card' },
  { id: '5', name: 'Amazon Pay Card', balance: -5000, type: 'card' },
  { id: '6', name: 'Mutual Funds', balance: 50000, type: 'investment' },
  { id: '7', name: 'Stocks', balance: 75000, type: 'investment' },
];

const AccountsScreen = () => {
  // Helper function to format amount
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

  // Function to render account groups
  const renderAccountGroup = (title: string, type: string, icon: string) => {
    const groupAccounts = accounts.filter(account => account.type === type);
    const totalBalance = groupAccounts.reduce((sum, account) => sum + account.balance, 0);

    if (groupAccounts.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <View style={styles.groupTitleContainer}>
            <Icon name={icon} size={24} color={colors.primary} />
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.accountCount}>
              <Text style={styles.accountCountText}>{groupAccounts.length}</Text>
            </View>
          </View>
          <Text style={styles.groupTotal}>{formatAmount(totalBalance)}</Text>
        </View>

        <View style={styles.accountsContainer}>
          {groupAccounts.map((account) => (
            <TouchableOpacity 
              key={account.id}
              style={styles.accountCard}
            >
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.name}</Text>
                {account.subtype && (
                  <Text style={styles.accountSubtype}>
                    {account.subtype.charAt(0).toUpperCase() + account.subtype.slice(1)}
                  </Text>
                )}
              </View>
              <View style={styles.balanceContainer}>
                <Text style={[
                  styles.balance,
                  account.balance < 0 && styles.negativeBalance
                ]}>
                  {formatAmount(account.balance)}
                </Text>
                <Icon 
                  name="chevron-forward" 
                  size={20} 
                  color={colors.textLight}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Balance</Text>
        <Text style={styles.summaryAmount}>{formatAmount(totalBalance)}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderAccountGroup('Bank Accounts', 'bank', 'wallet-outline')}
        {renderAccountGroup('Credit Cards', 'card', 'card-outline')}
        {renderAccountGroup('Investments', 'investment', 'trending-up-outline')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 20,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  accountCount: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  accountCountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  groupTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  accountsContainer: {
    backgroundColor: colors.white,
  },
  accountCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  accountSubtype: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  negativeBalance: {
    color: colors.error,
  },
});

export default AccountsScreen;