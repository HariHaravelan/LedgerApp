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
import { accounts } from '../../data/AccountsData';

const formatAmount = (amount: number): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  let numStr = absAmount.toString();
  let lastThree = numStr.substring(numStr.length - 3);
  let otherNumbers = numStr.substring(0, numStr.length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `${isNegative ? '-' : ''}₹${formatted}`;
};

const AccountsScreen = () => {
  const renderAccountGroup = (title: string, type: AccountType, icon: string, accounts: Account[]) => {
    const groupAccounts = accounts.filter(account => account.type === type);
    if (groupAccounts.length === 0) return null;

    const totalBalance = groupAccounts.reduce((sum, account) => sum + account.balance, 0);

    return (
      <View style={styles.groupContainer}>
        <View style={styles.groupHeader}>
          <View style={styles.groupTitleContainer}>
            <Icon name={icon} size={16} color={colors.primary} />
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
              style={styles.accountItem}
              activeOpacity={0.7}
            >
              <View style={styles.accountInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.accountName} numberOfLines={1}>
                    {account.name}
                  </Text>
                  <Text style={styles.institutionName} numberOfLines={1}>
                    {account.institution}
                  </Text>
                </View>
                {account.lastSync && (
                  <Text style={styles.syncTime}>
                    Last updated {new Date(account.lastSync).toLocaleTimeString()}
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
                <Icon name="chevron-forward" size={14} color={colors.textLight} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const totalAssets = accounts.reduce((sum, account) => 
    account.balance > 0 ? sum + account.balance : sum, 0
  );
  const totalLiabilities = accounts.reduce((sum, account) => 
    account.balance < 0 ? sum + Math.abs(account.balance) : sum, 0
  );
  const netWorth = totalAssets - totalLiabilities;

  return (
    <View style={styles.container}>
      {/* Compact top summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryMain}>
          <Text style={styles.summaryMainLabel}>Net Worth</Text>
          <Text style={styles.summaryMainAmount}>{formatAmount(netWorth)}</Text>
        </View>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryDetailText}>
            Assets: <Text style={styles.summaryDetailAmount}>{formatAmount(totalAssets)}</Text>
          </Text>
          <Text style={styles.summaryDetailDivider}>•</Text>
          <Text style={styles.summaryDetailText}>
            Liabilities: <Text style={[styles.summaryDetailAmount, styles.negativeBalance]}>
              {formatAmount(-totalLiabilities)}
            </Text>
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderAccountGroup('Bank Accounts', 'bank', 'business-outline', accounts)}
        <View style={styles.sectionDivider} />
        {renderAccountGroup('Wallets', 'wallet', 'wallet-outline', accounts)}
        <View style={styles.sectionDivider} />
        {renderAccountGroup('Cards', 'card', 'card-outline', accounts)}
        <View style={styles.sectionDivider} />
        {renderAccountGroup('Loans', 'loan', 'cash-outline', accounts)}
        <View style={styles.sectionDivider} />
        {renderAccountGroup('Investments', 'investment', 'trending-up-outline', accounts)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  summaryContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  summaryMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  summaryMainLabel: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.9,
  },
  summaryMainAmount: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.white,
  },
  summaryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDetailText: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.9,
  },
  summaryDetailAmount: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.white,
    opacity: 1,
  },
  summaryDetailDivider: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.5,
    marginHorizontal: 6,
  },
  scrollView: {
    flex: 1,
  },
  sectionDivider: {
    height: 6,
    backgroundColor: colors.background,
  },
  groupContainer: {
    backgroundColor: colors.white,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  groupTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountCount: {
    backgroundColor: colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  accountCountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '500',
  },
  groupTotal: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
  },
  accountsContainer: {
    backgroundColor: colors.white,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  accountInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountName: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  institutionName: {
    fontSize: 10,
    color: colors.textLight,
    flex: 1,
  },
  syncTime: {
    fontSize: 9,
    color: colors.textLight,
    marginTop: 1,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balance: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginRight: 4,
  },
  negativeBalance: {
    color: '#EF4444',
  },
});

export default AccountsScreen;