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
import { colors } from '../../../constants/colors';
import { DetectedAccount } from '../../../types/SMSTypes';
import { AccountCard } from './AccountCard';

interface AccountSelectionStepProps {
  accounts: DetectedAccount[];
  selectedAccounts: Set<string>;
  setSelectedAccounts: (accounts: Set<string>) => void;
  onContinue: () => void;
}

export const AccountSelectionStep: React.FC<AccountSelectionStepProps> = ({
  accounts,
  selectedAccounts,
  setSelectedAccounts,
  onContinue,
}) => {
  const groupedAccounts = groupAccountsByType(accounts);

  const handleToggleAccount = (accountId: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedAccounts(newSelected);
  };

  const handleEditAccount = (account: DetectedAccount) => {
    // Handle edit functionality
    console.log('Edit account:', account.id);
  };

  return (
    <View style={styles.stepContentContainer}>
      <ScrollView
        style={styles.accountsList}
        contentContainerStyle={styles.accountsListContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedAccounts).map(([type, accounts]) => (
          <View key={type} style={styles.accountGroup}>
            <View style={styles.groupHeader}>
              <Icon name={getTypeIcon(type)} size={18} color={colors.text} />
              <Text style={styles.groupTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              <View style={styles.accountCount}>
                <Text style={styles.accountCountText}>{accounts.length}</Text>
              </View>
            </View>

            {accounts.map((account, index) => (
              <View key={account.id}>
                <AccountCard
                  account={account}
                  isSelected={selectedAccounts.has(account.id)}
                  onToggle={handleToggleAccount}
                  onEdit={handleEditAccount}
                />
                {index < accounts.length - 1 && <View style={styles.cardDivider} />}
              </View>
            ))}
          </View>
        ))}
        <View style={styles.scrollPadding} />
      </ScrollView>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedAccounts.size === 0 && styles.continueButtonDisabled
          ]}
          onPress={onContinue}
          disabled={selectedAccounts.size === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue with {selectedAccounts.size} {selectedAccounts.size === 1 ? 'account' : 'accounts'}
          </Text>
          <Icon name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper functions
const groupAccountsByType = (accounts: DetectedAccount[]) => {
  return accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, DetectedAccount[]>);
};

const getTypeIcon = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'wallet':
      return 'wallet-outline';
    case 'account':
      return 'cash-outline';
    case 'card':
      return 'card-outline';
    case 'loan':
      return 'trending-up-outline';
    default:
      return 'business-outline';
  }
};

const styles = StyleSheet.create({
  stepContentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  accountsList: {
    flex: 1,
  },
  accountsListContent: {
    paddingVertical: 12,
  },
  accountGroup: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginLeft: 8,
  },
  accountCount: {
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  accountCountText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  scrollPadding: {
    height: 100,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});