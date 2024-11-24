import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors } from '../../constants/colors';
import { Account } from '../../types/Transaction';
import { AmountInput } from '../transaction/AmountInput';
import { AccountSelector } from '../transaction/AccountSelector';
import { DateTimePicker } from '../transaction/DateTimePicker';
import { RemarksInput } from '../transaction/RemarksInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { BaseFormData } from '../../types/BaseFormData';

interface TransferFormProps {
  data: BaseFormData;
  onChange: (data: BaseFormData) => void;
  accounts: Account[];
  onSave: () => void;
  onSaveAndContinue: () => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
  data,
  onChange,
  accounts,
  onSave,
  onSaveAndContinue
}) => {
  const toAccountOptions = accounts.filter(acc => acc.id !== data.accountId);

  return (
    <View style={styles.container}>
      {/* Amount Input */}
      <View style={styles.amountSection}>
        <AmountInput
          value={data.amount}
          onChange={(amount) => onChange({ ...data, amount })}
        />
      </View>

      {/* Main Form Section */}
      <View style={styles.formSection}>
        {/* From Account */}
        <View style={styles.accountRow}>
          <Text style={styles.label}>From</Text>
          <View style={styles.inputContainer}>
            <AccountSelector
              accounts={accounts}
              selectedId={data.accountId}
              onSelect={(id) => onChange({
                ...data,
                accountId: id,
                toAccountId: id === data.toAccountId ? '' : data.toAccountId
              })}
            />
          </View>
        </View>

        {/* To Account */}
        <View style={styles.accountRow}>
          <Text style={styles.label}>To</Text>
          <View style={styles.inputContainer}>
            <AccountSelector
              accounts={toAccountOptions}
              selectedId={data.toAccountId ? data.toAccountId : ''}
              onSelect={(id) => onChange({ ...data, toAccountId: id })}
            />
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.inputContainer}>
            <DateTimePicker
              date={data.date}
              onDateChange={(date) => onChange({ ...data, date })}
            />
          </View>
        </View>

        {/* Remarks Input */}
        <View style={styles.remarksRow}>
          <Text style={[styles.label, styles.remarksLabel]}>Notes</Text>
          <View style={styles.remarksInputContainer}>
            <RemarksInput
              value={data.remarks}
              onChange={(remarks) => onChange({ ...data, remarks })}
            />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={onSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.continueButton]}
          onPress={onSaveAndContinue}
        >
          <Text style={styles.continueButtonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  amountSection: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,

    borderBottomColor: colors.border,
  },
  formSection: {
    paddingTop: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    minHeight: 48,
    borderBottomColor: colors.border,
  },
  // Reduced height for account rows
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4, // Reduced padding
    paddingHorizontal: 12,
    minHeight: 42, // Reduced height
    borderBottomColor: colors.border,
  },
  label: {
    width: 70,
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  inputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  // Compact arrow row
  arrowRow: {
    flexDirection: 'row',
    paddingVertical: 2, // Minimal padding
    paddingHorizontal: 12,
    height: 20, // Reduced height
  },
  arrowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  arrowLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  // Remarks styling
  remarksRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 12,
    minHeight: 40,
    borderBottomColor: colors.border,
  },
  remarksLabel: {
    paddingTop: 8,
  },
  remarksInputContainer: {
    flex: 1,
    marginLeft: 12,
  },
  buttonContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  continueButton: {
    backgroundColor: `${colors.primary}10`,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default TransferForm;