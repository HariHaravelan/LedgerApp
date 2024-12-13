import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';
import ActionButtons from '../../components/ActionButtons';
import { SMSTransaction, Transaction } from '../../types/Transaction';
import { transactions } from '../../data/TransactionData';
import EditTransactionScreen from './EditTransactionScreen';
import { TransactionScannerModal } from '../../components/sms/TransactionScannerModal';
import SMSTransactionSummary from '../../components/sms/SMSTransactionSummary';
import { truncateText } from '../../utils/formatting';

const formatDate = (dateString: string): { date: string; monthYear: string; day: string } => {
  const date = new Date(dateString);
  return {
    date: date.getDate().toString().padStart(2, '0'),
    monthYear: date.toLocaleDateString('en-US', {
      month: 'short',
      year: '2-digit'
    }),
    day: date.toLocaleDateString('en-US', { weekday: 'short' })
  };
};

const formatAmount = (amount: number): string => {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absAmount);
  return `${formatted}`;
};

const getMonthlyStatistics = (
  transactions: Transaction[],
  selectedDate: Date
): { income: number; expenses: number; total: number } => {
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  // Filter transactions for the selected month and year
  const monthlyTransactions = transactions.filter(transaction => {
    const txDate = new Date(transaction.date);
    return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
  });

  // Calculate totals
  const stats = monthlyTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount; // Assuming expenses are stored as negative values
      }
      return acc;
    },
    { total: 0, income: 0, expenses: 0 }
  );

  // Calculate total (net)
  stats.total = stats.income + stats.expenses;

  return stats;
};

const TransactionsScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showEditTransaction, setShowEditTransaction] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showSMSSummary, setShowSMSSummary] = useState(false);
  const [scannedTransactions, setScannedTransactions] = useState<SMSTransaction[]>([]);

  // When scan completes
  const handleScanComplete = (transactions: SMSTransaction[]) => {
    console.log('transactions',transactions);
    setScannedTransactions(transactions);
    setShowScanner(false);
    setShowSMSSummary(true);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowEditTransaction(true);
  };

  const handleDeleteTransaction = () => {
    // Add your delete logic here
    console.log('Deleting transaction:', selectedTransaction?.id);
  };

  const groupedTransactions = transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(transaction);
    return groups;
  }, {});

  const getDailyTotals = (transactions: Transaction[]) => {
    return transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === 'income') {
          totals.income += transaction.amount;
        } else {
          totals.expense += transaction.amount; // Keep negative value
        }
        return totals;
      },
      { income: 0, expense: 0 }
    );
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatMonth = (date: Date) => {
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month} '${year}`;
  };

  const { income: monthlyIncome, expenses: monthlyExpenses, total: monthlyTotal } =
    getMonthlyStatistics(transactions, currentDate);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

      if (showEditTransaction) {
        setShowEditTransaction(false);
        return true;
      }
      return false; // Allows default back behavior if no modals are open
    });

    return () => backHandler.remove();
  }, [showEditTransaction]);

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth('prev')}>
            <Text style={styles.monthSelectorArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.currentMonth}>{formatMonth(currentDate)}</Text>
          <TouchableOpacity onPress={() => changeMonth('next')}>
            <Text style={styles.monthSelectorArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="search-outline" size={18} color={colors.text} />
            <Text style={styles.actionText}>Find</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowScanner(true)}>
            <Icon name="mail-unread-outline" size={18} color={colors.text} />
            <Text style={styles.actionText}>SMS</Text>
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.monthSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={[styles.summaryText, styles.incomeText]}>
            {formatAmount(monthlyIncome)}
          </Text>

        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={[styles.summaryText, styles.expenseText]}>
            {formatAmount(monthlyExpenses)}
          </Text>

        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={[
            styles.summaryText,
            monthlyTotal >= 0 ? styles.incomeText : styles.expenseText
          ]}>
            {formatAmount(monthlyTotal)}
          </Text>

        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.keys(groupedTransactions)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
          .map((date, index) => {
            const dailyTransactions = groupedTransactions[date];
            const { income, expense } = getDailyTotals(dailyTransactions);
            const formattedDate = formatDate(date);

            return (
              <View key={date} style={styles.section}>
                <View style={styles.dateHeader}>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateNumber}>{formattedDate.date}</Text>
                    <View style={styles.dateMetadata}>
                      <Text style={styles.dateMonth}>{formattedDate.monthYear}</Text>
                      <Text style={styles.dateDay}>{formattedDate.day}</Text>
                    </View>
                  </View>

                  <View style={styles.dayTotals}>
                    {income > 0 && (
                      <Text style={styles.incomeText}>{formatAmount(income)}</Text>
                    )}
                    {expense < 0 && (
                      <Text style={styles.expenseText}>{formatAmount(expense)}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.transactionsList}>
                  {dailyTransactions.map((tx) => (
                    <TouchableOpacity
                      key={tx.id}
                      style={styles.transactionRow}
                      activeOpacity={0.7}
                      onPress={() => handleTransactionPress(tx)}
                    >
                      <View style={styles.transactionContent}>
                        <View style={styles.categoryContainer}>
                          <Text numberOfLines={1} style={styles.categoryText}>
                            {truncateText(tx.category.name, 12)}
                          </Text>
                        </View>
                        {/* <Text numberOfLines={1} style={styles.accountText}>
                          {tx.toAccount ? (
                            `${truncateText(tx.account.name, 10)} → ${truncateText(tx.toAccount.name, 10)}`
                          ) : (
                            truncateText(tx.account.name, 15)
                          )}
                        </Text> */}
                        <Text numberOfLines={1} style={styles.accountText}>
                          {tx.toAccount ? (
                            <>
                              <Text style={styles.transferAccountText}>
                                {truncateText(tx.account.name, 8)}
                              </Text>
                              <Text style={styles.transferArrow}> → </Text>
                              <Text style={styles.transferAccountText}>
                                {truncateText(tx.toAccount.name, 8)}
                              </Text>
                            </>
                          ) : (
                            <Text style={styles.accountText}>
                              {truncateText(tx.account.name, 15)}
                            </Text>
                          )}
                        </Text>
                        <Text style={[
                          styles.amountText,
                          tx.type === 'income' ? styles.incomeText : styles.expenseText
                        ]}>
                          {formatAmount(tx.amount)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })}
      </ScrollView>
      <Modal
        visible={showEditTransaction}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedTransaction && (
          <EditTransactionScreen
            transaction={selectedTransaction}
            onClose={() => {
              setShowEditTransaction(false);
              setSelectedTransaction(null);
            }}
            onDelete={handleDeleteTransaction}
          />
        )}
      </Modal>


      <TransactionScannerModal
        visible={showScanner}
        handleScanComplete={handleScanComplete}
        onClose={() => setShowScanner(false)}
      />

      <ActionButtons />
      {showSMSSummary && (
        <Modal
          visible={showSMSSummary}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <SMSTransactionSummary
            transactions={scannedTransactions}
            onClose={() => setShowSMSSummary(false)}
            onEdit={(transaction) => {
              // Handle edit
              console.log('Edit transaction:', transaction);
            }}
            onAdd={(transaction) => {
              // Handle add
              console.log('Add transaction:', transaction);
            }}
          />
        </Modal>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transferArrow: {
    color: colors.textLight,
    fontSize: 12,
    marginHorizontal: 4,
  },
  transferAccountText: {
    fontSize: 12,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 40, // Fixed height for header
  },
  monthSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryText: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: colors.primary,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  monthSelectorArrow: {
    fontSize: 18,
    color: colors.primary,
    paddingHorizontal: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: `${colors.primary}05`,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    width: 24,
    textAlign: 'center',
  },
  dateMetadata: {
    justifyContent: 'center',
  },
  dateMonth: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 13,
  },
  dateDay: {
    fontSize: 11,
    color: colors.textLight,
    lineHeight: 13,
  },
  dayTotals: {
    flexDirection: 'row',
    gap: 12,
  },
  transactionsList: {
    backgroundColor: colors.white,
  },
  transactionRow: {
    paddingVertical: 8,  // Increased padding for better spacing
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18, // Added gap between elements
  },
  categoryContainer: {
    width: 100, // Fixed width for category
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.text,
  },
  accountText: {
    fontSize: 12,
    color: colors.textLight,
    flex: 1,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '500',
    width: 90, // Fixed width for amount
    textAlign: 'right',
  },

  currentMonth: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    width: 60,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 1,
    backgroundColor: colors.white,
  },
  daySummary: {
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },

  summaryAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  remarkText: {
    fontSize: 11,
    color: colors.textLight,
  },
  totalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TransactionsScreen;