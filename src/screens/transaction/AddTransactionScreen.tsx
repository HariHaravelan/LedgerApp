// src/screens/AddTransactionScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { colors } from '../../constants/colors';
import { DateTimePicker } from '../../components/transaction/DateTimePicker';
import { TypeSelector } from '../../components/transaction/TypeSelector';
import { AccountSelector } from '../../components/transaction/AccountSelector';
import { CategorySelector } from '../../components/transaction/CategorySelector';
import { CATEGORIES } from '../../data/TransactionData';
import { AmountInput } from '../../components/transaction/AmountInput';
import { RemarksInput } from '../../components/transaction/RemarksInput';

interface Props {
  onClose: () => void;
}


const ACCOUNTS = [
  { id: '1', name: 'HDFC Savings', balance: 25000, type: 'bank' },
  { id: '2', name: 'ICICI Credit Card', balance: -15000, type: 'card' },
  { id: '3', name: 'Cash Wallet', balance: 5000, type: 'wallet' },
];

const AddTransactionScreen: React.FC<Props> = ({ onClose }) => {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [date, setDate] = useState(new Date());
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onClose}
        >
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Transaction</Text>
        <TouchableOpacity
          style={[styles.saveButton, !amount && styles.saveButtonDisabled]}
          disabled={!amount}
          onPress={() => {
            // Handle save logic
            console.log({
              type,
              date,
              account: selectedAccount,
              category: selectedCategory,
              amount,
              remarks
            });
            onClose();
          }}
        >
          <Text style={[styles.saveButtonText, !amount && styles.saveButtonTextDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TypeSelector
          selected={type}
          onSelect={setType}
        />
        <DateTimePicker
          date={date}
          onDateChange={setDate}
        />

        <View style={styles.form}>
          <AccountSelector
            accounts={ACCOUNTS}
            selectedId={accountId}
            onSelect={setAccountId}
          />
          <CategorySelector
            categories={CATEGORIES.filter(c => c.type === type)}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />
          <AmountInput
            value={amount}
            onChange={setAmount}
          />
          <RemarksInput
            value={remarks}
            onChange={setRemarks}
          />
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  saveButtonTextDisabled: {
    color: colors.textLight,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  form: {
    padding: 16,
    gap: 16,
  },
});

export default AddTransactionScreen;