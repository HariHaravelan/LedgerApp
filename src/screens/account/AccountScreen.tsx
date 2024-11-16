// src/screens/AccountsScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

// Types
interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'card' | 'investment';
  subtype?: string;
  institution?: string;
  lastSync?: string;
  color?: string;
}

// Sample data with enhanced details
const accounts: Account[] = [
  { 
    id: '1', 
    name: 'HDFC Savings',
    balance: 25000,
    type: 'bank',
    subtype: 'savings',
    institution: 'HDFC Bank',
    lastSync: '2024-03-16T10:30:00',
    color: '#ff0000'
  },
  { 
    id: '2', 
    name: 'SBI Current', 
    balance: 45000, 
    type: 'bank', 
    subtype: 'current',
    institution: 'State Bank of India',
    lastSync: '2024-03-16T09:15:00',
    color: '#2E5BFF'
  },
  { 
    id: '3', 
    name: 'ICICI FD', 
    balance: 100000, 
    type: 'bank', 
    subtype: 'fd',
    institution: 'ICICI Bank',
    lastSync: '2024-03-15T18:20:00',
    color: '#F6A609'
  },
  { 
    id: '4', 
    name: 'HDFC Credit Card', 
    balance: -15000, 
    type: 'card',
    institution: 'HDFC Bank',
    lastSync: '2024-03-16T11:00:00',
    color: '#10B981'
  },
  { 
    id: '5', 
    name: 'Amazon Pay Card', 
    balance: -5000, 
    type: 'card',
    institution: 'ICICI Bank',
    lastSync: '2024-03-16T10:45:00',
    color: '#EC4899'
  },
  { 
    id: '6', 
    name: 'Mutual Funds', 
    balance: 50000, 
    type: 'investment',
    institution: 'Groww',
    lastSync: '2024-03-16T09:30:00',
    color: '#8B5CF6'
  },
  { 
    id: '7', 
    name: 'Stocks', 
    balance: 75000, 
    type: 'investment',
    institution: 'Zerodha',
    lastSync: '2024-03-16T09:30:00',
    color: '#6366F1'
  },
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

  // Helper function to format last sync time
  const formatLastSync = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const AccountCard: React.FC<{ account: Account }> = ({ account }) => (
    <TouchableOpacity style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.institutionName}>{account.institution}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textLight} />
      </View>
      
      <View style={styles.accountFooter}>
        <View style={styles.accountBalance}>
          <Text style={[
            styles.balanceAmount,
            account.balance < 0 && styles.negativeBalance
          ]}>
            {formatAmount(account.balance)}
          </Text>
          {account.subtype && (
            <View style={styles.accountType}>
              <Text style={styles.accountTypeText}>
                {account.subtype.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.lastSync}>
          Updated {formatLastSync(account.lastSync || '')}
        </Text>
      </View>
    </TouchableOpacity>
  );
  

  // Function to render account groups
  const renderAccountGroup = (title: string, type: Account['type'], icon: string) => {
    const groupAccounts = accounts.filter(account => account.type === type);
    const totalBalance = groupAccounts.reduce((sum, account) => sum + account.balance, 0);
  
    if (groupAccounts.length === 0) return null;
  
    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <View style={styles.groupTitleContainer}>
            <View style={styles.groupIconContainer}>
              <Icon name={icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.accountCount}>
              <Text style={styles.accountCountText}>{groupAccounts.length}</Text>
            </View>
          </View>
          <Text style={styles.groupTotal}>{formatAmount(totalBalance)}</Text>
        </View>
  
        {groupAccounts.map((account, index) => (
          <View key={account.id}>
            <AccountCard account={account} />
            {index < groupAccounts.length - 1 && <View style={styles.accountDivider} />}
          </View>
        ))}
      </View>
    );
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAssets = accounts.reduce((sum, account) => 
    account.balance > 0 ? sum + account.balance : sum, 0
  );
  const totalLiabilities = accounts.reduce((sum, account) => 
    account.balance < 0 ? sum + Math.abs(account.balance) : sum, 0
  );

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Net Worth</Text>
        <Text style={styles.summaryAmount}>{formatAmount(totalBalance)}</Text>
        
        <View style={styles.summaryDetails}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Assets</Text>
            <Text style={styles.summaryItemAmount}>
              {formatAmount(totalAssets)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Liabilities</Text>
            <Text style={[styles.summaryItemAmount, styles.negativeBalance]}>
              {formatAmount(-totalLiabilities)}
            </Text>
          </View>
        </View>
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
    backgroundColor: colors.background,
  },
  /**/
  groupContainer: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountCount: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  accountCountText: {
    color: colors.primary,
    fontSize: 12,
  },
  groupTotal: {
    fontSize: 15,
    color: colors.text,
  },
  accountCard: {
    padding: 16,
    backgroundColor: colors.white,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  institutionName: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: 'normal',
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  accountBalance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  negativeBalance: {
    color: '#EF4444',
  },
  accountType: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  accountTypeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '500',
  },
  accountDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  lastSync: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: 'normal',
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 16,
  },
  summaryItemAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: 'normal',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
    fontWeight: 'normal',
  },
  summaryCard: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 20,
    paddingBottom: 24,
  },
  
  summaryDetails: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  
  scrollView: {
    flex: 1,
  },
  accountMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
});

export default AccountsScreen;