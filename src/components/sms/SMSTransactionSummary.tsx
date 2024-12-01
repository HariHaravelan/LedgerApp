// src/screens/transaction/SMSTransactionSummary.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import { SMSTransaction } from '../../types/Transaction';

interface SMSTransactionSummaryProps {
  onClose: () => void;
  transactions: SMSTransaction[];
  onEdit?: (transaction: SMSTransaction) => void;
  onAdd?: (transaction: SMSTransaction) => void;
}

const SMSTransactionSummary: React.FC<SMSTransactionSummaryProps> = ({
  onClose,
  transactions,
  onEdit,
  onAdd,
}) => {

  const formatAmount = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
    return `₹${formatted}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onClose}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Icon name="mail" size={24} color={colors.primary} />
          <Text style={styles.headerTitle}>SMS Transactions</Text>
        </View>
        <Text style={styles.headerCount}>
          {transactions.length} transactions
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.cardHeader}>
              <View style={styles.senderContainer}>
                <Text style={styles.sender}>{transaction.merchantName}</Text>
                <Text style={styles.date}>
                  {new Date(transaction.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[
                styles.amount,
                transaction.type === 'credit' ? styles.creditAmount : styles.debitAmount
              ]}>
                {formatAmount(transaction.amount)}
              </Text>
            </View>
            
            <Text style={styles.messageBody} numberOfLines={3}>
              {transaction.originalSMS}
            </Text>
            
            <View style={styles.cardFooter}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onEdit?.(transaction)}
              >
                <Icon name="create-outline" size={20} color={colors.primary} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => onAdd?.(transaction)}
              >
                <Icon name="add-circle-outline" size={20} color={colors.success} />
                <Text style={styles.actionButtonText}>Add Transaction</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerCount: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  transactionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderContainer: {
    flex: 1,
    marginRight: 16,
  },
  sender: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: colors.textLight,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  creditAmount: {
    color: colors.success,
  },
  debitAmount: {
    color: colors.error,
  },
  messageBody: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
});

export default SMSTransactionSummary;