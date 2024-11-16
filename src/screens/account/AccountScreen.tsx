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
import { colors } from '../../constants/colors';

type AccountType = 'bank' | 'wallet' | 'card' | 'loan' | 'investment';
type InvestmentType = 'fd' | 'rd' | 'stocks' | 'mutual_funds' | 'gold';

interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  institution: string;
  investmentType?: InvestmentType;
  lastSync?: string;
}

// Sample data aligned with AddAccountScreen structure
const accounts: Account[] = [
  // Bank Accounts
  {
    id: '1',
    type: 'bank',
    name: 'HDFC Savings',
    balance: 25000,
    institution: 'HDFC Bank',
    lastSync: '2024-03-16T10:30:00',
  },
  {
    id: '2',
    type: 'bank',
    name: 'SBI Savings',
    balance: 45000,
    institution: 'State Bank of India',
    lastSync: '2024-03-16T09:15:00',
  },
  
  // Wallets
  {
    id: '3',
    type: 'wallet',
    name: 'Paytm Wallet',
    balance: 2500,
    institution: 'Paytm',
    lastSync: '2024-03-16T11:00:00',
  },
  {
    id: '4',
    type: 'wallet',
    name: 'Amazon Pay',
    balance: 1500,
    institution: 'Amazon',
    lastSync: '2024-03-16T10:45:00',
  },
  
  // Credit Cards
  {
    id: '5',
    type: 'card',
    name: 'HDFC Credit Card',
    balance: -15000,
    institution: 'HDFC Bank',
    lastSync: '2024-03-16T11:00:00',
  },
  {
    id: '6',
    type: 'card',
    name: 'Amazon Pay Card',
    balance: -5000,
    institution: 'ICICI Bank',
    lastSync: '2024-03-16T10:45:00',
  },

  // Loans
  {
    id: '7',
    type: 'loan',
    name: 'Home Loan',
    balance: -2500000,
    institution: 'HDFC Bank',
    lastSync: '2024-03-16T09:30:00',
  },
  {
    id: '8',
    type: 'loan',
    name: 'Car Loan',
    balance: -500000,
    institution: 'ICICI Bank',
    lastSync: '2024-03-16T09:30:00',
  },
  
  // Investments
  {
    id: '9',
    type: 'investment',
    name: 'HDFC FD',
    balance: 100000,
    institution: 'HDFC Bank',
    investmentType: 'fd',
    lastSync: '2024-03-15T18:20:00',
  },
  {
    id: '10',
    type: 'investment',
    name: 'Post Office RD',
    balance: 50000,
    institution: 'Post Office',
    investmentType: 'rd',
    lastSync: '2024-03-15T18:20:00',
  },
  {
    id: '11',
    type: 'investment',
    name: 'Mutual Funds',
    balance: 7500000,
    institution: 'Groww',
    investmentType: 'mutual_funds',
    lastSync: '2024-03-16T09:30:00',
  },
  {
    id: '12',
    type: 'investment',
    name: 'Stocks Portfolio',
    balance: 125000,
    institution: 'Zerodha',
    investmentType: 'stocks',
    lastSync: '2024-03-16T09:30:00',
  },
];


const getAccountGroupConfig = (type: AccountType): { icon: string; title: string } => {
  switch (type) {
    case 'bank':
      return { icon: 'business-outline', title: 'Bank Accounts' };
    case 'wallet':
      return { icon: 'wallet-outline', title: 'Wallets' };
    case 'card':
      return { icon: 'card-outline', title: 'Cards' };
    case 'loan':
      return { icon: 'cash-outline', title: 'Loans' };
    case 'investment':
      return { icon: 'trending-up-outline', title: 'Investments' };
    default:
      return { icon: 'help-outline', title: 'Other' };
  }
};

const AccountCard: React.FC<{ account: Account }> = ({ account }) => (
  <TouchableOpacity style={styles.accountCard}>
    <View style={styles.accountMain}>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>
          {account.name}
          
        </Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={[
          styles.balanceAmount,
          account.balance < 0 && styles.negativeBalance
        ]}>
          {formatAmount(account.balance)}
        </Text>
        <Icon name="chevron-forward" size={20} color={colors.textLight} />
      </View>
    </View>
  </TouchableOpacity>
);

const formatAmount = (amount: number): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
  
  return isNegative ? `-${formatted}` : formatted;
};

const AccountsScreen = () => {
  // Function to render account groups
  const renderAccountGroup = (title: string, type: AccountType, icon: string) => {
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {['bank', 'wallet', 'card', 'loan', 'investment'].map((type) => {
          const config = getAccountGroupConfig(type as AccountType);
          return renderAccountGroup(config.title, type as AccountType, config.icon);
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
  summaryCard: {
    backgroundColor: colors.primary,
    width: '100%',
    padding: 20,
    paddingBottom: 24,
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
    marginBottom: 16,
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
  summaryItemLabel: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
    marginBottom: 4,
  },
  summaryItemAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
  },
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
  accountMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 15,
    color: colors.text,
  },
  accountType: {
    fontSize: 13,
    color: colors.textLight,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 15,
    color: colors.text,
  },
  negativeBalance: {
    color: '#EF4444',
  },
  accountDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingTop: 16, // Add some padding at the top
  },
  scrollContent: {
    paddingBottom: 24, // Add padding at the bottom for better scroll experience
  },
});

export default AccountsScreen;