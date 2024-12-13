import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constants/colors';
import { DetectedAccount } from '../../../types/SMSTypes';
import { truncateText } from '../../../utils/formatting';
import { formatLastTransaction } from '../../../utils/formatting';

interface AccountCardProps {
  account: DetectedAccount;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onEdit: (account: DetectedAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isSelected,
  onToggle,
  onEdit,
}) => (
  <TouchableOpacity
    style={[styles.accountCard, isSelected && styles.accountCardSelected]}
    onPress={() => onToggle(account.id)}
    activeOpacity={0.7}
  >
    <View style={[
      styles.selectionIndicator,
      isSelected && styles.selectionIndicatorSelected
    ]}>
      <Icon
        name={isSelected ? "checkmark-circle" : "ellipse-outline"}
        size={20}
        color={isSelected ? "#2E5BFF" : colors.border}
      />
    </View>

    <View style={styles.mainContent}>
      <View style={styles.bankInfo}>
        <Text style={styles.bankName}>{truncateText(account.institution, 20)}</Text>
        <Text style={styles.accountNumber}>•••• {account.accountNumber}</Text>
      </View>

      <View style={styles.transactionInfo}>
        <Icon name="time-outline" size={12} color={colors.textLight} />
        <Text style={styles.lastSync}>
          Last transaction: {formatLastTransaction(new Date(account.lastTransaction))}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      style={styles.editButton}
      onPress={() => onEdit(account)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name="pencil" size={16} color={colors.textLight} />
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
  },
  accountCardSelected: {
    backgroundColor: `${colors.primary}08`,
  },
  selectionIndicator: {
    marginRight: 16,
  },
  selectionIndicatorSelected: {
    transform: [{ scale: 1.1 }],
  },
  mainContent: {
    flex: 1,
    marginLeft: 12,
  },
  bankInfo: {
    marginBottom: 4,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  accountNumber: {
    fontSize: 14,
    color: colors.textLight,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lastSync: {
    fontSize: 12,
    color: colors.textLight,
  },
  editButton: {
    padding: 8,
    marginLeft: 8,
  },
});