// src/screens/AddTransactionScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { themeColors } from '../../constants/colors';
import TransactionTypeTabs, { TransactionType } from '../../components/transaction/TransactionTypeTabs';
import ExpenseForm, { ExpenseFormData } from '../../components/forms/ExpenseForm';
import { ACCOUNTS, CATEGORIES } from '../../data/TransactionData';
import { IncomeForm } from '../../components/forms/IncomeForm';
import TransferForm, { TransferFormData } from '../../components/forms/TransferForm';

interface AddTransactionScreenProps {
  onClose: () => void;
}

const AddTransactionScreen: React.FC<AddTransactionScreenProps> = ({ onClose }) => {
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: '',
    account: '',
    date: new Date(),
    remarks: '',
  });

  const [transferformData, setTransferFormData] = useState<TransferFormData>({
    amount: '',
    fromAccountId: '',
    toAccountId: '',
    date: new Date(),
    remarks: ''
  });

  const handleSave = (shouldContinue: boolean = false) => {
    // Handle save logic here
    if (!shouldContinue) {
      onClose();
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log("here");
      onClose();
      return true; // Prevents default back behavior
    });

    return () => backHandler.remove();
  }, [onClose]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Content */}
      <TransactionTypeTabs
        selectedType={transactionType}
        onTypeChange={setTransactionType}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView bounces={false}>
          {transactionType === 'expense' && (
            <ExpenseForm
              data={formData}
              onChange={setFormData}
              categories={CATEGORIES}
              accounts={ACCOUNTS}
              onSave={() => {/* handle save */ }}
              onSaveAndContinue={() => {/* handle save and continue */ }}
            />
          )}

          {transactionType === 'income' && (
            <IncomeForm
              data={formData}
              onChange={setFormData}
              categories={CATEGORIES} // Pass income-specific categories
              accounts={ACCOUNTS}
              onSave={() => {/* handle save */ }}
              onSaveAndContinue={() => {/* handle save and continue */ }}
            />
          )}
          {transactionType === 'transfer' && (
            <TransferForm
              data={transferformData}
              onChange={setTransferFormData}
              accounts={ACCOUNTS}
              onSave={() => {/* handle save */ }}
              onSaveAndContinue={() => {/* handle save and continue */ }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: themeColors.white,
    borderBottomWidth: 1,
    borderBottomColor: themeColors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: themeColors.text,
    letterSpacing: 0.1,
  },
  headerButton: {
    fontSize: 16,
    color: themeColors.primary,
    fontWeight: '500',
  },
  bottomButtons: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: themeColors.border,
    backgroundColor: themeColors.white,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1, // Makes buttons take equal width
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: themeColors.primary,
  },
  continueButton: {
    backgroundColor: `${themeColors.primary}20`,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.white,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: themeColors.primary,
  },
});

export default AddTransactionScreen;